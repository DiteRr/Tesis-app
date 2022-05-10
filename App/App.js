import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View, Button, Pressable, ImageBackground} from 'react-native'
//import Svg, {Path} from 'react-native-svg'

//Screens 
import LoginScreen from "./src/screens/LoginScreen"
import TabNavigator from "./src/screens/TabNavigator"
import RegisterEffortsScreen from "./src/screens/RegisterEffortsScreen"
import Holamundo from "./src/screens/HolaMundo"

//Navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
//import WavyBackground from "react-native-wavy-background";

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
            {/*<Stack.Screen options={{ headerShown: false}} name="HolaMundo" component={Holamundo} initialParams={{}} />*/}
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
            <Stack.Screen 
              options={{ headerShown: false}} 
              name="RegisterEffortsScreen" 
              component={RegisterEffortsScreen} 
              initialParams={{}} 
            />
          </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  box:{
    justifyContent: 'flex-end',
    backgroundColor: '#fff'
  },
  bottomWavy: {
    bottom: 0,
  }
})

export default App;