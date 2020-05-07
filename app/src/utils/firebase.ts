import app from 'firebase/app';
import 'firebase/auth'; import 'firebase/database';
// import { deviceType, osName, browserName, browserVersion } from 'react-device-detect';
import { useState, useEffect } from 'react';

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

export function useAuthUser(): [ app.User | null, boolean ] {
  const [ user, setUser ] = useState<app.User | null>(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => { setUser(user); setLoading(false); });
  }, []);

  return [ user, loading ];
}
