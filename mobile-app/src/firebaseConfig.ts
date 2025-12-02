import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app: any = null;
export let auth: any = null;
export let db: any = null;

export function initializeFirebase() {
  if (app) return;
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}
