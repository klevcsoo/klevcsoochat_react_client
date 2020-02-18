import app from 'firebase/app'
import 'firebase/auth'; import 'firebase/functions'; import 'firebase/database'
import cookie from 'react-cookies'

const firebaseConfig = {
  apiKey: "AIzaSyBLXTi7stlDNk1yGBXhS68N0_1TJeNxVNk",
  authDomain: "klevcsoochat.firebaseapp.com",
  databaseURL: "https://klevcsoochat.firebaseio.com",
  projectId: "klevcsoochat",
  storageBucket: "klevcsoochat.appspot.com",
  messagingSenderId: "50687817478",
  appId: "1:50687817478:web:018a66d95de74566619087",
  measurementId: "G-QXXDDCBLL0"
}

export const firebaseHandler = {
  initializeApp: () => {
    if (app.apps.length === 0) app.initializeApp(firebaseConfig)

    app.auth().signInAnonymously().then(({ user }) => {
      console.log(`User signed in with id ${user.uid}`)
      console.log('Username:', cookie.load('username'))
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