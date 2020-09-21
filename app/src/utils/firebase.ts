import { regex } from './constants';
import app from 'firebase/app';
import 'firebase/auth'; import 'firebase/database';
import 'firebase/functions'; import 'firebase/storage';
import { deviceType, osName, browserName, browserVersion } from 'react-device-detect';
import { useState, useEffect } from 'react';
import { ChatroomMetadata, ChatMessage, AuthUserInfoUI } from './interfaces';
import { onMessageNotification, compressImageForUpload } from './functions';
import { ChatReaction } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyBLXTi7stlDNk1yGBXhS68N0_1TJeNxVNk",
  authDomain: "klevcsoochat.firebaseapp.com",
  databaseURL: "https://klevcsoochat.firebaseio.com",
  projectId: "klevcsoochat",
  storageBucket: "klevcsoochat.appspot.com",
  messagingSenderId: "50687817478",
  appId: "1:50687817478:web:018a66d95de74566619087",
  measurementId: "G-QXXDDCBLL0"
};

// ---------- CALLABLES ----------
export function initializeFirebase() {
  if (app.apps.length === 0) app.initializeApp(firebaseConfig);

  if ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') && !!(window as any).emulateFunctions) {
    console.log('DEVELOPER ENVIRONMENT');
    app.functions().useFunctionsEmulator('http://localhost:5001');
  }

  app.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(`Signed in as ${ user.uid }`);
      (window as any).logout = () => logout(); //Debug, but can be left in there for production

      if (window.location.hostname !== 'localhost') {
        const connectionsRef = app.database().ref(`/users/${ user.uid }/info/connections`);
        const lastOnlineRef = app.database().ref(`/users/${ user.uid }/info/lastOnline`);
        app.database().ref('.info/connected').on('value', (snapshot) => {
          if (!!snapshot.val()) {
            const con = connectionsRef.push();
            con.onDisconnect().remove();
            con.set(`${ deviceType }-${ osName }-${ browserName.replace(/ /g, '_') }-${ browserVersion }`);
            lastOnlineRef.onDisconnect().set(app.database.ServerValue.TIMESTAMP);
          }
        });
      }
    }
    else console.warn('Not signed in');
  });
}

function getAuthUser() {
  const user = app.auth().currentUser;
  if (!user) throw new Error('No auth user found.');
  else return user;
}

export function getUID() {
  return getAuthUser().uid;
}

export async function signUp(username: string, password: string) {
  const token = (await app.functions().httpsCallable('registerUser')({ username: username, password: password })).data.loginToken;
  await app.auth().signInWithCustomToken(token);
}

export async function login(username: string, password: string) {
  const token = (await app.functions().httpsCallable('requestToken')({ username: username, password: password })).data.loginToken;
  await app.auth().signInWithCustomToken(token);
}

export async function logout() {
  await app.auth().signOut();
}

export function onUserChatrooms(callback: (roomId: (string | null)[]) => void) {
  const chatroomsRef = app.database().ref(`/users/${ getAuthUser().uid }/chatrooms`);
  const handler = (snapshot: app.database.DataSnapshot) => {
    if (!snapshot.exists()) callback([ null ]);
    else callback(Object.keys(snapshot.val()));
  };

  chatroomsRef.on('value', handler);
  return () => chatroomsRef.off('value', handler);
}

export function onUserRequests(callback: (roomId: (string | null)[]) => void) {
  const requestsRef = app.database().ref(`/users/${ getAuthUser().uid }/requests`);
  const handler = (snapshot: app.database.DataSnapshot) => {
    if (!snapshot.exists()) callback([ null ]);
    else callback(Object.keys(snapshot.val()));
  };

  requestsRef.on('value', handler);
  return () => requestsRef.off('value', handler);
}

export async function getRoomID(code: string) {
  return String((await app.database().ref(`/customcodes/${ code }`).once('value')).val());
}

export async function uploadAccountPhoto(photo: File): Promise<string> {
  const photoRef = app.storage().ref(`/users/${ getUID() }/photo`);
  await photoRef.put(await compressImageForUpload(photo)); return String(await photoRef.getDownloadURL());
}

