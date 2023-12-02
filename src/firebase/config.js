import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCSCRf3XGEJ71M3U0dK2ljdng-tPHok2Mg",
  authDomain: "memories-8f4d0.firebaseapp.com",
  projectId: "memories-8f4d0",
  storageBucket: "memories-8f4d0.appspot.com",
  messagingSenderId: "278299107663",
  appId: "1:278299107663:web:9d0f9c9013c68c59d5253a"
};

const app = initializeApp(firebaseConfig);

const firestoreService = firebase.firestore()
const authService = firebase.auth()
const Timestamp = firebase.firestore.Timestamp

export { authService, firestoreService, Timestamp }