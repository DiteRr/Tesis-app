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
import AsyncStorage from '@react-native-async-storage/async-storage'
//import WavyBackground from "react-native-wavy-background";

//Components 
import CustomHeader from './src/components/CustomHeader'

const Stack = createNativeStackNavigator();

function App() {
    
    const [login, setLogin ] = useState(false)
    const [loading, setLoading] = useState(true)
    const [id, setUsername ] = useState('')
    const [refresh_token, setPassword]= useState('')
    
    useEffect(() => {
      
      async function fetchData(){
        var username = await AsyncStorage.getItem('username');
        console.log(username)
        if(username != null){
          setLogin(true)
          var password = await AsyncStorage.getItem('password');
          setPassword(password)
          setUsername(username)
       }

       setLoading(false)
      }

      fetchData()


    }, []);

    if(loading){
      return( <Text></Text>);
    }

    console.log(login)
    console.log(id)
    console.log(refresh_token)
    if(login){
      console.log("LOGENADOMEEEEEEEEEEEEEEE...")
      return(
        <NavigationContainer>
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
                ({ route, navigation }) => ({ headerTitle: () => <CustomHeader title ={route.params.id} navigation={navigation}/>,
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
              initialParams={{id, refresh_token}} 
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
                  ({ route, navigation }) => ({ headerTitle: () => <CustomHeader title ={route.params.id} navigation={navigation}/>,
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