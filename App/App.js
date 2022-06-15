import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View, Button, Pressable, ImageBackground} from 'react-native'
//import Svg, {Path} from 'react-native-svg'

//Screens 
import LoginScreen from "./src/screens/LoginScreen"
import TabNavigator from "./src/screens/TabNavigator"
import RegisterEffortsScreen from "./src/screens/RegisterEffortsScreen"
import Holamundo from "./src/screens/HolaMundo"
import RegisterInjuriesScreen from "./src/screens/RegisterInjuriesScreen"

//Navigator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URI} from '@env'
//import WavyBackground from "react-native-wavy-background";

//Components 
import Header from './src/components/Header'

const Stack = createNativeStackNavigator();

function App() {
    
    const [login, setLogin ] = useState(false)
    const [loading, setLoading] = useState(true)
    const [id, setUsername ] = useState('')
    const [refresh_token, setPassword]= useState('')
    const [access_token, setToken]= useState('')
    
    useEffect(() => {
      
      //Verificar si las credenciales estan guardades en memoria del dispostiva.
      async function fetchData(){
        var username = await AsyncStorage.getItem('username');
        if(username != null){
          //El usuario se logeó anteriormente.

          var password = await AsyncStorage.getItem('password');
          var token = await AsyncStorage.getItem('access_token');
          setLogin(true) 
          setPassword(password)
          setUsername(username)
          setToken(token)
       }
       setLoading(false)
      }

      fetchData()

    }, []);

    if(loading){
      return( <Text></Text>);
    }

    if(login){
      //Se encuentra almacenada las credenciales del usuario en memoria.
      console.log("Autenticación automatica")
      return(
        <NavigationContainer
        >
          <Stack.Navigator 
          screenOptions={{
            contentStyle: {backgroundColor:'#FFF'},
            headerBackVisible: false,
          }} 
          initialRouteName="Home"
          >
            <Stack.Screen 
              name="TabNavigator" 
              component={TabNavigator}
              options={
                ({ route, navigation }) => ({ headerTitle: () => <Header title ={route.params.id} navigation={navigation}/>,
                title: 'Usuario',
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#FC4C02',
                  },
                  contentStyle: {backgroundColor:'#FFF'},
                  headerTitleStyle: {
                    fontSize: 18,
                  }
                })
              }
              initialParams={{id, refresh_token, access_token}} 
            />
            <Stack.Screen 
                options={{ headerShown: false}} 
                name="Login" 
                component={LoginScreen} 
                initialParams={{}} 
              />
            <Stack.Screen 
              options={{ headerShown: false}} 
              name="RegisterEffortsScreen" 
              component={RegisterEffortsScreen} 
              initialParams={{}} 
            />
            <Stack.Screen 
              options={{ headerShown: false}} 
              name="RegisterInjuriesScreen" 
              component={RegisterInjuriesScreen} 
              initialParams={{}} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    else{
      //No se encuentra almacenada las crencianles del usuario en memoria.
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
                options={
                  ({ route, navigation }) => ({ headerTitle: () => <Header title ={route.params.id} navigation={navigation}/>,
                  title: 'Usuario',
                    headerTintColor: '#fff',
                    headerStyle: {
                      backgroundColor: '#FC4C02',
                    },
                    contentStyle: {backgroundColor:'#FFF'},
                    headerTitleStyle: {
                      fontSize: 18,
                    }
                  })
                }
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
              <Stack.Screen 
                options={{ headerShown: false}} 
                name="RegisterInjuriesScreen" 
                component={RegisterInjuriesScreen} 
                initialParams={{}} 
              />
            </Stack.Navigator>
          </NavigationContainer>
      );
    }
}

export default App;