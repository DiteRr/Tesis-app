import { StyleSheet, Text, View, Dimensions, FlatList, RefreshControl} from 'react-native'
import React, {useState} from 'react'
import {useFocusEffect} from '@react-navigation/native'
import {LineChart} from "react-native-chart-kit";
import {STRAVA_URI} from "../../constants"

const Item = (data) => {
  const size = data["data"]["pregs"]["data"].length
  if(size != 0){
    //console.log(size)
    return(
      <View>
        <Text style={{ fontSize: 15, textAlign: 'center', paddingTop: 10, color: "#000"}}> {data["data"]["pregs"]["pregunta"]} </Text>
        <LineChart
          data={{
            labels: data["data"]["pregs"]["labels"],
            withLabels: false,
            datasets: [
              {
                data: data["data"]["pregs"]["data"]
              },
              {
                data : [0], //min
                withDots: false,
              },
              {
                data : [100], //max
                withDots: false,
              },
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={200}
          yAxisInterval={1} // optional, defaults to 1
          withVerticalLabels={false}
          yLabelsOffset={10}
          chartConfig={{
            backgroundColor: "#FFF",
            backgroundGradientFrom: "#FFF",
            backgroundGradientTo: "#FFF",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(252, 76, 2, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "0",
              stroke: "#FC4C02"
            },
            fillShadowGradient: "#fff",
            fillShadowGradientFrom: "#fff",
            fillShadowGradientFromOpacity: 0.6,
            fillShadowGradientFromOffset: 0,
            //fillShadowGradientTo: "#fff",
            //useShadowColorFromDataset: true,
            fillShadowGradientToOpacity: 0.1,
            //fillShadowGradientToOffset: 1,
            //useShadowColorFromDataset: true,
          }}
          bezier
          style={{
            marginVertical: 5,
            borderRadius: 16
          }}
        />
        <Text style={{ fontSize: 13, textAlign: 'center', color: "#000", marginBottom: 10}}> Actividades realizadas</Text>
      </View>
    )
  }
  else{
    return(
      <View>
        <Text> Nothing </Text>
      </View>
    )
  }
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

export default function StatisticsScreen({route, navigation}) {
  const {id, refresh_token} = route.params;
  const [data, setData] = useState(null)

  useFocusEffect(
    React.useCallback( () => {
      async function getRegisterActivities(){
        var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
        var id_user = {'id_user': id}
        const result = await fetch(STRAVA_URI + 'Registros', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(id_user)
        });

        const res = await result.json()
        //console.log(res)
        //console.log(res['data']['registros'][0])

        setData(res['data']['registros'])
      }
      getRegisterActivities()
      //console.log("Clickeo el tab")
    }, []),
  )


  const renderItem = ({ item }) => (
    <Item data={item} />
  )

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <Text style={styles.titleText}> Estadisticas </Text>
      <View>
      <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id_preg}
                ItemSeparatorComponent={renderSeparator}
            />
      </View>
  </View>
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
})