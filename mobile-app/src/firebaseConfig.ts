import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

let app: any = null;
export let auth: any = null;
export let db: any = null;

export function initializeFirebase() {
    if (app) return;
    const firebaseConfig = {
        apiKey: "AIzaSyDMipnTI4UsYmsQldbXd1WSigQl8ozR8j8",
        authDomain: "kids-to-do-app-2ada7.firebaseapp.com",
        projectId: "kids-to-do-app-2ada7",
        storageBucket: "kids-to-do-app-2ada7.firebasestorage.app",
        messagingSenderId: "264121194056",
        appId: "1:264121194056:web:6704e14b99bb4feeff2a7d"
    };
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
}
