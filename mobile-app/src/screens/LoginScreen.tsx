import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Tasks');
    } catch (e: any) {
      Alert.alert('Sign up error', e.message);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Tasks');
    } catch (e: any) {
      Alert.alert('Sign in error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
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
