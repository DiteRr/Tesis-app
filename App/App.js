import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Pressable} from 'react-native'

//Screens 
import LoginScreen from "./src/screens/LoginScreen"
import TabNavigator from "./src/screens/TabNavigator"

//Navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
          <Stack.Navigator 
          screenOptions={{
            contentStyle: {backgroundColor:'#FFF'},
            headerBackVisible: false,
          }} 
          initialRouteName="Home">
            <Stack.Screen 
              options={{ headerShown: false}} 
              name="Login" 
              component={LoginScreen} 
              initialParams={{}} 
            />
            <Stack.Screen 
              options={{
                title: 'Usuario',
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#FC4C02',
                },
                contentStyle: {backgroundColor:'#FFF'},
                headerTitleStyle: {
                  fontSize: 18,
                },
                                
              }} 
              name="TabNavigator" 
              component={TabNavigator} 
              initialParams={{}} 
            />
          </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;