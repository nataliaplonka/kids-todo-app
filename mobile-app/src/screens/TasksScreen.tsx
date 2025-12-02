import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import TaskItem from '../components/TaskItem';

export default function TasksScreen() {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snapshot => {
      const arr: any[] = [];
      snapshot.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setTasks(arr);
    });
    return () => unsub();
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'tasks'), { title: text.trim(), points: 10, done: false, createdAt: Date.now() });
      setText('');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput placeholder="New task" value={text} onChangeText={setText} style={styles.input} />
        <Button title="Add" onPress={addTask} />
      </View>
      <FlatList data={tasks} keyExtractor={item => item.id} renderItem={({ item }) => (
        <TaskItem task={item} onDelete={() => removeTask(item.id)} />
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, marginRight: 8, borderRadius: 6 }
});
