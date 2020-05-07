import app from 'firebase/app';
import 'firebase/auth'; import 'firebase/database';
// import { deviceType, osName, browserName, browserVersion } from 'react-device-detect';
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

      // const connectionsRef = app.database().ref(`/users/${user.uid}/connections`);
      // const lastOnlineRef = app.database().ref(`/users/${user.uid}/lastOnline`);
      // app.database().ref('.info/connected').on('value', (snapshot) => {
      //   if (!!snapshot.val()) {
      //     const con = connectionsRef.push();
      //     con.onDisconnect().remove();
      //     con.set(`${deviceType}-${osName}-${browserName.replace(/ /g, '_')}-${browserVersion}`);
      //     lastOnlineRef.onDisconnect().set(app.database.ServerValue.TIMESTAMP);
      //   }
      // });
    }
    else console.warn('Not signed in');
  });
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