export async function updateUserProfile(photo: string, pass: { old: string, new: string; }) {
  const user = getAuthUser();

  await user.updateProfile({
    photoURL: !!photo ? photo : user.photoURL
  });

  await app.database().ref(`/users/${ user.uid }/info`).update({
    photo: !!photo ? photo : user.photoURL
  });

  const gotOldPass = pass.old.length !== 0 && !pass.old.match(regex.WHITESPACE);
  const gotNewPass = pass.new.length !== 0 && !pass.new.match(regex.WHITESPACE);

  if (gotOldPass && gotNewPass) {
    const cred = app.auth.EmailAuthProvider.credential(String(user.email), pass.old);
    const reauthUser = await user.reauthenticateWithCredential(cred);

    return reauthUser.user?.updatePassword(pass.new);
  }

  return;
}

export async function createChatroom(name: string, code: string, photo: string) {
  const id = await (app.functions().httpsCallable('createChatroom'))({
    name: name, code: code, photo: photo
  }).then(({ data }) => String(data)).catch((err) => {
    console.log(err); throw Error(err);
  });

  await app.database().ref(`/users/${ getAuthUser().uid }/chatrooms`).update({
    [ id ]: app.database.ServerValue.TIMESTAMP
  });
  return id;
}

export async function sendChatroomRequest(roomId: string) {
  const user = getAuthUser();

  try {
    if ((await app.database().ref(`/chats/${ roomId }/members/${ user.uid }`).once('value')).exists()) {
      throw Error('Ebben a szobában már benne vagy');
    }
  } catch { }

  let rid = roomId;
  if (rid[ 0 ] !== '-') {
    rid = (await app.database().ref(`/customcodes/${ roomId }`).once('value')).val();
  }

  await app.database().ref(`/users/${ getAuthUser().uid }/requests`).update({
    [ rid ]: app.database.ServerValue.TIMESTAMP
  });
}

export async function updateChatroomMetadata(rid: string, data: { photo: string, name: string; }): Promise<void> {
  return app.database().ref(`/chats/${ rid }/metadata`).update(data);
}

export async function respondToRequest(approved: boolean, uid: string, rid: string) {
  const ref = app.database().ref(`/users/${ uid }`);

  if (approved) {
    await ref.child(`requests/${ rid }`).remove();
    await ref.child('chatrooms').update({ [ rid ]: app.database.ServerValue.TIMESTAMP });
  } else await ref.child(`requests/${ rid }`).remove();
}

export async function leaveChatroom(rid: string) {
  await app.database().ref(`/user/${ getAuthUser().uid }/chatrooms/${ rid }`).remove();
}

export async function uploadChatImage(image: File): Promise<string> {
  const imgRef = app.storage().ref(`/users/${ getUID() }/messages/${ new Date().getTime() }`);
  await imgRef.put(await compressImageForUpload(image)); return String(await imgRef.getDownloadURL());
}

export async function sendChatMessage(message: { type: 'text' | 'image', content: string; }, roomId: string) {
  const user = getAuthUser();
  if (message.content.length === 0 || message.content.match(regex.WHITESPACE)) return;

  await app.database().ref(`/chats/${ roomId }/messages`).push({
    author: { id: user.uid, name: user.displayName },
    sent: app.database.ServerValue.TIMESTAMP,
    type: message.content.startsWith('data:image/') ? 'image' : message.type,
    content: message.content
  }).catch((err) => { throw Error(err); });
}

export function onNewMessage(roomId: string, callback: (message: ChatMessage) => void) {
  const cached = getCachedMessages(roomId);
  if (!!cached) for (const mid of Object.keys(cached)) callback(cached[ mid ]);

  const ref = app.database().ref(`/chats/${ roomId }/messages`).limitToLast(100);
  const handler = (snapshot: app.database.DataSnapshot) => {
    const m = snapshot.val() as ChatMessage;
    m.mid = String(snapshot.key);
    if (!!cached && !!cached[ m.mid ]) return;
    callback(m); onMessageNotification(m);
    addMessageToCache(roomId, m.mid, m);
  };

  ref.on('child_added', handler);
  return () => ref.off('child_added', handler);
}

export async function reactToMessage(rid: string, mid: string, elemId: string) {
  const ref = app.database().ref(`/chats/${ rid }/messages/${ mid }/reactions/${ getUID() }`);

  let r: ChatReaction;
  switch (elemId) {
    case 'r-heart': r = '❤️'; break;
    case 'r-laugh': r = '😂'; break;
    case 'r-sad': r = '😢'; break;
    case 'r-suprised': r = '😮'; break;
    case 'r-like': r = '👍'; break;
    default: throw new Error('Invalid emoji');
  }

  if ((await ref.once('value')).val() as ChatReaction === r) ref.remove();
  else ref.set(r);
}

