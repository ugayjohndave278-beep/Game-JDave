// Optional: Cloud Function for advanced event logging
// Triggered on every database write to 'app' path.
// Logs writes to a separate 'events' collection for audit trail.

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.logAppUpdate = functions.database
  .ref('app')
  .onWrite(async (change, context) => {
    const timestamp = admin.database.ServerValue.TIMESTAMP;
    
    const eventLog = {
      timestamp,
      before: change.before.exists() ? change.before.val() : null,
      after: change.after.exists() ? change.after.val() : null,
    };

    // Log to a separate 'events' collection
    try {
      await admin.database().ref('events').push(eventLog);
      console.log('Event logged:', eventLog);
    } catch (err) {
      console.error('Failed to log event:', err);
    }
  });

// Optional: Backup to Firestore for long-term storage
exports.backupToFirestore = functions.database
  .ref('app')
  .onWrite(async (change, context) => {
    const snapshot = change.after;
    
    if (!snapshot.exists()) {
      console.log('App state deleted; skipping Firestore backup');
      return;
    }

    try {
      await admin.firestore().collection('backups').doc('latest').set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        appState: snapshot.val(),
      });
      console.log('Backup written to Firestore');
    } catch (err) {
      console.error('Failed to backup to Firestore:', err);
    }
  });
