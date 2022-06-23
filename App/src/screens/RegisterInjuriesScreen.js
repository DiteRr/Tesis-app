import { StyleSheet, Text, View, FlatList, ScrollView, LogBox, SafeAreaView, ActivityIndicator, Alert} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { useEffect, useState } from 'react'
import CustomDropDown from '../components/CustomDropDown'
import {STRAVA_URI} from "../../constants"
//Componentes customizados
import CustomButton from '../components/CustomButton';


//Arreglo global para guardar las respuestas de los usuarios.
//var DATA = []

//Items o preguntas
const Item = ({data, navigation, changeResponse}) => {
  const [loading, setLoading] = useState(true)

  function decode_utf8(s) {
    return decodeURIComponent(escape(s));
  }

  //Preguntas slider
  if(data.tipo_respuesta == "slider"){
    console.log("data_tipo_respuesta", data.tipo_preg)
    return (
        <View>
            {/*<Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>*/}
            <Text style={styles.preguntaStyle}> {data.pregunta}</Text>
            <Text></Text>
            <CustomSlider valueChanged= {(value) => changeResponse(value, data.id_pregunta)} color={ data.tipo_preg == 'positiva' ? '#C3FC00' : 'red'} flag={false}></CustomSlider>
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
            <CustomDropDown alternativas={data.alternativas} valueChanged = {(value) => changeResponse(value, data.id_pregunta)} onFocus={data.onFocus} onBlur={data.onBlur}/>
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
function RegisterInjuriesScreen({route, navigation}) {
  const {dataEP, data_actividad, id_user, refresh_token} = route.params;  
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState(null);
  const [respuestas, setRespuestas] = React.useState(null);

  useEffect( () => {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

       //Obtener preguntas de lesión
      async function getPregs(){
        var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
        
        //Formato JSON del tipo de preguntas que se requiere.
        var tipo_preg = {'tipo_preg': 'pl'}

        const result = await fetch(STRAVA_URI + 'Preguntas', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(tipo_preg)
        });

        //Obtención de preguntas
        const res_pregs = await result.json()

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
          var obj = {id_preg: res_pregs['pregs']["preguntas_dropdown"][i]['id_pregunta'], respuesta : ""}
          //Procesar alternativas para que asocie a la data correpondiente a recibir en el CustomDropDown.
          for(var j=0; j<res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'].length; j++){
            const json = {label: decode_utf8(res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa']), value: decode_utf8(res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa'])}
            //const json = {label: res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa'], value: res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'][j]['alternativa']}
            altern.push(json)
          }

          //Agregar el nuevo formato de alternativas asociados a la data a recibir en el CustomDropDown.
          res_pregs['pregs']["preguntas_dropdown"][i]['alternativas'] = altern

          DATA.push(obj)
        }

        //Unificar las preguntas en un solo arreglo
        const pregs_total = res_pregs['pregs']["preguntas_slider"].concat(res_pregs['pregs']["preguntas_dropdown"])
        setData(pregs_total)
        setRespuestas(DATA)
        setLoading(false)
      }
      getPregs()
  }, [])

  //Guardar datos
  /*
  const validacionData = () => {
    for(var i=0; i<respuestas.length; i++){
      if(respuestas[i]['respuesta'] == ""){
        console.log(respuestas[i]['id_preg'])
        let objIndex = data.findIndex((obj => obj.id_pregunta == respuestas[i]['id_preg']));
        console.log(objIndex)
        data[objIndex]['onBlur'] = "red"
        data[objIndex]['onFocus'] = "red"
        //return false
      }
    }
    setData(data)
    console.log(data)
  }
  */
  const validacionData = () => {
    for(var i=0; i<respuestas.length; i++){
      if(respuestas[i]['respuesta'] == ""){
        return false
      }
    }
    return true
  }

  const handleClick = async () => {

    if(validacionData()){
      var dataArray = dataEP.concat(respuestas)
      var dataJSON = { 'data' : dataArray, 'actividad': data_actividad, 'id_user': id_user}
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
        Alert.alert("Datos guardados satisfactoriamente")

        //Actualizar en numero de actividades registradas por el usuario.
        const lengthActivities = await AsyncStorage.getItem('length');
        const NewlengthActivities = parseInt(lengthActivities) + 1
        console.log(NewlengthActivities)
        await AsyncStorage.setItem('length', '' + NewlengthActivities);
        //Guardar actividad registrada por el usuario.
        await AsyncStorage.setItem(''+ lengthActivities, ''+ data_actividad['id_actividad'])

        navigation.reset({
          index : 0,
          routes: [{ name: 'TabNavigator', params:{id: id_user, refresh_token: refresh_token}}],
        })
      }
    }else{
      Alert.alert("¡Rellene todos los campos!")
    }  
  }

  const renderItem = ({ item }) => (
    <Item data={item} navigation={navigation} changeResponse={(value, id_preg) => changeResponse(value, id_preg)}/>
  ) 
  
  const changeResponse = (value, id_preg) => {
    let objIndex = respuestas.findIndex((obj => obj.id_preg == id_preg));
    respuestas[objIndex].respuesta = value.toString()
  }

  const ProbChange= () => {
    console.log(respuestas)
  }
  
  if(loading){
    return(
      <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="#FC4C02" />
      </View>
    )
  }
  
  console.log(data)
  return (
    <ScrollView>
      <Text testID='Text.RegisterInjuries' style={styles.titleText}> Registro de lesión. </Text>
      <View style={styles.containerFlatList}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.id_pregunta}
                    ItemSeparatorComponent={renderSeparator}
                    extraData={data}
                />
      </View>
        <CustomButton testID="SaveData.Button" text = "Guardar datos" onPress={handleClick}/>
    </ScrollView>
  );
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


export default RegisterInjuriesScreen;