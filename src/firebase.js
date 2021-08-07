import firebase from "firebase/app"

import "firebase/firestore"
import "firebase/auth" // authentication ke liye
import "firebase/storage"

let firebaseConfig = {
  apiKey: "AIzaSyChEoEVAQRiugG2u7pBSrWt5ggYXrPwARw",
  authDomain: "reels-46a44.firebaseapp.com",
  projectId: "reels-46a44",
  storageBucket: "reels-46a44.appspot.com",
  messagingSenderId: "12404013342",
  appId: "1:12404013342:web:e0913eaf74d78b8cc5f10f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export const firestore = firebase.firestore(); // database
export const auth = firebase.auth(); // authentication
export const storage = firebase.storage() //storage

// creating a service provider
// yaha pe hum bta rahe hai ki hum google ki sevices
// use karenge authentication ke liye
let provider = new firebase.auth.GoogleAuthProvider()

// auth.signInWithPopup(provider) -> popup se login hoga jiksa provider(Google hai)

export const signWithGoogle = () => auth.signInWithPopup(provider)

export default firebase;