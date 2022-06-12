import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView, LogBox, ActivityIndicator, SafeAreaView} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
//import Slider from '@react-native-community/slider';
import {Slider} from '@miblanchard/react-native-slider';
import CustomButton from '../components/CustomButton';
//import WavyBackground from "react-native-wavy-background";
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

    //Preguntas slider
    if(data.tipo_respuesta == "slider"){
        return (
            <View>
                {/*<Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>*/}
                <Text style={styles.preguntaStyle}> {data.pregunta}</Text>
                <Text></Text>
                <CustomSlider valueChanged= {(value) => handleClick(value)} color={ data.tipo_preg == 'positiva' ? '#C3FC00' : 'red'}></CustomSlider>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style= {{color: "black"}}> {data.valueStringMin} </Text>
                    <Text style={{color: "black"}}> {data.valueStringMax} </Text>
                </View>
                <Text></Text>
            </View>
            ); 
    }

      //Preguntas dropdown
    if(data.tipo_respuesta == "dropdown"){
        return (
            <SafeAreaView>
                {/*<Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>*/}
                <Text style={styles.preguntaStyle}> {data.pregunta}</Text>
                <CustomDropDown alternativas={data.alternativas} valueChanged = {(value) => handleClick(value)}/>
            </SafeAreaView>
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
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        async function getPregs(){

            //Recibir la data de las preguntas y tipo de respuesta las preguntas.
            var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
            var tipo_preg = {'tipo_preg': 'pep'}
            const result = await fetch(STRAVA_URI + 'Preguntas2', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(tipo_preg)
            });

            const res_pregs = await result.json()

            function decode_utf8(s) {
                return decodeURIComponent(escape(s));
            }

            //Crear arreglo DATA para guardar las respuestas de manera global.
            DATA = []
            //Preguntas slider
            for(var i=0; i<res_pregs['pregs']["preguntas_slider"].length; i++){
                var obj = {id_preg: res_pregs['pregs']["preguntas_slider"][i]['id_pregunta'], respuesta : "0"}
                DATA.push(obj)
            }

            //Procesar dropdown
            for(var i=0; i<res_pregs['pregs']["preguntas_dropdown"].length; i++){
                var altern = []
                var obj = {id_preg: res_pregs['pregs']["preguntas_dropdown"][i]['id_pregunta'], respuesta : "0"}
                //Procesar alternativas para que asocie a la data correpondiente a recibir en el CustomDropDown.
                for(var j=0; j<res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'].length; j++){
                //const json = {label: decode_utf8(data.alternativas[j]), value: decode_utf8(data.alternativas[j])}
                const json = {label: res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa'], value: res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa']}
                altern.push(json)
                }

                //Agregar el nuevo formato de alternativas asociados a la data a recibir en el CustomDropDown.
                res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'] = altern
                DATA.push(obj)
            }

            //Unir preguntas en un mismo arreglo.
            const pregs_total = res_pregs['pregs']["preguntas_slider"].concat(res_pregs['pregs']["preguntas_dropdown"])
            setData(pregs_total)
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
            console.log(dataJSON)
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