import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { defaultAccountPhoto, defaultChatroomPhoto, generateUID } from './utils';
import { HttpsError } from 'firebase-functions/lib/providers/https';

const serviceAccount = require('../service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${ serviceAccount.project_id }.firebaseio.com`
});

exports.registerUser = functions.https.onCall(async ({ username, password }, context) => {
  if (!!context.auth) throw new HttpsError('failed-precondition', 'Már be vagy jelentkezve');
  if (!username || !password) throw new HttpsError('invalid-argument', 'Hiányos adatok');

  if ((await admin.database().ref(`/users`).orderByChild('info/username').equalTo(username).once('value')).exists()) {
    throw new HttpsError('already-exists', 'Ez a felhasználónév már foglalt');
  }

  const uid = generateUID();
  await admin.database().ref(`/users/${ uid }`).set({
    info: {
      lastOnline: admin.database.ServerValue.TIMESTAMP,
      username: username,
      photo: defaultAccountPhoto
    },
    password: password
  });

  await admin.auth().createUser({ uid: uid, displayName: username, photoURL: defaultAccountPhoto });
  const token = await admin.auth().createCustomToken(uid);

  console.log(`CREATED USER: [UID: ${ uid }, TOKEN: ${ token }]`);

  return { loginToken: token };
});

exports.requestToken = functions.https.onCall(async ({ username, password }, context) => {
  if (!!context.auth) throw new HttpsError('failed-precondition', 'Már be vagy jelentkezve');
  if (!username || !password) throw new HttpsError('invalid-argument', 'Hiányos adatok');

  const uidSnapshot = (await admin.database().ref('/users/').orderByChild('info/username').equalTo(username).once('value'));
  let uid = ''; uidSnapshot.forEach((s) => { uid = s.key as string; });
  if (!uid || typeof (uid) !== 'string') throw new HttpsError('not-found', 'Hibás felhasználónév');

  const userPass = (await admin.database().ref(`users/${ uid }/password`).once('value')).val();
  if (userPass !== password) throw new HttpsError('internal', 'Hibás jelszó');

  return { loginToken: await admin.auth().createCustomToken(uid) };
});

exports.createChatroom = functions.https.onCall(async ({ code, name, photo }, context) => {
  if (!context.auth) throw Error('Be kell jelentkezni, a szoba létrehozásához');
  if (!name) throw Error('Nincs szoba adatok nélkül🤷‍♀️');
  if (!!code && (await admin.database().ref(`/customcodes/${ code }`).once('value')).exists()) {
    throw Error('Ez a kód már foglalt');
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
  if (!!code) await admin.database().ref(`/customcodes/${ code }`).set(pushId.key);

  return pushId.key;
});

exports.deleteChatroom = functions.https.onCall(async ({ id }, context) => {
  if (!context.auth) throw Error('Be kell jelentkezni, a szoba törléséhez');

  const uid = context.auth.uid;
  const metadata = await admin.database().ref(`/chats/${ id }/metadata`).once('value');

  if (!metadata.exists()) throw Error('Szoba nem létezik');
  if (metadata.child('creator').val() !== uid) throw Error('Csak a szoba tulajdonosa törölheti a szobát');

  await metadata.ref.parent?.remove();
  await admin.database().ref(`/customcodes/${ metadata.child('code').val() }`).remove();
});

exports.onUserChatroomsChange = functions.database.ref('/users/{user_id}/chatrooms/{room_id}')
  .onWrite(async ({ before, after }, context) => {
    const uid = context.params.user_id;
    const rid = context.params.room_id;

    // Added new chatroom
    if (!before.exists() && after.exists()) {
      console.log(`Adding ${ `/chats/${ rid }/members/${ uid }` }`);
      return admin.database().ref(`/chats/${ rid }/members/${ uid }`).set(
        admin.database.ServerValue.TIMESTAMP
      );
    }

    // Removed a chatroom
    if (before.exists() && !after.exists()) {
      console.log(`Removing ${ `/chats/${ rid }/members/${ uid }` }`);
      return admin.database().ref(`/chats/${ rid }/members/${ uid }`).remove();
    }
  });

exports.onUserRequestsChange = functions.database.ref('/users/{user_id}/requests/{room_id}')
  .onWrite(async ({ before, after }, context) => {
    const uid = context.params.user_id;
    const rid = context.params.room_id;

    // Added new request
    if (!before.exists() && after.exists()) {
      return admin.database().ref(`/chats/${ rid }/requests/${ uid }`).set(
        admin.database.ServerValue.TIMESTAMP
      );
    }

    // Removed a request
    if (before.exists() && !after.exists()) {
      return admin.database().ref(`/chats/${ rid }/requests/${ uid }`).remove();
    }
  });

exports.onChatroomMessage = functions.database.ref(`/chats/{rid}/messages/{mid}`)
  .onCreate(async (snapshot, context) => {
    const MAX_MESSAGE_COUNT = 100;
    const msgSnap = await snapshot.ref.parent?.once('value');

    if (!msgSnap) return;
    if (msgSnap.numChildren() >= MAX_MESSAGE_COUNT) {
      let childCount = 0; const msgs: any = {};
      msgSnap.forEach((child) => {
        if (++childCount <= msgSnap.numChildren() - MAX_MESSAGE_COUNT) {
          msgs[ String(child.key) ] = null;
        }
      });
      await snapshot.ref.parent?.update(msgs);
      console.log(Object.keys(msgs));
    }
  });
