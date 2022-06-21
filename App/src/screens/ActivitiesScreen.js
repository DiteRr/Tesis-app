import React, {useRef, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Pressable, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl, AppState} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

//Imagenes
import Logo from '../assets/logo.png'
import Check from '../assets/image-check.png'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {STRAVA_URI} from "../../constants"
import PushNotification from "react-native-push-notification";
import moment from "moment";
import { act } from 'react-test-renderer';
import {Query} from "../utils/Query"
import check from "../assets/check.gif"


//Canal para la notificaciónes.
PushNotification.createChannel(
    {
      channelId: "1", // (required)
      channelName: "main", // (required)
      channelDescription: "main", // (optional) default: undefined.
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });


//Items del FlatList o Actividades del usuario.
const Item = ({data, navigation, id_user, refresh_token, accessToken}) => {
    //Actividad de la última semana que no ha registrado el usuario.

    //Click al Item o Actividad del FlatList.
    const onClickItem = () => {
        navigation.navigate('RegisterEffortsScreen', {
            data_actividad : data,
            id_user : id_user,
            refresh_token : refresh_token,
        })
    }

    //Fecha local
    var date = new Date(data.start_date)

    var meses = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
      ]
    
    var dias = [
        "Domingo", "Lunes", "Martes", "Miercoles",
        "Jueves", "Viernes", "Sabado",
    ]

    //Formato fecha
    const dia = date.getDate()
    const mes = date.getMonth()
    const ano = date.getFullYear()
    const hour = date.getHours()
    const hrDay =moment(data.start_date).local().format('h:mm a')
    const diaSemana =date.getDay()

    const dateString = dias[diaSemana-1]+" "+dia+" de "+meses[mes]+" de "+ano+", "+hrDay
    //---------

    //Formato string tiempo de la actividad.
    var hrs = 0
    var restohrs = 0
    var mins = 0
    var segs = 0
    var timeString = ""
    if(data.elapsed_time >= 60){
        if(data.elapsed_time >= 3600){
            hrs = Math.floor(data.elapsed_time/3600)
            restohrs = data.elapsed_time - (3600*hrs)
            mins = Math.floor(restohrs/60)
            segs = restohrs - 60*mins
            timeString = hrs+"h"+" "+mins+"m"+" "+segs+"s"
        }else{
            mins = Math.floor(data.elapsed_time/60) 
            segs = data.elapsed_time - 60*mins
            timeString = mins+"m"+" "+segs+"s"
        }
    }else{
        timeString = data.elapsed_time+"s"
    }
    //--------------------------
    return (
        <TouchableOpacity style={styles.item} onPress={onClickItem} testID={`activity-row-${data.id_actividad}`}>
            <View style={styles.view}>
                <Image
                    style={styles.logo}
                    source={Logo}
                />
                <View style={{flexDirection : 'column', textColor: 'black'}}>
                    <Text style={styles.title}>{data.name}</Text>
                    <Text style={{color: "#3C3C3C", marginBottom: 10}}> {dateString} </Text>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text style={{color: "#3C3C3C"}}> Distancia </Text>
                        <Text style={{color: "#3C3C3C"}}> Tiempo </Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text style={{color: "#3C3C3C"}}> {data.distance}m </Text>
                        <Text style={{color: "#3C3C3C"}}> {timeString} </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

//Renderiza el separador de cada Item o Actividad.
const renderSeparator = () => (
    <View
        style={{
        backgroundColor: '#E3E3E3',
        height: 1,
        }}
    />
    );
    
function ActivitiesScreen({route, navigation}) {
    const {id, refresh_token, access_token} = route.params;
    const [loading, setLoading] = React.useState(true); //No cambiar la posición o se romperá el test de pruebas
    const [activities, setActivities] = React.useState(null); //No cambiar la posición o se romperá el test de pruebas

    const [prob, setProb] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(true);
    const [accessToken, setAccessToken] = React.useState(access_token);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    
    console.log("Estado de la aplicación", appState)
    useEffect( ()  => {
        getActivities()
        const subscription = AppState.addEventListener("change", async (nextAppState) => {
            if(appState.current.match(/inactive|background/) && nextAppState === "active"){
                console.log("Activo appState", await AsyncStorage.getItem('active'))
                if(await AsyncStorage.getItem('active') == '1'){
                    getActivities() 
                }
            }
      
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
          });

        return () => {
            subscription.remove();
        };   
    }, []);


    //Obtener actividades de los usuarios
    const getActivities = async () => {
        /*
        //Hora actual
        var dateNow = new Date()
        
        console.log(await AsyncStorage.getItem('expired_at') - dateNow.getTime())
        //Verificar si la fecha de expiración del token expiró.
        if(await AsyncStorage.getItem('expired_at') - dateNow.getTime() < 0){
            //Se solicitá una actualización del token y obtener las activiadades.
            var result = await fetch(STRAVA_URI + 'update_token', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({'refresh_token': refresh_token})
            });   
            //Actividades del usuario + Nueva fecha expiración del token + Nuevo acces_token
            res_activities = await result.json() 
            
            //Actualizar la fecha de expiración del token en memoria
            await AsyncStorage.setItem('expired_at', ''+ res_activities['expired_at'] + "000");
            
            //Actualizar el token en memoria
            await AsyncStorage.setItem('access_token', ''+ res_activities['access_token']);
            setAccessToken(res_activities['access_token'])
        }else{
            //El token no ha expirado
            //Se solicita las actividades del usuario
            var result = await fetch(STRAVA_URI + '/activities_user', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({'access_token': access_token})
            });
            //Actividades del usuario
            res_activities = await result.json() 
        }
        */

        //Se solicitá una actualización del token y obtener las activiadades.
        //Actividades del usuario + Nueva fecha expiración del token + Nuevo acces_token
        const res_activities = await Query('update_token', {'refresh_token': refresh_token})
    
        //Obtiene el número de actividades que ha registrado el usuario.
        var lengthActivities = await AsyncStorage.getItem('length');

         // lengthActivities == null, cuando el usuario ingresa por primera vez a la aplicación.
        if(lengthActivities == null){ 
            var id_user = {'id_user': id}

            //Consultar por la actividades registradas por el usuario.
            const res_registerA = await Query('Actividades_registradas', id_user)

            //Guardar largo de actividades registradas
            await AsyncStorage.setItem('length', ''+res_registerA['data'].length);

            //Guardar actividades registradas  en memoria.
            for(var i=0; i<res_registerA['data'].length; i++){
                await AsyncStorage.setItem(''+i, ''+res_registerA['data'][i]['id_activity']);
            }
            lengthActivities = res_registerA['data'].length
        }

        const activitiesShow= []
        var flag = 0

        //Matching de actividades no registradas por el usuario(Actividades a mostrar)
        for(var i=0; i<res_activities['activities'].length; i++){
            flag = 1
            for(var j=0; j<parseInt(lengthActivities); j++){
                var id_actividad = await AsyncStorage.getItem(''+j);
                if(res_activities['activities'][i]['id_actividad'] == id_actividad){
                    flag = 0
                    break
                }
            }   
            if(flag){
                activitiesShow.push(res_activities['activities'][i])
            }

        }

        console.log("ActivitiesShow", activitiesShow)
        if(activitiesShow.length == 0){
            console.log("DEBERIA PASAR POR ACAAAAAAAAAAA!!!!!!!!!!!!!!!!!1", activitiesShow)
            await AsyncStorage.setItem('active', '1');
        }else{
            await AsyncStorage.setItem('active', '0');
        }

        setActivities(activitiesShow)
        setRefreshing(false)
        setLoading(false)
    }

    const renderItem = ({ item }) => (
        <Item data={item} navigation={navigation} id_user={id} refresh_token={refresh_token} accessToken={accessToken}/>
    )

    if(loading){
        return(
            <View style={styles.activityIndicator}>
                    <ActivityIndicator testID='Progress.Activity' size="large" color="#FC4C02" />
            </View>
        )
    }

    console.log(activities)
    return (
        <View style={[styles.container, activities.length <= 1 && {justifyContent: "flex-start",}]}>
            <Text testID='Text.Activity' style={styles.titleText}> Actividades última semana. </Text>
            { activities.length < 1 ?
                <View>
                    <Image 
                        style={styles.image}
                        source={require('../assets/icono-check.png')}
                    />
                    {/*<Image 
                        style={styles.image}
                        source={{
                            uri: 'https://c.tenor.com/_4K_0sndwtEAAAAi/orange-white.gif'
                        }}
                    />*/}
                    <Text style={{fontSize: 17, fontWeight: "bold", textAlign: 'center'}}> ¡Registraste todas tus actividades!</Text>
                    <Text style={{fontSize: 17, fontWeight: "bold", textAlign: 'center'}}> ¡Regresa cuando hayas realizado una nueva actividad!</Text>
                </View>
            :
                <FlatList
                    data={activities}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_actividad}
                    ItemSeparatorComponent={renderSeparator}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={getActivities} colors={['#FC4C02']} />
                    }
                />             
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
    },
    item: {     
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    view: {
        flexDirection: 'row',
        textColor: 'black',
    },
    title: {
        fontSize: 17,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logo: {
        width: 70,
        height: 70,
        marginLeft: 5,
    },
    titleText: {
        textAlign: 'center',
        padding: 30,
        fontWeight: "bold",
        fontSize: 30,
        color: "#3C3C3C"
    },
    activityIndicator:{
        flex: 1,
        justifyContent: "center"
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 100,
        alignSelf: 'center'
    },
})

export default ActivitiesScreen;