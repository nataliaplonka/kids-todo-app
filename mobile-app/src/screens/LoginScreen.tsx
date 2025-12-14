import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function isValidEmail(email: string) {
    // prosta walidacja — wystarczy na UI, serwer (Firebase) zrobi dalsze sprawdzenia
    return /^\S+@\S+\.\S+$/.test(email);
}

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleError = (e: any) => {
        const code = e?.code || e?.message || '';
        let msg = 'Wystąpił błąd.';

        if (code.includes('invalid-email')) msg = 'Podano nieprawidłowy adres e‑mail.';
        else if (code.includes('weak-password')) msg = 'Hasło jest za krótkie (min. 6 znaków).';
        else if (code.includes('email-already-in-use')) msg = 'Ten e‑mail już istnieje — zaloguj się.';
        else if (code.includes('wrong-password')) msg = 'Nieprawidłowe hasło.';
        else if (code.includes('user-not-found')) msg = 'Nie znaleziono użytkownika z tym e‑mailem.';
        else if (code.includes('network-request-failed')) msg = 'Błąd sieci — sprawdź połączenie.';
        else msg = e?.message || String(e);

        Alert.alert('Błąd', msg);
    };

    const signUp = async () => {
        const cleanEmail = email.trim().toLowerCase();
        if (!isValidEmail(cleanEmail)) {
            Alert.alert('Błąd', 'Wprowadź poprawny adres e‑mail.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Błąd', 'Hasło musi mieć przynajmniej 6 znaków.');
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, cleanEmail, password);
            navigation.replace('Tasks');
        } catch (e) {
            handleError(e);
        }
    };

    const signIn = async () => {
        const cleanEmail = email.trim().toLowerCase();
        if (!isValidEmail(cleanEmail)) {
            Alert.alert('Błąd', 'Wprowadź poprawny adres e‑mail.');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, cleanEmail, password);
            navigation.replace('Tasks');
        } catch (e) {
            handleError(e);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
            />
            <View style={styles.row}>
                <Button title="Sign In" onPress={signIn} />
                <Button title="Sign Up" onPress={signUp} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 6 },
    row: { flexDirection: 'row', justifyContent: 'space-between' }
});