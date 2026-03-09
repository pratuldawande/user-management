import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AddUserScreen, UserListScreen } from '../screens';
import { User } from '../types/user';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export type RootStackParam = {
  UserListScreen: undefined;
  AddUserScreen:
    | {
        mode: 'create' | 'edit';
        user?: User;
      }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParam>();

const RootNavigator = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="UserListScreen">
          <Stack.Screen
            name="UserListScreen"
            component={UserListScreen}
            options={{ title: 'Users' }}
          />
          <Stack.Screen
            name="AddUserScreen"
            component={AddUserScreen}
            options={{
              title: 'Add User',
              headerBackButtonMenuEnabled: false,
              gestureEnabled: false,
              headerBackVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
