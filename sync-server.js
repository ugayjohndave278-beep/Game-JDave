// Minimal WebSocket sync server for Kitchen Battle Dashboard
// Broadcasts app state changes to all connected clients

const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Kitchen Battle Sync Server\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });
let appState = null; // shared app state

wss.on('connection', (ws) => {
  console.log('Client connected. Total clients:', wss.clients.size);

  // Send current state to new client
  if (appState) {
    ws.send(JSON.stringify({ type: 'sync', data: appState }));
  }

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const payload = JSON.parse(message);
      
      if (payload.type === 'update') {
        // Update shared state
        appState = payload.data;
        
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'sync', data: appState }));
          }
        });
        
        console.log('State updated and broadcasted to', wss.clients.size, 'clients');
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected. Total clients:', wss.clients.size);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

server.listen(PORT, () => {
  console.log(`Sync server listening on port ${PORT}`);
});
