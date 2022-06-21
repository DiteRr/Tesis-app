import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Query} from "../utils/Query"
import CustomSlider from '../components/CustomSlider'

var DATA = []

//Items del FlatList o Actividades del usuario.
const Item = ({data}) => {
    //Actividad de la última semana que no ha registrado el usuario.

    const handleClick = (value) => {
        let objIndex = DATA.findIndex((obj => obj.id_preg == data.id_pregunta));
        DATA[objIndex].respuesta = value.toString()
    }

    return (
        <View>
            {/*<Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>*/}
            <Text style={styles.preguntaStyle}> {data.pregunta}</Text>
            <Text></Text>
            <CustomSlider valueChanged= {(value) => handleClick(value)} color={ data.tipo_preg == 'positiva' ? '#638CCB' : 'red'} flag={false}></CustomSlider>
            {/*<Text>        😡                 🙁                  😐                   🙂                  😁</Text>*/}
            {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style= {{color: "black"}}> {data.valueStringMin} </Text>
                <Text style={{color: "black"}}> {data.valueStringMax} </Text>
            </View>*/}
            <Text></Text>
        </View>
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

function QuestionaryScreen() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect( () => {
        console.log("probando")

        async function getPreguntas(){
            //Recibir las preguntas de cuestionario de usabilidad
            var tipo_preg = {'tipo_preg': 'pu'}
            const res_pregs = await Query('preguntas_usabilidad', tipo_preg)

            DATA = []
            //Preguntas slider, guardar ID + respuesta de cada pregunta slider.
            for(var i=0; i<res_pregs['pregs'].length; i++){
                var obj = {id_preg: res_pregs['pregs'][i]['id_pregunta'], respuesta : "0"}
                DATA.push(obj)
            }
            console.log(DATA)

            setData(res_pregs['pregs'])
            setLoading(false)
        }

        getPreguntas()

    }, []);


    const renderItem = ({ item }) => (
        <Item data={item}/>
    )

    if(loading){
        return(
            <View style={styles.activityIndicator}>
                    <ActivityIndicator size="large" color="#FC4C02" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}> Cuestionario </Text>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id_pregunta}
                ItemSeparatorComponent={renderSeparator}
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
    }, preguntaStyle: {
        fontSize: 18,
        paddingLeft: 15,
        color: "#000"
    }
})

export default QuestionaryScreen;