export async function setTypingStatus(isTyping: boolean, rid: string) {
  await app.database().ref(`/chats/${ rid }/typing`).update({
    [ getAuthUser().uid ]: isTyping || null
  });
}

export function onMemberTyping(rid: string, callback: (uids: string[]) => void) {
  const ref = app.database().ref(`/chats/${ rid }/typing`);
  const handler = (snapshot: app.database.DataSnapshot) => {
    if (!snapshot.exists()) callback([]);
    else callback(Object.keys(snapshot.val()));
  };

  ref.on('value', handler);
  return () => ref.off('value', handler);
}

export function onChatroomMember(roomId: string, callback: (uids: string[]) => void) {
  const ref = app.database().ref(`/chats/${ roomId }/members`);
  const handler = (snapshot: app.database.DataSnapshot) => {
    callback(Object.keys(snapshot.val()));
  };

  ref.on('value', handler);
  return () => ref.off('value', handler);
}

export function onChatroomRequest(roomId: string, callback: (uids: string[] | null) => void) {
  const ref = app.database().ref(`/chats/${ roomId }/requests`);
  const handler = (snapshot: app.database.DataSnapshot) => {
    if (!snapshot.exists()) { callback(null); return; }
    callback(Object.keys(snapshot.val()));
  };

  ref.on('value', handler, (err: any) => {
    console.log(err); callback(null);
  });
  return () => ref.off('value', handler);
}
// ---------- CALLABLES ----------

// ---------- HOOKS ----------
export function useAuthUser(): [ app.User | null, boolean ] {
  const [ user, setUser ] = useState<app.User | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => { setUser(user); setLoading(false); });
  }, []);

  return [ user, loading ];
}

export function useUserInfoUI(uid: string): [ AuthUserInfoUI | null, boolean ] {
  const [ user, setUser ] = useState<AuthUserInfoUI | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    app.database().ref(`/users/${ uid }/info`).on('value', (snapshot) => {
      setUser({
        lastOnline: snapshot.child('lastOnline').val(),
        online: snapshot.child('connections').exists() ? true : false,
        photo: snapshot.child('photo').val(),
        username: snapshot.child('username').val()
      });
      setLoading(false);
    });
  }, [ uid ]);

  return [ user, loading ];
}

export function useChatroomMetadata(id: string): [ ChatroomMetadata | null, boolean ] {
  const [ metadata, setMetadata ] = useState<ChatroomMetadata | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    app.database().ref(`/chats/${ id }/metadata`).on('value', (snapshot) => {
      setMetadata({ ...snapshot.val(), id: id }); setLoading(false);
    });
  }, [ id ]);

  return [ metadata, loading ];
}

export function useChatMessageReactions(rid: string, mid: string): { reaction: ChatReaction, uid: string; }[] {
  const [ reactions, setReactions ] = useState<{ reaction: ChatReaction, uid: string; }[]>([]);

  useEffect(() => {
    const ref = app.database().ref(`/chats/${ rid }/messages/${ mid }/reactions`);
    const handler = (snapshot: app.database.DataSnapshot) => {
      let rs: { reaction: ChatReaction, uid: string; }[] = [];
      snapshot.forEach((rSnap) => {
        rs.push({ reaction: rSnap.val() as ChatReaction, uid: String(rSnap.key) });
      }); setReactions(rs);
    };
    ref.on('value', handler);
    return () => { ref.off('value', handler); };
  }, [ rid, mid ]);

  return reactions;
}
// ---------- HOOKS ----------

// ---------- CACHING ----------
const cachedMessages: { [ rid: string ]: { [ mid: string ]: ChatMessage; }; } = {};
function getCachedMessages(rid: string) {
  if (!cachedMessages[ rid ]) return;
  else return cachedMessages[ rid ];
}
function addMessageToCache(rid: string, mid: string, message: ChatMessage) {
  if (!cachedMessages[ rid ]) cachedMessages[ rid ] = { [ mid ]: message };
  else cachedMessages[ rid ][ mid ] = message;
}
; (window as any).displayCache = () => {
  console.log('Cached messages:', cachedMessages);
};
// ---------- CACHING ----------
