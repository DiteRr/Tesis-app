import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView, LogBox, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
//import Slider from '@react-native-community/slider';
import {Slider} from '@miblanchard/react-native-slider';
import CustomButton from '../components/CustomButton';
//import WavyBackground from "react-native-wavy-background";
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckBox} from 'react-native-elements';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import CustomSlider from '../components/CustomSlider'
import {STRAVA_URI} from "../../constants"

var SharedPreferences = require('react-native-shared-preferences');
var DATA = []
    //-- ITEM --
const Item = ({data, navigation}) => {

    const handleClick = (value) => {
        let objIndex = DATA.findIndex((obj => obj.id_preg == data.id_pregunta));
        DATA[objIndex].respuesta = value.toString()
    }

    function decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }

    // Logica para que tipo de respuesta mostrar en la preguntas de esfuerzo percibido 

    //Preguntas slider primero
    if(data.tipo_respuesta == "slider"){
        return (
            <View>
                {/*<Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>*/}
                <Text style={styles.preguntaStyle}> {data.pregunta}</Text>
                <Text></Text>
                <CustomSlider valueChanged= {(value) => handleClick(value)}></CustomSlider>
            </View>
            ); 
    }
    // Si existen otro tipo de preguntas ponerlas aca
    return (
        <View></View>
    );
}
    //-------------------------------------------------------------------


//Renderiza el separador
const renderSeparator = () => (
    <View
        style={{
        backgroundColor: '#E3E3E3',
        height: 1,
        }}
    />
);
    

function RegisterEffortsScreen({route, navigation}) {
    const {data_actividad, id_user, refresh_token} = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [checkInjury, setCheckInjury] = useState(false);

    console.log(route.params)

    useEffect(() => {
        //Recibir la data de las preguntas y tipo de respuesta las preguntas.
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        async function getPregs(){
            //Recibir la data de las preguntas y tipo de respuesta las preguntas.
            var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
            var tipo_preg = {'tipo_preg': 'pep'}
            const result = await fetch(STRAVA_URI + 'Preguntas', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(tipo_preg)
            });

            const res_pregs = await result.json()

            DATA = []
            for(var i=0; i<res_pregs['pregs'].length; i++){
                var obj = {id_preg: res_pregs['pregs'][i]['id_pregunta'], respuesta : "0"}
                DATA.push(obj)
            }
            console.log(DATA)
            setData(res_pregs['pregs'])
            /*JSON de prueba 
            var dataJSONtest = [{id_pregunta : 1, pregunta : "¿Cómo calificaría el nivel de esfuerzo para completar el entrenamiento?", tipo_respuesta: "slider"},
            {id_pregunta : 2, pregunta : "¿Cómo calificaría su calidad de sueño la noche anterior al entrenamiento?", tipo_respuesta: "slider"}, {id_pregunta : 3, pregunta : "¿Como calificaria su motivación durante el entrenamiento?", tipo_respuesta: "slider"},
            {id_pregunta : 4, pregunta : "¿Cómo calificaría su estrés durante el entrenamiento?", tipo_respuesta: "slider"}, {id_pregunta : 5, pregunta : "¿Cómo calificaría su ánimo durante el entrenamiento?", tipo_respuesta: "slider"},
            {id_pregunta : 6, pregunta : "¿Cómo calificaría su fatiga general durante el entrenamiento?", tipo_respuesta: "slider"},
            ]*/     
            //setData(dataJSONtest)
            setLoading(false)
        }
        getPregs()
    }, [])

    const onClickCheckBox =  () => {
        setCheckInjury(!checkInjury)
    }

    const handleClick = async () => {
        //Verificar si el usuario tuvo lesion.

        if(checkInjury){
            //Pasa a la siguiente actividad de registrar los datos asociados a lesión.
            navigation.navigate('RegisterInjuriesScreen', {
                dataEP: DATA,
                data_actividad: data_actividad,
                id_user: id_user,
                refresh_token: refresh_token,
            })
            console.log("Pasando a la siguiente actividad")

        }
        else{    
            var dataJSON = { 'data' : DATA, 'actividad' : data_actividad, 'id_user': id_user}
            var headers = {'Content-Type': 'application/json'};
            //Enviar respuestas 
            const result = await fetch(STRAVA_URI + 'Guardar_datos', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataJSON)
            });
            const res = await result.json()

            if(res['status'] == 200){
                alert("Datos guardados satisfactoriamente")
                //Guardar el archivo de la aplicación

                const lengthActivities = await AsyncStorage.getItem('length');
                //console.log("RegisterEffortsScreen", lengthActivities)
                const NewlengthActivities = parseInt(lengthActivities) + 1
                console.log(NewlengthActivities)
                await AsyncStorage.setItem('length', '' + NewlengthActivities);
                await AsyncStorage.setItem(''+ lengthActivities, ''+ data_actividad['id_actividad'])

                navigation.reset({
                    index : 0,
                    routes: [{ name: 'TabNavigator', params:{id: id_user, refresh_token: refresh_token}}],
                })
            }
            else{
                alert("Error al guardar los datos!!!")
            }
        }
    }

    const renderItem = ({ item }) => (
        <Item data={item} navigation={navigation} />
    )


    if(loading){
        return(
            <View style={styles.activityIndicator}>
                    <ActivityIndicator size="large" color="#FC4C02" />
            </View>
        )
    }
    return (
        <ScrollView>
            <Text style={styles.titleText}> Registro esfuerzo percibido. </Text>
            <View style={styles.containerFlatList}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_pregunta}
                    ItemSeparatorComponent={renderSeparator}
                />
                <Text style={styles.preguntaStyle}> ¿Tuvo lesión durante la sesión de entrenamiento?</Text>
                <Text></Text>
                <View style={styles.containerSlider}>
                    <CheckBox title="Sí" checked={checkInjury} onPress={onClickCheckBox}/>
                </View>
            </View>
            <CustomButton  text = "Guardar datos" onPress={handleClick}/>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
    },
    titleText: {
        textAlign: 'center',
        padding: 30,
        fontWeight: "bold",
        fontSize: 30,
        color: "#000"
    }, 
    container: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        margin: 16,
        paddingBottom: 32,
    },
    sliderContainer: {
        paddingVertical: 16,
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerSlider: {
        lex: 1,
        marginLeft: 20,
        marginRight: 20,
        //alignItems: 'stretch',
        justifyContent: 'center',
    },
    trackStyle: {
        backgroundColor: '#d0d0d0',
        borderRadius: 5,
        height: 3,
    },
    preguntaStyle: {
        fontSize: 18,
        paddingLeft: 15,
        color: "#000"
    },
    containerFlatList: {
        paddingBottom :20
    },
    activityIndicator:{
        flex: 1,
        justifyContent: "center"
    },
})

export default RegisterEffortsScreen;