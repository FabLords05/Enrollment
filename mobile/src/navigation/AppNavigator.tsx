/**
 * AppNavigator.tsx
 *
 * Root stack navigator that handles auth state switching.
 * - When loading: shows centered spinner
 * - When user is null: renders LoginScreen (in stack)
 * - When user exists: renders StudentTabNavigator (in stack)
 *
 * This must be a descendant of <NavigationContainer> in App.tsx
 */

import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import StudentTabNavigator from './StudentTabNavigator';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const auth = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {auth?.loading ? (
        // 1. Loading State: Show splash/loading screen
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ animationEnabled: false }}
        />
      ) : auth?.user ? (
        // 2. Authenticated: Show student tab navigator
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="StudentTabs"
            component={StudentTabNavigator}
            options={{ animationEnabled: false }}
          />
        </Stack.Group>
      ) : (
        // 3. Not Authenticated: Show login screen
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

/**
 * Loading screen shown during auth initialization
 */
function LoadingScreen() {
  const { ActivityIndicator, View, StyleSheet } = require('react-native');
  const { COLORS } = require('../constants/colors');

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.ustpBlue} />
    </View>
  );
}

const styles = require('react-native').StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});