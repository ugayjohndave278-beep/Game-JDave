# Firebase Cloud Functions (Optional)

This folder contains optional Cloud Functions for advanced features:

- **Audit Logging**: Log every database write to a separate `events` collection.
- **Firestore Backup**: Mirror the app state to Firestore for long-term storage.

## Setup (Optional)

To enable Cloud Functions:

### Step 1: Initialize Functions

From the repository root:

```bash
firebase init functions
```

Accept the defaults to create the `functions/` folder (already scaffolded above).

### Step 2: Install Dependencies

```bash
cd functions
npm install
cd ..
```

### Step 3: Deploy Functions

```bash
firebase deploy --only functions
```

Monitor logs:

```bash
firebase functions:log
```

### Step 4: View Events in Firebase Console

Once deployed, every write to the `app` path will trigger `logAppUpdate`, which writes to a new `events` collection. View it in Firebase Console > Realtime Database > Data tab > `events`.

## Cost Considerations

Firebase Cloud Functions are free up to **1M invocations/month**. Your dashboard will trigger 1 write per state update (every button click, score change, etc.). For typical usage:

- **Low**: 100 events/day = 3K/month (free).
- **Medium**: 1K events/day = 30K/month (free).
- **High**: 10K+ events/day (may incur costs; check Firebase billing).

For most team event scenarios (one event per 10–30 seconds during a session), you'll stay well within free tier.

## Disabling Functions

If you don't need audit logging or backups, you can skip functions and just use Realtime Database listeners (which are free and real-time).

