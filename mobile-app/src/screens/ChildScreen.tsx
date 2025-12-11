import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = { id: string; title: string; points: number; done: boolean };

const DEFAULT_TASKS: Record<string, Task[]> = {
  Monday: [
    { id: '1', title: 'Umyj zęby', points: 5, done: false },
    { id: '2', title: 'Posprzątaj zabawki', points: 10, done: false }
  ],
  Tuesday: [
    { id: '3', title: 'Przygotuj buty', points: 3, done: false }
  ],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
};

export default function ChildScreen() {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS['Monday']);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const savedScore = await AsyncStorage.getItem('@child_score');
        const savedTasksJson = await AsyncStorage.getItem(`@tasks_${selectedDay}`);
        if (savedScore) setScore(Number(savedScore));
        if (savedTasksJson) setTasks(JSON.parse(savedTasksJson));
        else setTasks(DEFAULT_TASKS[selectedDay] ?? []);
      } catch (e) {
        console.warn('Failed to load child data', e);
      }
    })();
  }, [selectedDay]);

  const saveTasks = async (day: string, newTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(`@tasks_${day}`, JSON.stringify(newTasks));
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
  };

  const toggleDone = (id: string) => {
    const newTasks = tasks.map(t => {
      if (t.id === id) {
        const wasDone = t.done;
        const updated = { ...t, done: !t.done };
        // update score only when marking done
        if (!wasDone && updated.done) {
          const newScore = score + t.points;
          setScore(newScore);
          AsyncStorage.setItem('@child_score', String(newScore)).catch(() => {});
        }
        return updated;
      }
      return t;
    });
    setTasks(newTasks);
    saveTasks(selectedDay, newTasks);
  };

  const addSampleTask = () => {
    const newTask: Task = { id: Date.now().toString(), title: 'Nowe zadanie', points: 5, done: false };
    const newTasks = [newTask, ...tasks];
    setTasks(newTasks);
    saveTasks(selectedDay, newTasks);
  };

  const resetProgress = () => {
    Alert.alert('Reset', 'Czy na pewno chcesz zresetować punkty?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Resetuj',
        style: 'destructive',
        onPress: async () => {
          setScore(0);
          await AsyncStorage.removeItem('@child_score');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Ania</Text>
          <Text style={styles.score}>Punkty: {score}</Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.dayButtonActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>{day.slice(0,3)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.toolsRow}>
        <TouchableOpacity style={styles.addButton} onPress={addSampleTask}><Text style={styles.addText}>Dodaj zadanie</Text></TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskRow}>
            <TouchableOpacity onPress={() => toggleDone(item.id)} style={styles.checkbox}>
              <Text>{item.done ? '✓' : ''}</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskTitle, item.done && styles.taskDone]}>{item.title}</Text>
              <Text style={styles.taskPoints}>{item.points} pkt</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Brak zadań na ten dzień</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#4f9cff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: 'white', fontWeight: '700', fontSize: 20 },
  name: { fontSize: 18, fontWeight: '600' },
  score: { color: '#666' },
  resetButton: { padding: 8 },
  resetText: { color: '#d00' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dayButton: { padding: 8, borderRadius: 6, backgroundColor: '#f0f0f0' },
  dayButtonActive: { backgroundColor: '#4f9cff' },
  dayText: { fontSize: 12 },
  dayTextActive: { color: 'white' },
  toolsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  addButton: { backgroundColor: '#28a745', padding: 8, borderRadius: 6 },
  addText: { color: 'white' },
  taskRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  checkbox: { width: 32, height: 32, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  taskTitle: { fontSize: 16 },
  taskDone: { textDecorationLine: 'line-through', color: '#999' },
  taskPoints: { color: '#888', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 20, color: '#666' }
});
