import { StyleSheet, Text, View, Image, TouchableOpacity, Button} from 'react-native'
import React, {useState}from 'react'
import { authorize } from 'react-native-app-auth';
import {STRAVA_URI} from "../../constants"
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from "react-native-modal-loader";
import {Query} from "../utils/Query"
import {AuthStrava} from "../utils/AuthStrava"
import WavyBackground from "react-native-wavy-background";

//Imagenes
import Logo from '../assets/logo.png'
import LogoApp from'../assets/LogoApp2.png'

function LoginScreen({navigation}) {
  const [loader, setLoader] = useState(false);
  const connectStrava = async () => {
    //Autorización de acceso de datos de STRAVA.
    setLoader(true)


    //Solicitar autorización
    const authState = await AuthStrava()
    if(authState != '{}'){
        console.log(authState)
        //Concedió autorización de los datos
        //Formato JSON a recibir en la API.
        const loginData ={ID: authState.tokenAdditionalParameters.athlete.id, username: authState.tokenAdditionalParameters.athlete.username, firstname: authState.tokenAdditionalParameters.athlete.firstname, lastname: authState.tokenAdditionalParameters.athlete.lastname, access_token: authState.accessToken, refresh_token: authState.refreshToken};

        //Solicitud guardar credenciales del usuario en la base de datos.     
        const res = await Query('save_user', loginData)
        console.log("paso por aca")
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
        }else{
            setLoader(false)
        }
    }else{
        setLoader(false)
    }
  }

  return (
    <View style = {styles.root}>
        <View style = {{paddingTop: 100}}>
            <Text testID='Text.LoginScreen' style={styles.titleText}> RunSafeRRI </Text>
            <Image source = {LogoApp} style={[styles.logo]} />
        </View>
        <TouchableOpacity testID="ConnectStrava" style={{alignSelf: 'center'}} onPress={connectStrava} >
            <Image
                    source={require('../assets/btn_strava_connectwith_orange.png')}
            />
        </TouchableOpacity>
        <Loader testID="Loader.LoginScreen" loading={loader} color="#FC4C02"/>
        <View
            style={{
                bottom: 0,
                left: 0,
                right: 0,
            }}>
                <WavyBackground
                height={300}
                width={1100}
                amplitude={25}
                frequency={1}
                offset={150}
                color="#F85A2C"
                bottom
                />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'space-between'
    },
    logo: {
        width: 210,
        height: 180,
        marginBottom: 0,
        alignSelf: 'center'
    },
    titleText: {
        textAlign: 'center',
        paddingBottom: 30,
        fontWeight: "bold",
        fontSize: 40,
        color: "black"
    },
})

export default LoginScreen;