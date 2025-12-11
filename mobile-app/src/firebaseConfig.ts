import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { Platform } from 'react-native';

let app: any = null;
export let auth: any = null;
export let db: any = null;

/**
 * Ustaw USE_EMULATOR = true aby aplikacja łączyła się z lokalnym Firebase Emulator Suite.
 * Dla Android emulator (avd) host 'localhost' jest widoczny jako 10.0.2.2.
 */
const USE_EMULATOR = true;

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

    if (USE_EMULATOR) {
        // wybieramy poprawny host dla emulatorów (Android emulator używa 10.0.2.2)
        const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

        // auth emulator expects http://HOST:9099
        try {
            connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
        } catch (e) {
            console.warn('connectAuthEmulator error', e);
        }

        // firestore emulator
        try {
            connectFirestoreEmulator(db, host, 8080);
        } catch (e) {
            console.warn('connectFirestoreEmulator error', e);
        }

        console.log('Firebase configured to use emulators on', host);
    }
}