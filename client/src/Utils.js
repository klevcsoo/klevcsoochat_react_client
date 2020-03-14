import app from 'firebase/app'
import 'firebase/auth'; import 'firebase/functions'; import 'firebase/database'
import { useState, useEffect } from 'react'

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

    app.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('Logged in as', user.displayName)
        console.log('UserID:', user.uid)
      } else {
        console.log('Not logged in')
      }
    })
  },

  login: (email, password) => {
    app.auth().signInWithEmailAndPassword(email, password).then(() => {
      console.log('Login successful!')
    }).catch((err) => {
      console.error('Login failed:', err.message)
      app.auth().createUserWithEmailAndPassword(email, password).then(() => {
        console.log('User created successfully!')
      }).catch((err) => {
        console.error('User creation failed: ', err.message)
      })
    })
  },

  logout: () => {
    app.auth().signOut().then(() => {
      console.log('Logged out')
    }).catch((err) => {
      console.error('Failed to log out:', err.message)
    })
  },

  updateUserInfo: ({ photo, name, password }, onSuccess, onError) => {
    const user = app.auth().currentUser

    if (!!photo || !!name) user.updateProfile({
      displayName: name || user.displayName,
      photoURL: photo || user.photoURL
    }).then(() => onSuccess()).catch((err) => onError(err))

    if (!!password) user.updatePassword(password).then(() => {
      onSuccess()
    }).catch((err) => onError(err))
  },

  updateUserPassword: ({ currentPass, newPass }, onSuccess, onError) => {
    const user = app.auth().currentUser
    const creds = app.auth.EmailAuthProvider.credential(
      user.email, currentPass
    )

    user.reauthenticateWithCredential(creds).then((reauthenticatedUser) => {
      reauthenticatedUser.user.updatePassword(newPass).then(() => {
        onSuccess()
      }).catch((err) => onError(err))
    }).catch((err) => onError(err))
  },

  loadChatroom: (id, handler, onError) => {
    app.auth().onAuthStateChanged((user) => {
      if (!!user) {
        app.database().ref(`/chats/${id}`).on('value', async (snapshot) => {
          if (!snapshot.exists()) onError('A szoba nem létezik.')
    
          let chatroomMessages = []
          snapshot.child('messages').forEach((message) => {
            chatroomMessages.push(message.val())
          })
    
          handler(chatroomMessages)
        })
      }
    })
  },

  createChatroom: ({ name, password }, onSuccess, onError) => {
    if (!app.auth().currentUser) onError('Nem vagy bejelentkezve.')

    app.database().ref('/chats').push({
      metadata: {
        created: new Date().getTime(),
        creator: app.auth().currentUser.uid,
        name: name
      },
      secret: {
        password: password || null
      }
    }).then((reference) => {
      onSuccess(reference.key)
    })
  },

  sendMessage: (roomId, message, handler, onError) => {
    if (!app.auth().currentUser) onError('Nem vagy bejelentkezve.')

    const user = app.auth().currentUser
    app.database().ref(`/chats/${roomId}/messages`).push({
      author: user.displayName || user.email,
      authorId: user.uid,
      authorPhoto: user.photoURL,
      content: message
    }).then(() => {
      handler()
    })
  },

  sendImage: (roomId, url, handler, onError) => {
    if (!app.auth().currentUser) onError('Nem vagy bejelentkezve.')

    const user = app.auth().currentUser
    app.database().ref(`/chats/${roomId}/messages`).push({
      author: user.displayName || user.email,
      authorId: user.uid,
      authorPhoto: user.photoURL,
      url: url,
    }).then(() => {
      handler()
    })
  },

  getUid: () => app.auth().currentUser.uid
}

export const useAuthUser = function() {
  const [ user, setUser ] = useState(null)
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) setUser(user)
      else setUser(null)
      setLoading(false)
    })
  }, [])

  return [ user, loading ]
}

export const useChatroom = function(roomId, onMessage) {
  const [ metadata, setMetadata ] = useState(null)
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    firebaseHandler.loadChatroom(roomId, onMessage, (err) => {
      console.error('Failed to fetch messages: ', err)
    })

    app.database().ref(`/chats/${roomId}/metadata`).on('value', (snapshot) => {
      setMetadata(snapshot.val())
      setLoading(false)
    }, (err) => {
      console.error('Failed to get metadata: ', err.message)
      setLoading(false)
    })
    // eslint-disable-next-line
  } , [ roomId ])

  return [ metadata, loading ]
}

export const validateMessage = (message) => !(
  // Check lenght
  message.length === 0 ||
  //Replace empty charaters
  message.replace(/\s/g, '').length === 0
)

export const validateImageUrl = (url, onValid, onError) => {
  if (validateMessage(url) && !!(url.match(/\.(jpeg|jpg|gif|png)$/))) {
    fetch(url).then(() => onValid()).catch((err) => onError(err))
  } else onError('Failed at message validation')
}