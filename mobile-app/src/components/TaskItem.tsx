import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function TaskItem({ task, onDelete }: any) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.points}>{task.points} pts</Text>
      </View>
      <Button title="Delete" onPress={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16 },
  points: { color: '#888' }
});
