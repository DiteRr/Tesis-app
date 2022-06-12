import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

//Navigators
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import ActivitiesScreen from './ActivitiesScreen';
import StatisticsScreen from './StatisticsScreen';

//Components 
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function TabNavigator({route, navigation}) {
  const {id, refresh_token, access_token} = route.params;
  console.log(id, refresh_token, access_token)

  return (
        <Tab.Navigator
          initialRouteName="Feed"
          activeColor="#FFFFFF"
          labelStyle={{ fontSize: 20 }}
          style={{ backgroundColor: '#FFFFFF' }}
          barStyle={{ backgroundColor: "#FC4C02" }}
        >
          <Tab.Screen
            name="Feed"
            component={ActivitiesScreen}
            initialParams={{id, refresh_token, access_token}}
            options={{
              tabBarLabel: 'Actividades',
              tabBarIcon: ({ white }) => (
                <FontAwesome5 name="running" color="rgba(255, 255, 255, .9)" size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Statistics"
            component={StatisticsScreen}
            initialParams={{id, refresh_token}}
            options={{
              title : "Estadisticas",
              tabBarLabel: 'Estadísticas',
              tabBarIcon: ({ white }) => (
                <FontAwesome5 name="chart-line" color= '#FFFFFF' size={26} />
              ),
            }}
          />
        </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
})

export default TabNavigator