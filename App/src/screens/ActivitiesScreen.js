import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Pressable, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
var SharedPreferences = require('react-native-shared-preferences');
//Imagenes
import Logo from '../assets/logo.png'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {STRAVA_URI} from "../../constants"
import PushNotification from "react-native-push-notification";
import moment from "moment";



PushNotification.createChannel(
    {
      channelId: "1", // (required)
      channelName: "main", // (required)
      channelDescription: "main", // (optional) default: undefined.
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    });

const Item = ({data, navigation, id_user, refresh_token}) => {

    const onClickItem = () => {
        console.log("Probando")
        navigation.navigate('RegisterEffortsScreen', {
            data_actividad : data,
            id_user : id_user,
            refresh_token : refresh_token,
        })
    }

    var date = new Date(data.start_date_local)
    //Formato fecha
    var meses = [
        "Enero", "Febrero", "Marzo",
        "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre",
        "Noviembre", "Diciembre"
      ]
    
    var dias = [
        "Lunes", "Martes", "Miercoles",
        "Jueves", "Viernes", "Sabado",
        "Domingo"
    ]

    const dia = date.getDate()
    const mes = date.getMonth()
    const ano = date.getFullYear()
    const hrDay =moment(data.start_date_local).format('h:mm a')
    const diaSemana =date.getDay()

    const dateString = dias[diaSemana]+" "+dia+" de "+meses[mes]+" de "+ano+", "+hrDay


    //Formato string tiempo 
    var hrs = 0
    var restohrs = 0
    var mins = 0
    var segs = 0
    var timeString = ""
    if(data.elapsed_time >= 60){
        if(data.elapsed_time >= 3600){
            hrs = Math.floor(data_elapsed_time/3600)
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
        <TouchableOpacity style={styles.item} onPress={onClickItem}>
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

//Renderiza el separador
const renderSeparator = () => (
    <View
        style={{
        backgroundColor: '#E3E3E3',
        height: 1,
        }}
    />
    );
    


function ActivitiesScreen({route, navigation}) {
    const {id, refresh_token} = route.params;
    const [activities, setActivities] = useState(null);
    const [prob, setProb] = useState(true);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);
    //Se ejectua 1 sola vez al rederizar la aplicación por 1 vez.
    useEffect(()  => {
        getActivities()
       
    }, []);


    const getActivities = async () => {

        //Update access_token and getActivities
        var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
        var refresh_token_json ={'refresh_token': refresh_token};

        var result = await fetch(STRAVA_URI + 'update_token', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(refresh_token_json)
        });
        const res_activities = await result.json() 
       
        var lengthActivities = await AsyncStorage.getItem('length');
        if(lengthActivities == null){ // Se inicializa por primera vez ingresando a la aplicación.
            var id_user = {'id_user': id}
            result = await fetch(STRAVA_URI + 'Actividades_registradas', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(id_user)
            });

            const res_registerA = await result.json()
            console.log(res_registerA)
            await AsyncStorage.setItem('length', ''+res_registerA['data'].length);
            for(var i=0; i<res_registerA['data'].length; i++){
                await AsyncStorage.setItem(''+i, ''+res_registerA['data'][i]['id_activity']);
            }
            lengthActivities = res_registerA['data'].length
        }
 
        const activitiesShow= []
        var flag = 0
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


        setActivities(activitiesShow)
        setRefreshing(false)
        //setActivities(res_activities['activities'])
        //console.log(res_activities)
        setLoading(false)
    }

    const renderItem = ({ item }) => (
        <Item data={item} navigation={navigation} id_user={id} refresh_token={refresh_token}/>
    )

    if(loading){
        return(
            <View style={styles.activityIndicator}>
                    <ActivityIndicator size="large" color="#FC4C02" />
            </View>
        )
    }
    console.log("paso por aca")
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}> Actividades última semana. </Text>
            <FlatList
                data={activities}
                renderItem={renderItem}
                keyExtractor={item => item.id_actividad}
                ItemSeparatorComponent={renderSeparator}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getActivities} colors={['#FC4C02']} />
                  }
            />
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
})

export default ActivitiesScreen;