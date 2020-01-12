import app from 'firebase/app'
import 'firebase/auth'; import 'firebase/functions'; import 'firebase/database'
import cookie from 'react-cookies'

const firebaseConfig = {
  apiKey: "AIzaSyAAFJdy_raRoVx1sbX8deEq5SWKql0Y80A",
  authDomain: "klevchat-45a17.firebaseapp.com",
  databaseURL: "https://klevchat-45a17.firebaseio.com",
  projectId: "klevchat-45a17",
  storageBucket: "klevchat-45a17.appspot.com",
  messagingSenderId: "686878672535",
  appId: "1:686878672535:web:2d65ea439c900f0cc0cbd2",
  measurementId: "G-WKPVMVZ8CP"
};

export const firebaseHandler = {
  initializeApp: () => {
    if (app.apps.length === 0) app.initializeApp(firebaseConfig)

    app.auth().signInAnonymously().then(({ user }) => {
      console.log(`User signed in with id ${user.uid}`)
    }).catch((err) => {
      console.log(`Couldn't sign in. Error: ${err}`)
    })
  },

  loadChatroom: (id, handler, onError) => {
    app.database().ref(`/chats/${id}`).on('value', async (snapshot) => {
      if (!snapshot.exists()) onError('A szoba nem létezik.')

      let chatroomMessages = []
      snapshot.child('messages').forEach((message) => {
        chatroomMessages.push({
          author: message.child('author').val(),
          content: message.child('content').val()
        })
      })

      handler(chatroomMessages)
    })
  },

  createChatroom: (handler, onError) => {
    if (!app.auth().currentUser) onError('Nem vagy bejelentkezve.')

    app.database().ref('/chats').push({
      created: new Date().getTime()
    }).then((reference) => {
      handler(reference.key)
    })
  },

  sendMessage: (roomId, message, handler, onError) => {
    if (!app.auth().currentUser) onError('Nem vagy bejelentkezve.')

    app.database().ref(`/chats/${roomId}/messages`).push({
      author: cookie.load('username') || app.auth().currentUser.uid,
      content: message
    }).then(() => {
      handler()
    })
  },

  getUid: () => app.auth().currentUser.uid
}