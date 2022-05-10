import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, ScrollView, LogBox} from 'react-native'
//import Slider from '@react-native-community/slider';
import {Slider} from '@miblanchard/react-native-slider';
import CustomButton from '../components/CustomButton';
//import WavyBackground from "react-native-wavy-background";
import { SafeAreaView } from 'react-native-safe-area-context';

const Item = ({data, navigation, access_token}) => {
    const [scale, setScale] = useState(0)
    const [mark, setMark] = useState(0)

    const renderAboveThumbComponent = () => {
        return(
            <View style={aboveThumbStyles.container}> 
                <Text style = {aboveThumbStyles.text}> {scale} </Text> 
            </View>
        );
        

    };
    const renderTrackMarkComponent = (value) => {
        const currentSliderValue = value || (Array.isArray(value) && value[0]) || 0;
            const style =
                scale > Math.max(currentSliderValue)
                    ? trackMarkStyles.activeMark
                    : trackMarkStyles.inactiveMark;
            return <View style={style} />;
    }

    return (
       <SafeAreaView>
           <Text style={styles.preguntaStyle}> {data.pregunta}</Text>
           <Text></Text>
            <View style={styles.containerSlider}>
                <Slider
                        value={scale}
                        onValueChange={setScale}
                        maximumValue={100} 
                        minimumValue={0}
                        step={1}
                        animateTransitions
                        minimumTrackTintColor = "#FC4C02"
                        thumbTintColor = "red"
                        trackMarks={[100]}
                        trackStyle = {styles.trackStyle} 
                        renderTrackMarkComponent = {renderTrackMarkComponent}
                        renderAboveThumbComponent={renderAboveThumbComponent}
                />
            </View>
       </SafeAreaView>
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
    

function RegisterEffortsScreen({route, navigation}) {
    console.log(route.params)
    const {id_actividad, access_token } = route.params;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        //Recibir la data de las preguntas y tipo de respuesta las preguntas.
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
        //JSON de prueba 
        var dataJSONtest = [{id_pregunta : 1, pregunta : "¿Cómo calificaría el nivel de esfuerzo para completar el entrenamiento?", tipo_respuesta: "slider"},
        {id_pregunta : 2, pregunta : "¿Cómo calificaría su calidad de sueño la noche anterior al entrenamiento?", tipo_respuesta: "slider"}, {id_pregunta : 3, pregunta : "¿Como calificaria su motivación durante el entrenamiento?", tipo_respuesta: "slider"},
        {id_pregunta : 4, pregunta : "¿Cómo calificaría su estrés durante el entrenamiento?", tipo_respuesta: "slider"}, {id_pregunta : 5, pregunta : "¿Cómo calificaría su ánimo durante el entrenamiento?", tipo_respuesta: "slider"},
        {id_pregunta : 6, pregunta : "¿Cómo calificaría su ánimo durante el entrenamiento?", tipo_respuesta: "slider"},
        {id_pregunta : 7, pregunta : "¿Cómo calificaría su ánimo durante el entrenamiento?", tipo_respuesta: "slider"},
        {id_pregunta : 8, pregunta : "¿Cómo calificaría su ánimo durante el entrenamiento?", tipo_respuesta: "slider"},
        {id_pregunta : 9, pregunta : "¿Cómo calificaría su ánimo durante el entrenamiento?", tipo_respuesta: "slider"},
        ]

        setData(dataJSONtest)
        setLoading(false)
    }, [])

    const handleClick = () => {
        alert("Datos guardados!")
        console.log("datos guardados")
    }

    const renderItem = ({ item }) => (
        <Item data={item} navigation={navigation} access_token={access_token} />
    )


    if(loading){
        return <Text> Loading... </Text>
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
        color: "#3C3C3C"
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
        fontWeight: "bold",
        fontSize: 18,
    },
    containerFlatList: {
        paddingBottom :20
    }
})

const trackMarkStyles = StyleSheet.create({
    activeMark: {
        borderColor: 'red',
        borderRadius: 20,   
        borderWidth : 3,
        left: 13,
    },
    inactiveMark: {
        borderColor: '#FC4C02',
        borderRadius: 20,
        borderWidth : 3,
        left: 13,
    },
});

export const aboveThumbStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'white',
        borderWidth: 1,
        height: 20,
        justifyContent: 'center',
        left: -6,
        width: 30,
    },
    text: {
        fontWeight: "bold",
    }
});

export default RegisterEffortsScreen;