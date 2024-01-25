import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBYRV77qinZPQD4Zeo7ZAHXCh1hMN6NiAE",
    authDomain: "karaoke-f70eb.firebaseapp.com",
    projectId: "karaoke-f70eb",
    storageBucket: "karaoke-f70eb.appspot.com",
    messagingSenderId: "742394003933",
    appId: "1:742394003933:web:7e3457a9b9cd0e6a4f3634",
    measurementId: "G-9CJLN3C0BS"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, firestore, auth, collection, addDoc };