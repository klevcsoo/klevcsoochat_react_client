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

  await admin.database().ref(`/users/${user.uid}/info`).set({
    photo: user.photoURL,
    username: user.displayName,
    email: user.email,
  });
});

exports.createChatroom = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw Error('Be kell jelentkezni, a szoba létrehozásához');

  if (!data || !data.code || !data.name) {
    throw Error('Nincs szoba adatok nélkül🤷‍♀️');
  }

  const uid = context.auth.uid;
  const pushId = await admin.database().ref('/chats').push();
  const photo = !!data.photo ? data.photo : defaultChatroomPhoto;
  await pushId.set({
    metadata: {
      created: admin.database.ServerValue.TIMESTAMP,
      creator: uid,
      code: data.code,
      name: data.name,
      photo: photo
    }
  });

  if (!pushId.key) throw Error('Hiba történt, próbáld újra');
  return pushId.key;
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
