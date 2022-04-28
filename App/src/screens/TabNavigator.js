import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

//Navigators
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


//Screens
import ActivitiesScreen from './ActivitiesScreen';
import StatisticsScreen from './StatisticsScreen';

//Pestaña habitos
 
const Tab = createMaterialBottomTabNavigator();

function TabNavigator({route, navigation}) {
  const {id, refresh_token} = route.params;
  return (
      <Tab.Navigator
        style = {styles.tab}
        initialRouteName="Feed"
        activeColor="#FFFFFF"
        labelStyle={{ fontSize: 12 }}
        style={{ backgroundColor: '#FFFFFF' }}
        barStyle={{ backgroundColor: "#FC4C02" }}
      >
        <Tab.Screen
          name="Activities"
          component={ActivitiesScreen}
          initialParams={{id, refresh_token}}
          options={{
            tabBarLabel: 'Activities',
            tabBarIcon: ({ white }) => (
              <MaterialCommunityIcons name="lock" color= '#FFFFFF' size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          initialParams={{id, refresh_token}}
          options={{
            title : "Estadisticas",
            tabBarLabel: 'Statistics',
            tabBarIcon: ({ white }) => (
              <MaterialCommunityIcons name="lock" color= '#FFFFFF' size={26} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
    tab : {
        backgroundColor: '#FC4C02'
    }
})

export default TabNavigator