import { StyleSheet, Text, View, FlatList, ScrollView, LogBox, SafeAreaView, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { useEffect, useState } from 'react'
import CustomDropDown from '../components/CustomDropDown'

//Componentes customizados
import CustomButton from '../components/CustomButton';



var DATA = []
  //-- ITEM --
const Item = ({data, navigation}) => {
  const [alternativas, setAlternativas] = useState(null)
  const [loading, setLoading] = useState(true)
  //const [response, setResponse] = useState("")

  useEffect(() => {
    var altern = []
    for(var i=0; i<data.alternativas.length; i++){
      const json = {label: data.alternativas[i], value: data.alternativas[i]}
      altern.push(json)
    }
    setAlternativas(altern)
    setLoading(false)
  }, [])

  const handleClick = (value) => {   
    let objIndex = DATA.findIndex((obj => obj.id_preg == data.id_pregunta));
    DATA[objIndex].respuesta = value.toString()
  } 

  if(loading){
    return(
      <Text></Text>
    )
  }
  if(data.tipo_respuesta == "dropdown"){
      return (
          <SafeAreaView>
              <Text style={styles.preguntaStyle}> {data.pregunta}</Text>
              <CustomDropDown alternativas={alternativas} valueChanged = {(value) => handleClick(value)}/>
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
function RegisterInjuriesScreen({route, navigation}) {
  const {dataEP, data_actividad, id_user, refresh_token} = route.params;  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect( () => {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      async function getPregs(){
        var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
        var tipo_preg = {'tipo_preg': 'pl'}

        const result = await fetch('http://146.83.216.251:5000/Preguntas', {
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
        //console.log(DATA)
        setData(res_pregs['pregs'])


        setLoading(false)
      }
      getPregs()
  }, [])

  const handleClick = async () => {
    //console.log("Preguntas EP", dataEP)
    //console.log("Preguntas lesión", DATA)
    var dataArray = dataEP.concat(DATA)

    var dataJSON = { 'data' : dataArray, 'actividad': data_actividad, 'id_user': id_user}
    var headers = {'Content-Type': 'application/json'};
    //Enviar respuestas 
    const result = await fetch('http://146.83.216.251:5000/Guardar_datos', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(dataJSON)
    });
    const res = await result.json()
    if(res['status'] == 200){
      alert("Datos guardados satisfactoriamente")

      const lengthActivities = await AsyncStorage.getItem('length');
      //console.log("RegisterEffortsScreen", lengthActivities)
      const NewlengthActivities = parseInt(lengthActivities) + 1
      console.log(NewlengthActivities)
      await AsyncStorage.setItem('length', '' + NewlengthActivities);
      await AsyncStorage.setItem(''+ lengthActivities, ''+ data_actividad['id_actividad'])

      /*navigation.replace('TabNavigator', {
          id: id_user,
          refresh_token: refresh_token,
      })*/
      /*navigation.reset('TabNavigator',{ 
        id: id_user,
        refresh_token: refresh_token,
      })*/

      navigation.reset({
        index : 0,
        routes: [{ name: 'TabNavigator', params:{id: id_user, refresh_token: refresh_token}}],
      })
    }
    else{
      alert("Error al guardar los datos!!!")
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
      paddingLeft: 15,
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