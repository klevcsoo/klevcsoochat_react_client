import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { defaultAccountPhoto, defaultChatroomPhoto } from './utils';

const serviceAccount = require('../service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  await admin.auth().updateUser(user.uid, {
    photoURL: defaultAccountPhoto
  });

  return admin.database().ref(`/users/${user.uid}/info`).set({
    photo: defaultAccountPhoto,
    username: user.displayName,
    email: user.email,
    lastOnline: admin.database.ServerValue.TIMESTAMP
  });
});

exports.createChatroom = functions.https.onCall(async ({ code, name, photo }, context) => {
  if (!context.auth) throw Error('Be kell jelentkezni, a szoba létrehozásához');

  if (!code || !name) {
    throw Error('Nincs szoba adatok nélkül🤷‍♀️');
  }

  const uid = context.auth.uid;
  const pushId = await admin.database().ref('/chats').push();
  const roomPhoto = !!photo ? photo : defaultChatroomPhoto;
  await pushId.set({
    metadata: {
      created: admin.database.ServerValue.TIMESTAMP,
      creator: uid,
      code: code,
      name: name,
      photo: roomPhoto
    }
  });

  if (!pushId.key) throw Error('Hiba történt, próbáld újra');
  await admin.database().ref(`/customcodes/${code}`).set(pushId.key);

  return pushId.key;
});

exports.deleteChatroom = functions.https.onCall(async ({ id }, context) => {
  if (!context.auth) throw Error('Be kell jelentkezni, a szoba törléséhez');

  const uid = context.auth.uid;
  const metadata = await admin.database().ref(`/chats/${id}/metadata`).once('value');

  if (!metadata.exists()) throw Error('Szoba nem létezik');
  if (metadata.child('creator').val() !== uid) throw Error('Csak a szoba tulajdonosa törölheti a szobát');

  await metadata.ref.parent?.remove();
  await admin.database().ref(`/customcodes/${metadata.child('code').val()}`).remove();
});

exports.onUserChatroomsChange = functions.database.ref('/users/{user_id}/chatrooms')
  .onWrite(async ({ before, after }, context) => {
    const uid = context.params.user_id;

    // Added new chatroom
    if (!before.exists() && after.exists()) {
      return admin.database().ref(`/chats/${after.key}/members/${uid}`).set(
        admin.database.ServerValue.TIMESTAMP
      );
    }

    // Removed a chatroom
    if (before.exists() && !after.exists()) {
      return admin.database().ref(`/chats/${after.key}/members/${uid}`).remove();
    }
  });

exports.onUserRequestsChange = functions.database.ref('/users/{user_id}/requests')
  .onWrite(async ({ before, after }, context) => {
    const uid = context.params.user_id;

    // Added new request
    if (!before.exists() && after.exists()) {
      return admin.database().ref(`/chats/${after.key}/metadata/requests/${uid}`).set(
        admin.database.ServerValue.TIMESTAMP
      );
    }

    // Removed a request
    if (before.exists() && !after.exists()) {
      return admin.database().ref(`/chats/${after.key}/metadata/requests/${uid}`).remove();
    }
  });
