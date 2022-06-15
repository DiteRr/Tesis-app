import { StyleSheet, Text, View, FlatList, ScrollView, LogBox, SafeAreaView, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { useEffect, useState } from 'react'
import CustomDropDown from '../components/CustomDropDown'
import {STRAVA_URI} from "../../constants"
//Componentes customizados
import CustomButton from '../components/CustomButton';


//Arreglo global para guardar las respuestas de los usuarios.
var DATA = []

//Items o preguntas
const Item = ({data, navigation}) => {
  const [loading, setLoading] = useState(true)

  //Valor de la respuesta
  const handleClick = (value) => {   
    let objIndex = DATA.findIndex((obj => obj.id_preg == data.id_pregunta));
    DATA[objIndex].respuesta = value.toString()
  }

  function decode_utf8(s) {
    return decodeURIComponent(escape(s));
  }

  //Preguntas slider
  if(data.tipo_respuesta == "slider"){
    console.log("data_tipo_respuesta", data.tipo_preg)
    return (
        <View>
            <Text style={styles.preguntaStyle}> {decode_utf8(data.pregunta)}</Text>
            {/*<Text style={styles.preguntaStyle}> {data.pregunta}</Text>*/}
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
function RegisterInjuriesScreen({route, navigation}) {
  const {dataEP, data_actividad, id_user, refresh_token} = route.params;  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true)

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
        DATA = []

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
        setLoading(false)
      }
      getPregs()
  }, [])

  //Guardar datos
  const handleClick = async () => {
    var dataArray = dataEP.concat(DATA)

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
      alert("Datos guardados satisfactoriamente")

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
    else{
      alert("Error al guardar los datos!")
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
      <Text style={styles.titleText}> Registro de lesión. </Text>
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