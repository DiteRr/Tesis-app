import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Pressable} from 'react-native'
import { authorize } from 'react-native-app-auth';
import { Dropdown } from 'react-native-element-dropdown';
import CustomDropDown from '../components/CustomDropDown'

var SharedPreferences = require('react-native-shared-preferences');

function Holamundo() {

    const handleClick = async () => {
        config = {
            clientId: '74995',
            clientSecret: 'd6d2222bb093f8a3117a35aa428c045beac19e67',
            redirectUrl: 'http://192.168.0.7:5000/strava_token',
            serviceConfiguration: {
              authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
              tokenEndpoint:
                'https://www.strava.com/oauth/token?client_id=74995&client_secret=d6d2222bb093f8a3117a35aa428c045beac19e67',
            },
            scopes: ['activity:read_all'],
        };
      
        const authState = await authorize(config)
    }
    return (
        <View>
            <CustomDropDown alternativas={["1","2","3"]}/>
            <Text>Hola mundo</Text>
            <Button title='Ingresar a strava' color="#841584" onPress={handleClick}></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        margin: 10,
      },
})

export default Holamundo;