<<<<<<< HEAD
# EventShare

A simple group photo/video sharing + chat app for events (weddings, parties, trips).
Built with **React + Vite + Tailwind CSS** on the frontend, and **Firebase**
(Auth, Firestore, Storage) as the real-time backend.

This is the MVP: signup/login, create/join groups, photo & video gallery,
real-time chat with emoji + stickers + reactions, and basic admin controls.

---

## 1. Why Firebase?

You asked for a real-time database, and for uploads to be stored properly.
Building that from scratch (a server, a database, a file host, auth, all
talking to each other in real time) is a lot for a first project. Firebase
gives you all four of those as one free, hosted service, with an SDK that
plugs directly into React — so this project can stay "just frontend code"
while still being fully real-time. Everything below is about wiring your
own free Firebase project into this code.

**Note on phone login:** true phone-number OTP login needs a paid Firebase
plan plus SMS sending, which isn't a great fit for a first project. This
MVP uses **name + email + password** instead (you can still add a phone
number to your profile, it's just not used to log in). You can upgrade to
real phone auth later — Firebase supports it, you'd just enable it in the
console and swap the sign-up form.

---

## 2. Set up your Firebase project (one-time, ~10 minutes)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**. Name it anything (e.g. "eventshare").
2. In the project, click the **</> (web)** icon to register a web app. You don't need Firebase Hosting yet — just copy the `firebaseConfig` object it shows you.
3. In the left sidebar, open **Build → Authentication → Get started**. Under "Sign-in method", enable **Email/Password**.
4. Open **Build → Firestore Database → Create database**. Start in production mode, pick any region.
5. Open **Build → Storage → Get started**. Accept the defaults.

That's it on the Firebase console for now — we'll deploy the security rules from your computer in step 4.

---

## 3. Run the app locally

You'll need [Node.js](https://nodejs.org) (v18+) installed.

```bash
# 1. Install dependencies
npm install

# 2. Add your Firebase config
cp .env.example .env
# open .env and paste in the values from the firebaseConfig object (step 2 above)

# 3. Start the dev server
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You should see the login screen.

---

## 4. Deploy the security rules

The `firestore.rules` and `storage.rules` files in this project control who
can read/write what (e.g. "only group members can see a group's chat").
They need to be pushed to your Firebase project, or Firestore will use its
restrictive defaults and every request will fail.

```bash
npm install -g firebase-tools   # one-time
firebase login
firebase use --add              # pick your project when prompted
firebase deploy --only firestore:rules,storage:rules
```

---

## 5. How the app is organized

```
src/
  firebase.js              Firebase setup (reads keys from .env)
  context/AuthContext.jsx  signup/login/logout + current user profile
  hooks/useGroup.js         real-time subscription to one group doc

  pages/
    Login.jsx, Signup.jsx
    GroupList.jsx           "your groups" home screen
    CreateGroup.jsx
    JoinGroup.jsx           handles invite links (/join/:groupId)
    GroupDetail.jsx         header + Gallery/Chat tabs + admin button

  components/
    Gallery/                grid, full-screen viewer, upload button
    Chat/                   message list, message bubble, emoji + sticker pickers
    Admin/AdminPanel.jsx    members, join requests, settings, delete group
    common/                 Avatar, Modal, BottomTabs, ProtectedRoute
```

### Data model (Firestore)

```
users/{uid}                        name, email, phone, createdAt

groups/{groupId}                   name, creatorId, adminIds[], memberIds[],
                                    openJoin (bool), createdAt
  groups/{id}/members/{uid}        name, role ('admin' | 'member'), joinedAt
  groups/{id}/joinRequests/{uid}   pending requests when openJoin is off
  groups/{id}/messages/{msgId}     senderId, senderName, type ('text'|'sticker'),
                                    text / stickerEmoji, reactions {uid: emoji}, createdAt
  groups/{id}/media/{mediaId}      uploaderId, uploaderName, url, storagePath,
                                    type ('image'|'video'), reactions {uid: emoji}, createdAt
```

Photos/videos are uploaded to Firebase Storage at
`groups/{groupId}/media/...` and the original file is stored as-is (no
compression), so downloads are always full quality.

### Invite links

An invite link is just `https://yourapp.com/join/{groupId}`. Tapping it:
- if the user isn't logged in, sends them to sign up/log in first, then back to the invite
- if the group has "open join" on, adds them as a member immediately
- if "open join" is off, creates a join request the admin approves from the group's settings (⚙️ icon)

---

## 6. Deploying the app itself

The easiest option is Firebase Hosting (same project, no extra setup):

```bash
npm run build
firebase deploy --only hosting
```

It'll give you a live `https://your-project.web.app` URL you can share.

---

## 7. What's intentionally left out of this MVP

You mentioned adding these later, so they're not built yet:
- Face recognition / auto-tagging
- Live event "wall" display mode
- Auto-generated highlight reels
- Real Phone-OTP login (currently email/password)
- Real GIF search (currently a small placeholder sticker set — see the
  comment at the top of `src/components/Chat/GifPicker.jsx` for how to wire
  up Giphy or Tenor's free API when you're ready)

## 8. A note on security rules

The rules in `firestore.rules` / `storage.rules` are written to be easy to
follow for a first project, and are a reasonable baseline for a private app
used by friends/family. Before opening this up to strangers on the
internet, it's worth having someone more experienced review them (in
particular: message/reaction updates are currently "any group member can
edit any message doc," which is fine for reactions but is trusting the
client more than a production app should).
=======
# -Momently
>>>>>>> 7f2102fc38238bcb5c0ace23f3ccf43ebc659735
