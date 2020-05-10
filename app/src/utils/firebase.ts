import { regex } from './constants';
import app from 'firebase/app';
import 'firebase/auth'; import 'firebase/database';
import { deviceType, osName, browserName, browserVersion } from 'react-device-detect';
import { useState, useEffect } from 'react';
import { ChatroomMetadata } from './interfaces';

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

export function signUp(email: string, password: string, onSuccess: () => void, onError: (err: string) => void) {
  app.auth().createUserWithEmailAndPassword(email, password).then(() => onSuccess()).catch((err) => onError(err));
}

export function login(email: string, password: string, onSuccess: () => void, onError: (err: string) => void) {
  const cred = app.auth.EmailAuthProvider.credential(email, password);
  app.auth().signInWithCredential(cred).then(() => onSuccess()).catch((err) => onError(err));
}

export function logout(callback?: () => void) {
  app.auth().signOut().then(() => !!callback ? callback() : null);
}

export function getSavedChatrooms(callback: (rooms: ChatroomMetadata[]) => void) {
  app.database().ref(`/users/${app.auth().currentUser?.uid}/savedChatrooms`).once('value', (snapshot) => {
    if (!snapshot.exists()) return;
    const roomIds = Object.values(snapshot.val());
    const roomsRef = app.database().ref('/chats');
    const roomObjects: ChatroomMetadata[] = [];
    roomIds.forEach((id) => {
      roomsRef.child(`${id}/metadata`).once('value', (roomSnapshot) => {
        const a = roomSnapshot.val() as ChatroomMetadata; a.id = String(id);
        roomObjects.push(a);
        if (roomObjects.length === roomIds.length) callback(roomObjects);
      });
    });
  });
}

export function updateUserProfile(
  data: {
    photo: string,
    username: string,
    pass: { old: string, new: string; };
  }, callback: () => void
) {
  const user = getAuthUser();
  const updateState: { profile: boolean, pass: boolean; } = { profile: false, pass: false };
  const changeUpdateState = (state: { profile?: boolean, pass?: boolean; }) => {
    if (state.profile) updateState.profile = state.profile;
    if (state.pass) updateState.pass = state.pass;

    if (updateState.pass && updateState.profile) callback();
  };

  user.updateProfile({
    displayName: !!data.username ? data.username : user.displayName,
    photoURL: !!data.photo ? data.photo : user.photoURL
  }).then(() => changeUpdateState({ profile: true }));

  if (data.pass.old !== '' && data.pass.new !== '') {
    const cred = app.auth.EmailAuthProvider.credential(String(user.email), data.pass.old);
    user.reauthenticateWithCredential(cred).then((reauthUser) => {
      if (!(data.pass?.new)) {
        console.error('Failed to update password.');
        changeUpdateState({ pass: true });
        return;
      }
      reauthUser.user?.updatePassword(data.pass.new).then(() => {
        changeUpdateState({ pass: true });
      }).catch((err) => console.error(err));
    });
  } else changeUpdateState({ pass: true });
}

export function createChatroom(data: {
  name: string,
  inviteCode: string,
  invitees: string[];
}, onCreated: (roomId: string) => void, onError: (err: string) => void) {
  const user = getAuthUser();

  if (data.inviteCode.length !== 0 && !data.inviteCode.match(regex.CHATROOM_INVITECODE)) {
    onError('Érvénytelen meghívókód'); return;
  }

  app.database().ref('/chats').push({
    metadata: {
      created: new Date().getTime(),
      creator: user.uid,
      inviteCode: data.inviteCode.length !== 0 ? null : data.inviteCode,
      name: data.name
    }
  }).then((ref) => onCreated(String(ref.key))).catch((err) => onError(err));

  // TODO: Send invites via Firebase Functions
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
// ---------- HOOKS ----------
