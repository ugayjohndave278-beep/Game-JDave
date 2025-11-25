# Firebase Hosting & Realtime Database Setup

This guide walks you through deploying your Kitchen Battle Dashboard to Firebase Hosting and enabling real-time sync via Firebase Realtime Database.

## Overview

- **Hosting**: Your static site (`site/`) is deployed to Firebase Hosting (custom domain or default `.firebaseapp.com`).
- **Realtime Database**: Your app state syncs in real-time via Firebase Realtime Database.
- **Security Rules**: Database rules restrict writes to the `app` path and validate schema.
- **SPA Routing**: Firebase rewrite rule redirects all non-file requests to `index.html` for single-page app support.

## Prerequisites

- Firebase project already created: `game-dave` (you have credentials in `site/index.html`).
- Node.js + npm installed locally.
- `firebase-cli` tool (will install below).

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

Verify installation:
```bash
firebase --version
```

## Step 2: Authenticate with Firebase

```bash
firebase login
```

This opens a browser to authorize Firebase CLI to deploy to your account. After authorizing, you'll be logged in and ready to deploy.

## Step 3: Verify Project Config

The project is already configured in `.firebaserc` to point to `game-dave`. Verify:

```bash
firebase projects:list
```

Confirm `game-dave` is in the list and marked as default.

## Step 4: Deploy Hosting & Database Rules

From the repository root:

```bash
firebase deploy --only hosting,database
```

This:
- Uploads your `site/` folder to Firebase Hosting.
- Applies database rules from `database.rules.json`.
- Generates a public URL like `https://game-dave.firebaseapp.com`.

**Output**: Look for:
```
Hosting URL: https://game-dave.firebaseapp.com
```

## Step 5: View Your Live Site

Open the generated URL in your browser. Your app should load and:
- Load prior state from localStorage (if available).
- Attempt to connect to the sync server (if configured) OR Firebase Realtime DB (if enabled).
- Check DevTools Console for:
  - "Firebase initialized (modular)" → Firebase SDK loaded.
  - "Saved app state to Firebase" → writes to DB on every change.
  - "Synced state from server" → received Firebase updates.

## Step 6: Test Real-Time Sync Across Devices

1. Open your Firebase Hosting URL on **Device A** in a browser.
2. Open the same URL on **Device B** (or same device, different tab/browser).
3. On Device A: Add a team member or update points.
4. **Device B** should immediately reflect the change (within ~1 second).

If sync works:
- ✅ Firebase Realtime Database is broadcasting changes.
- ✅ Your app is listening to remote updates.

## Step 7 (Optional): Custom Domain

To use your own domain (e.g., `kitchen-battle.com`):

```bash
firebase hosting:domain:create
```

Follow the prompts to add a custom domain. Firebase will ask you to add DNS records to your domain registrar.

## Security Rules Explained

The `database.rules.json` file enforces:

- **`.read: true`** — Anyone can read the entire `app` state (public dashboard).
- **`.write: true`** — Anyone can write updates (suitable for team events; use auth for production).
- **`.validate: ...`** — Only writes that match the expected schema are accepted (prevents accidental data corruption).

### To Add Authentication (Recommended for Production)

Edit `database.rules.json`:

```json
{
  "rules": {
    "app": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".validate": "newData.hasChildren([...])"
    }
  }
}
```

Then redeploy:
```bash
firebase deploy --only database
```

Enable Firebase Authentication in the Firebase Console (Authentication > Sign-in providers > enable Email/Password or Google).

## Troubleshooting

### Deploy fails with "Permission denied"
- Ensure you're logged in: `firebase login`.
- Verify the project: `firebase projects:list`.
- Check that `game-dave` project exists in your Firebase Console.

### Site loads but no Firebase sync
- Check DevTools Console:
  - If "Firebase initialized (modular)" appears, SDK loaded successfully.
  - If "Saved app state to Firebase" appears, writes succeeded.
  - If errors appear, check Firebase Console > Realtime Database > Rules tab for rejection logs.

### Changes don't appear on other devices
- Ensure both devices use the **same Firebase Hosting URL** (not localhost).
- Check that `firebaseEnabled` is `true` in the page console: `window.firebaseEnabled`.
- If WebSocket sync server is running, it may be intercepting writes; disable it temporarily or prioritize Firebase in the client code.

### How to Monitor Realtime Database

Go to Firebase Console > Your Project > Realtime Database:
- **Data tab**: View live data in the `app` node.
- **Rules tab**: Edit or review security rules.
- **Backups tab**: Download backups of your database.

## Optional: Add Logging & Monitoring

Firebase provides native analytics. To enable custom events:

1. Go to Firebase Console > Analytics.
2. Add custom events for scoring, team updates, etc.
3. Use `logEvent(analytics, 'points_added', { team: 'left', points: 10 })`.

## Optional: Set Up Continuous Deployment (GitHub Actions)

To auto-deploy on every push to `main`:

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_GAME_DAVE }}'
          channelId: live
          projectId: game-dave
```

2. Create a service account in Firebase Console > Project Settings > Service Accounts > Generate Key (JSON).
3. Add the JSON content as a GitHub Secret named `FIREBASE_SERVICE_ACCOUNT_GAME_DAVE`.

Then every push to `main` auto-deploys to Firebase Hosting.

## Summary

| Step | Command | Outcome |
|------|---------|---------|
| 1 | `npm install -g firebase-tools` | Firebase CLI ready |
| 2 | `firebase login` | Authenticated to Firebase |
| 3 | `firebase projects:list` | Verified project `game-dave` |
| 4 | `firebase deploy --only hosting,database` | Site live + DB rules active |
| 5 | Open URL in browser | App loads from Hosting |
| 6 | Add points on one device; check another | Real-time sync verified |

That's it! Your Kitchen Battle Dashboard is now live on Firebase with real-time multi-device sync.

