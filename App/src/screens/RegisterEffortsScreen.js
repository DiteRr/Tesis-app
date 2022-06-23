import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView, LogBox, ActivityIndicator, SafeAreaView, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Slider} from '@miblanchard/react-native-slider';
import CustomButton from '../components/CustomButton';
import {CheckBox} from 'react-native-elements';
import CustomSlider from '../components/CustomSlider'
import {STRAVA_URI} from "../../constants"
import {Query} from "../utils/Query"
import RadioButtonRN from 'radio-buttons-react-native';

//Items o preguntas
const Item = ({data, navigation, changeResponse}) => {

    //Valor de la respuesta
    //const handleClick = (value) => {
        //let objIndex = DATA.findIndex((obj => obj.id_preg == data.id_pregunta));
        //DATA[objIndex].respuesta = value.toString()
    //    changeResponse(value, data.id_pregunta)
    //}

    function decode_utf8(s) {
        return decodeURIComponent(escape(s));
    }

    //Preguntas slider
    if(data.tipo_respuesta == "slider"){
        return (
            <View>
                <Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>
                {/*<Text style={styles.preguntaStyle}> {data.pregunta}</Text>*/}
                <Text></Text>
                <CustomSlider valueChanged= {(value) => changeResponse(value, data.id_pregunta)} color={ data.tipo_preg == 'positiva' ? '#3E99D8' : 'red'} flag={true}></CustomSlider>
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
                <Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>
                {/*<Text style={styles.preguntaStyle}> {data.pregunta}</Text>*/}
                <CustomDropDown alternativas={data.alternativas} valueChanged = {(value) => handleClick(value)}/>
            </SafeAreaView>
        ); 
    } 

    // Si existen otro tipo de preguntas ponerlas aca
    return (
        <View></View>
    );
}

