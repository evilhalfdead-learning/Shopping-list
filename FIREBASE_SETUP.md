# Setting Up Firebase for Cloud Sync 🌐

Your shopping list now syncs across all your devices! Here's how to set it up:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or add a project to an existing Google Cloud account)
3. Enter a project name (e.g., "Shopping List App")
4. Follow the setup wizard and create the project
5. Select **"Web"** as your platform when asked

## Step 2: Get Your Firebase Configuration

1. In the Firebase Console, click on your project
2. Go to **Project Settings** (gear icon in top-left)
3. Scroll to **"Your apps"** section
4. Find the `<script>` tag that contains your config object
5. Copy the configuration object (it looks like this):

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com"
}
```

## Step 3: Enable Realtime Database

1. In Firebase Console, go to **Realtime Database** (left sidebar)
2. Click **"Create Database"**
3. Choose your location and start in **Test mode** (for development)
4. Copy the database URL (ends with `.firebaseio.com`)

## Step 4: Add Configuration to Your App

1. Open [src/firebase.config.js](src/firebase.config.js)
2. Replace the placeholder values with your actual Firebase credentials
3. Paste your config like this:

```javascript
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  databaseURL: 'https://your-project-id-default-rtdb.firebaseio.com',
}
```

## Step 5: Set Database Security Rules

1. In Firebase Console, go to **Realtime Database**
2. Click on the **"Rules"** tab
3. Replace with these rules (allows authenticated users to read/write their own data):

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

4. Click **"Publish"**

## Step 6: Run Your App

```bash
npm run dev
```

Visit `http://localhost:5173` and start adding items to your shopping list. They'll sync across all devices automatically! 🚀

---

## How It Works

- **Anonymous Authentication**: Your app uses Firebase anonymous auth, so no login is needed
- **Real-time Sync**: Changes appear instantly on all devices where you're logged in
- **Cloud Storage**: Your data is safely stored in Firebase's cloud database
- **Fallback to Local Storage**: If Firebase isn't available, your app still works using browser storage

## Troubleshooting

### "Failed to connect to cloud" error
- Check your Firebase credentials in `src/firebase.config.js`
- Verify your database URL includes the full `.firebaseio.com` domain
- Make sure your database rules are published
- Check browser console for detailed error messages

### Data not syncing
- Confirm you're using the same browser/device or wait a few seconds for sync
- Check that your Security Rules allow reads/writes
- Verify internet connection

### Missing databaseURL
- Go to Firebase Console → Realtime Database
- Your database URL appears at the top of the page

---

**Your data is now backed up to the cloud and syncs across all devices!** 🎉
