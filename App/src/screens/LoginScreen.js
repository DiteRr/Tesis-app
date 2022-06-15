import { StyleSheet, Text, View, Image, TouchableOpacity, Button} from 'react-native'
import React, {useState}from 'react'
import { authorize } from 'react-native-app-auth';
import {STRAVA_URI} from "../../constants"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from "react-native-modal-loader";


//Imagenes
import Logo from '../assets/logo.png'

function LoginScreen2({navigation}) {
  const [loader, setLoader] = useState(false);

  const connectStrava = async () => {
    //Autorización de acceso de datos de STRAVA.
    setLoader(true)

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

    var authState = {}

    //Solicitar autorización
    try{
        authState = await authorize(config);
    }catch(e){
        //No concedió autorización(Canceló)
        setLoader(false)
    }
    
    //Concedió autorización de los datos
    console.log("authState", authState)

    //Formato JSON a recibir en la API.
    var loginData ={ID: authState.tokenAdditionalParameters.athlete.id, username: authState.tokenAdditionalParameters.athlete.username, firstname: authState.tokenAdditionalParameters.athlete.firstname, 
    lastname: authState.tokenAdditionalParameters.athlete.lastname, access_token: authState.accessToken, refresh_token: authState.refreshToken};
    
    var headers = {'Content-Type': 'application/json'};
    
    //Solicitud guardar credenciales del usuario en la base de datos.
    const result = await fetch(STRAVA_URI + 'save_user', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(loginData)
    });

    //Respuesta de la API
    const res = await result.json()

    console.log(res['status'])
    if(res['status']== 200){
        //Datos guardados satisfactoriamente
        //console.log(authState.tokenAdditionalParameters.expires_at)

        //Guardar en memoria fecha de expiración del token
        await AsyncStorage.setItem('expired_at', ''+ authState.tokenAdditionalParameters.expires_at.toString()+"000");
        //Guardar en memoria el ID del usuario
        await AsyncStorage.setItem('username', ''+ authState.tokenAdditionalParameters.athlete.id.toString());
        //Guardar en memoria refresh token del usuario
        await AsyncStorage.setItem('password', ''+ authState.refreshToken.toString());
         //Guardar en memoria el token del usuario
        await AsyncStorage.setItem('access_token', ''+ authState.accessToken.toString());
        
        navigation.replace('TabNavigator', {
            id: authState.tokenAdditionalParameters.athlete.id,
            refresh_token: authState.refreshToken,
            access_token: authState.accessToken,
        })
    }



  }
  return (
    <View style = {styles.root}>
        <Image source = {Logo} style={styles.logo} />
        <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={connectStrava}
            testID="ConnectStrava.Button"
        >
        <Image
                source={require('../assets/btn_strava_connectwith_orange.png')}
        />
        </TouchableOpacity>
        <Loader loading={loader} color="#FC4C02" />
    </View>
  )
}

const styles = StyleSheet.create({
    logo: {
        width: 200,
        height: 200,
        marginTop: 100,
        marginBottom: 50,
        alignSelf: 'center'
    },
})

export default LoginScreen2;