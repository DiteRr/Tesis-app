import { StyleSheet, Text, View } from 'react-native'
import { authorize } from 'react-native-app-auth';
import React from 'react'

async function AuthStrava() {
  //Configuración autorización
    const config = {
        clientId: '74995',
        clientSecret: 'd6d2222bb093f8a3117a35aa428c045beac19e67',
        redirectUrl: 'strava://app/Login',
        serviceConfiguration: {
            authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
            tokenEndpoint:
            'https://www.strava.com/oauth/token?client_id=74995&client_secret=d6d2222bb093f8a3117a35aa428c045beac19e67',
    },
        scopes: ['activity:read_all'],
    };  

    try{
        const authState = await authorize(config);
        return authState;
    }catch(e){
        return '{}'
    }
}

export {AuthStrava}