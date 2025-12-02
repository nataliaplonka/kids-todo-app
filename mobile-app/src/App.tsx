import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import TasksScreen from './screens/TasksScreen';
import { initializeFirebase } from './firebaseConfig';

initializeFirebase();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Tasks" component={TasksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