//Renderiza el separador de cada pregunta
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
    const [loading, setLoading] = React.useState(true)
    const [data, setData] = React.useState(null);
    const [respuestas, setRespuestas] = React.useState(null);
    const [checkInjury, setCheckInjury] = React.useState(false);

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        //Obtener preguntas de esfuezo percibido
        async function getPregs(){

            //Obtención de preguntas
            var tipo_preg = {'tipo_preg': 'pep'}
            const res_pregs = await Query('Preguntas', tipo_preg)

            function decode_utf8(s) {
                return decodeURIComponent(escape(s));
            }

            //Crear arreglo DATA para guardar las respuestas de manera global.
            const DATA = []

            //Preguntas slider, guardar ID + respuesta de cada pregunta slider.
            for(var i=0; i<res_pregs['pregs']["preguntas_slider"].length; i++){
                var obj = {id_preg: res_pregs['pregs']["preguntas_slider"][i]['id_pregunta'], respuesta : "0"}
                DATA.push(obj)
            }

            //Procesar dropdown
            for(var i=0; i<res_pregs['pregs']["preguntas_dropdown"].length; i++){
                var altern = []
                //Guardar ID + respuesta de cada pregunta dropdown
                var obj = {id_preg: res_pregs['pregs']["preguntas_dropdown"][i]['id_pregunta'], respuesta : "0"}
                //Procesar alternativas para que asocie a la data correpondiente a recibir en el CustomDropDown(Ver componente 
                //CustomDropDown para el formato que se espera).
                for(var j=0; j<res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'].length; j++){
                    const json = {label: decode_utf8(res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa']), value: decode_utf8(res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa'])}
                    //const json = {label: res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa'], value: res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa']}
                    altern.push(json)
                }

                //Agregar el nuevo formato de alternativas asociados a la data a recibir en el CustomDropDown.
                res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'] = altern
                DATA.push(obj)
            }

            //Unir preguntas en un mismo arreglo.
            const pregs_total = res_pregs['pregs']["preguntas_slider"].concat(res_pregs['pregs']["preguntas_dropdown"])
            setRespuestas(DATA)
            setData(pregs_total)
            setLoading(false)
        }

        getPregs()

    }, [])

    //El usuarió tiene lesión
    const onClickCheckBox =  () => {
        setCheckInjury(!checkInjury)
        setNotCheckInjury(!checkNotInjury)
    }

    const onClickCheckBox2 =  () => {
        setCheckInjury(!checkInjury)
        setNotCheckInjury(!checkNotInjury)
    }

    //Guardar datos
    const handleClick = async () => {
        //Verificar si el usuario tuvo lesion.
        if(checkInjury){
            //Pasa a la siguiente actividad de registrar los datos asociados a lesión.
            navigation.navigate('RegisterInjuriesScreen', {
                dataEP: respuestas,
                data_actividad: data_actividad,
                id_user: id_user,
                refresh_token: refresh_token,
            })
            console.log("Pasando a la siguiente actividad")

        }
        else{
            //El usuario no tuvo lesión, se guardan los datos.

            //Formato JSON para guardar los datos.
            var dataJSON = { 'data' : respuestas, 'actividad' : data_actividad, 'id_user': id_user}
            var headers = {'Content-Type': 'application/json'};

            //Enviar respuestas 
            const result = await fetch(STRAVA_URI + 'Guardar_datos', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataJSON)
            });

            const res = await result.json()

            //Verificar si las respuestas se guardaron.
            if(res['status'] == 200){
                Alert.alert("¡Datos guardados satisfactoriamente!")
                
                //Actualizar en numero de actividades registradas por el usuario.
                const lengthActivities = await AsyncStorage.getItem('length');
                const NewlengthActivities = parseInt(lengthActivities) + 1
                await AsyncStorage.setItem('length', '' + NewlengthActivities);
                //Guardar actividad registrada por el usuario.
                await AsyncStorage.setItem(''+ lengthActivities, ''+ data_actividad['id_actividad'])

                navigation.reset({
                    index : 0,
                    routes: [{ name: 'TabNavigator', params:{id: id_user, refresh_token: refresh_token}}],
                })
            }
            else{
                Alert.alert("Error al guardar los datos!")
            }
        }
    }

    if(loading){
        return(
            <View style={styles.activityIndicator}>
                    <ActivityIndicator testID='Progress.RegisterEfforts' size="large" color="#FC4C02" />
            </View>
        )
    }

    const renderItem = ({ item }) => (
        <Item data={item} navigation={navigation} changeResponse={(value, id_preg) => changeResponse(value, id_preg)}/>
    )

    const changeResponse = (value, id_preg) => {

        let objIndex = respuestas.findIndex((obj => obj.id_preg == id_preg));
        respuestas[objIndex].respuesta = value.toString()
    }

    const radioButtonCheck = (value) => {
        if(value.label == "No"){
            setCheckInjury(false)
        }
        else{
            setCheckInjury(true)
        }
    }

    return (
        <ScrollView>
            <Text testID='Text.RegisterEfforts' style={styles.titleText}> Registro esfuerzo percibido. </Text>
            <View style={styles.containerFlatList}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_pregunta}
                    ItemSeparatorComponent={renderSeparator}
                />
                <Text style={styles.preguntaStyle}> ¿Tuvo lesión durante la sesión de entrenamiento?</Text>
                <Text></Text>
                {/*<View style={styles.containerSlider}>
                    <CheckBox title="Sí" checked={checkInjury} onPress={onClickCheckBox}/>
                    <CheckBox title="No" checked={checkNotInjury} onPress={onClickCheckBox}/>
                </View>*/}
                <RadioButtonRN
                    data={[
                        {
                          label: 'No'
                         },
                         {
                          label: 'Sí'
                         }
                    ]}
                    selectedBtn={(e) => radioButtonCheck(e)}
                />
            </View>
            <CustomButton testID="SaveData.Button" text = "Guardar datos" onPress={handleClick}  />
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
        marginLeft: 20,
        marginRight: 20,
        //alignItems: 'stretch',
        flexDirection: 'row',
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