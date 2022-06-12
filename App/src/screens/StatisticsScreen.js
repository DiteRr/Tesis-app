import { StyleSheet, Text, View, Dimensions, FlatList, RefreshControl, ScrollView, ActivityIndicator, LogBox} from 'react-native'
import React, {useState} from 'react'
import {useFocusEffect} from '@react-navigation/native'
import {LineChart} from "react-native-chart-kit";
import {STRAVA_URI} from "../../constants"
import moment from "moment";


function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}


const Item = (data) => {
  //console.log(data["data"])
  const size = data["data"]["pregs"]["data"].length
  if(size != 0){
    //console.log()
    var labels = data["data"]["pregs"]["labels"].map(
      function(label) {
        return moment(new Date(label)).format('DD-MM-YYYY')
      }
    )
    console.log("labels", labels)
    return(
      <View>
        {/*<Text style={{ fontSize: 15, textAlign: 'center', paddingTop: 10, color: "#000"}}> {decode_utf8(data["data"]["pregs"]["pregunta"])} </Text>*/}
        <Text style={{ fontSize: 15, textAlign: 'center', paddingTop: 10, color: "#000"}}> {data["data"]["pregs"]["pregunta"]} </Text>
        <LineChart
          data={{
            labels: labels,
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
          height={315}
          yAxisInterval={1} // optional, defaults to 1
          withVerticalLabels={true}
          verticalLabelRotation={35}
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
            marginVertical: 0,
            borderRadius: 16
          }}
        />
        {/* <Text style={{ fontSize: 13, fontStyle : 'italic', color: "#000", marginBottom: 25, marginLeft: 30}}> {labels[0]}</Text> */}
        {/*<Text style={{ fontSize: 14, fontStyle : 'italic', textAlign: 'center', color: "#000", marginBottom: 25}}> Actividades realizadas</Text>*/}
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
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    React.useCallback( () => {
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      async function getRegisterActivities(){
        var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
        var id_user = {'id_user': id}
        const result = await fetch(STRAVA_URI + 'Registros', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(id_user)
        });

        const res = await result.json()
        console.log(res)

        setData(res['registros'])
        setLoading(false)
      }
      getRegisterActivities()
      //console.log("Clickeo el tab")
    }, []),
  )


  const renderItem = ({ item }) => (
    <Item data={item} />
  )

  if(loading){
    return(
      <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="#FC4C02" />
      </View>
    )
  }
  return (
    <ScrollView style={{backgroundColor: "#fff"}}>
      <Text style={styles.titleText}>Estadisticas actividades registradas</Text>
      <View>
        { data[0]["pregs"]["data"].length != 0 ?
              <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={item => item.id_preg}
                  ItemSeparatorComponent={renderSeparator}
              />
              :
              <Text></Text>
        }
      </View>
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
  activityIndicator:{
    flex: 1,
    justifyContent: "center"
  },
})