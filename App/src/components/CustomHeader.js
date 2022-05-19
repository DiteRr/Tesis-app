
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import OptionsMenu from "react-native-option-menu";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationHelpersContext } from '@react-navigation/native';

export default function CustomHeader({title, navigation}) {
  
  //console.log("CustomHeader", title)
  //console.log("CustomHeader",navigation)
  const openMenu = () => {
      console.log("Abriendo menu")
  }

  const notifications = () => {
    console.log("notificaciones")
  }

  const signOut = async () => {
      console.log("cerrar sesion")
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      navigation.navigate("Login")

  }
  return (
    <View style={styles.header}>
        <View>
        <Text style={styles.headerText}>{title}</Text>
        </View>
        <OptionsMenu
            style={styles.icon}
            customButton={(<FontAwesome name="gear" color="rgba(255, 255, 255, .9)" size={26}/>)}
            destructiveIndex={1}
            options={["Notificaciones", "Cerrar sesión", 'Cancelar']}
            actions={[notifications, signOut]}/>
    </View>
  )
}

const styles = StyleSheet.create({
    header: {
      width: '97%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#fff',
      letterSpacing: 0,
    },
    icon: {
      flexDirection: 'row-reverse',
      marginRight: 30,
    }
  });
