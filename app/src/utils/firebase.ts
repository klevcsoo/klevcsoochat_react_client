import { regex } from './constants';
import app from 'firebase/app';
import 'firebase/auth'; import 'firebase/database';
import { deviceType, osName, browserName, browserVersion } from 'react-device-detect';
import { useState, useEffect } from 'react';
import { ChatroomMetadata, ChatMessage } from './interfaces';

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

  app.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(`Signed in as ${user.uid}`);

      if (window.location.hostname !== 'localhost') {
        const connectionsRef = app.database().ref(`/users/${user.uid}/connections`);
        const lastOnlineRef = app.database().ref(`/users/${user.uid}/lastOnline`);
        app.database().ref('.info/connected').on('value', (snapshot) => {
          if (!!snapshot.val()) {
            const con = connectionsRef.push();
            con.onDisconnect().remove();
            con.set(`${deviceType}-${osName}-${browserName.replace(/ /g, '_')}-${browserVersion}`);
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

export async function signUp(email: string, password: string) {
  await app.auth().createUserWithEmailAndPassword(email, password);
}

export async function login(email: string, password: string) {
  const cred = app.auth.EmailAuthProvider.credential(email, password);
  await app.auth().signInWithCredential(cred);
}

export async function logout() {
  await app.auth().signOut();
}

export async function getSavedChatrooms(): Promise<(ChatroomMetadata | null)[]> {
  const savedRoomsSnapshot = await app.database().ref(`/users/${app.auth().currentUser?.uid}/savedChatrooms`).once('value');
  if (!savedRoomsSnapshot.exists()) return [ null ];

  const roomsRef = app.database().ref('/chats');
  const roomObjects: (ChatroomMetadata | null)[] = [];

  Object.values(savedRoomsSnapshot.val()).forEach(async (id, i) => {
    const roomSnapshot = await roomsRef.child(`${id}/metadata`).once('value');
    if (!roomSnapshot.exists()) {
      roomObjects.push(null);
      savedRoomsSnapshot.child(Object.keys(savedRoomsSnapshot.val())[ i ]).ref.remove();
    }
    else {
      const a = roomSnapshot.val() as ChatroomMetadata; a.id = String(id);
      roomObjects.push(a);
    }
  });

  return roomObjects;
}

export async function getRoomID(code: string) {
  return String((await app.database().ref(`/customcodes/${code}`).once('value')).val());
}

export async function updateUserProfile(photo: string, username: string, pass: { old: string, new: string; }) {
  const user = getAuthUser();

  await user.updateProfile({
    displayName: !!username ? username : user.displayName,
    photoURL: !!photo ? photo : user.photoURL
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

export async function createChatroom(name: string, inviteCode: string, invitees: string[]) {
  const user = getAuthUser();

  if (inviteCode.length !== 0 && !inviteCode.match(regex.CHATROOM_INVITECODE)) {
    throw Error('Érvéntelen meghívókód');
  }

  const snapshot = await app.database().ref(`/customcodes/${inviteCode}`).once('value');
  if (snapshot.exists()) throw Error('Meghívókód már foglalt');

  const push = app.database().ref('/chats').push();
  snapshot.ref.set(push.key);
  await push.set({
    metadata: {
      created: new Date().getTime(),
      creator: user.uid,
      inviteCode: inviteCode.length === 0 ? null : inviteCode,
      name: name
    }
  });

  return String((await push).key);
}

export async function sendChatMessage(message: { type: 'text' | 'image', content: string; }, roomId: string) {
  const user = getAuthUser();

  await app.database().ref(`/chats/${roomId}/messages`).push({
    author: { id: user.uid, name: user.displayName },
    sent: app.database.ServerValue.TIMESTAMP,
    type: message.type,
    content: message.content
  }).catch((err) => { throw Error(err); });
}

export function onNewMessage(roomId: string, callback: (message: ChatMessage) => void): () => void {
  const ref = app.database().ref(`/chats/${roomId}/messages`).limitToLast(100);
  const handler = (snapshot: app.database.DataSnapshot) => {
    callback(snapshot.val() as ChatMessage);
  };

  ref.on('child_added', handler);
  return () => ref.off('child_added', handler);
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

export function useOtherUserInfo(uid: string): [ AuthUserInfoUI | null, boolean ] {
  const [ user, setUser ] = useState<AuthUserInfoUI | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    app.database().ref(`/users/${uid}/info`).on('value', (snapshot) => {
      setUser({
        email: snapshot.child('email').val(),
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
    app.database().ref(`/chats/${id}/metadata`).on('value', (snapshot) => {
      setMetadata(snapshot.val()); setLoading(false);
    });
  }, [ id ]);

  return [ metadata, loading ];
}
// ---------- HOOKS ----------
