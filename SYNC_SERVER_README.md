# Kitchen Battle Dashboard - Sync Server Setup

This is a WebSocket-based real-time sync server for the Kitchen Battle Dashboard. It broadcasts app state changes across all connected devices.

## Setup (Local Testing)

### 1. Install dependencies
```bash
cd /workspaces/Game-JDave
npm install
```

### 2. Run the sync server locally
```bash
npm start
# Server will start on ws://localhost:8080
```

### 3. Connect the client
By default, the client will attempt to connect to `ws://localhost:8080`. To test:
- Open `site/index.html` in your browser (or via local HTTP server).
- Check DevTools Console for "Connected to sync server" message.
- Open the site on another device/tab, add points on one, and watch it sync to the other.

## Deployment (Production)

For cross-device sync over the internet, deploy the sync server to a platform like Heroku, Railway, or similar:

### Heroku deployment (example)
```bash
# Create Heroku app
heroku create kitchen-battle-sync

# Deploy
git push heroku main

# Update client to connect to the Heroku server
# Edit site/index.html and change:
# const SYNC_SERVER_URL = 'wss://kitchen-battle-sync.herokuapp.com'
```

### Railway deployment (example)
```bash
# Follow Railway.app docs; point to this repository
# Set PORT environment variable (railway does this automatically)
```

### Update client endpoint
Once the server is deployed, edit `site/index.html` and update the `SYNC_SERVER_URL`:

```javascript
// Change from:
const SYNC_SERVER_URL = localStorage.getItem('syncServerUrl') || 'ws://localhost:8080';

// To (example):
const SYNC_SERVER_URL = localStorage.getItem('syncServerUrl') || 'wss://my-sync-server.herokuapp.com';
```

Or set it dynamically via localStorage in the browser console:
```javascript
localStorage.setItem('syncServerUrl', 'wss://my-sync-server.herokuapp.com');
location.reload();
```

## How it works

1. **Client connects** to the WebSocket server.
2. **Server sends initial state** to the new client.
3. **Client broadcasts updates** whenever app state changes (via `broadcastAppStateToSync()`).
4. **Server broadcasts to all** connected clients.
5. **All clients update and re-render** in real-time.

## Troubleshooting

- **Cannot connect**: Check that the sync server is running and accessible from the client network.
- **No sync happening**: Check DevTools Console for connection errors.
- **Server keeps disconnecting**: The client auto-reconnects every 5 seconds. Check server logs for errors.

## Next Steps

- Move sync server to production hosting.
- Update `site/index.html` with the production WebSocket URL.
- Test multi-device sync across your network.
- Optional: Add persistence (database) to survive server restarts.
