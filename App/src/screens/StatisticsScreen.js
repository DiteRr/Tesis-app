import { StyleSheet, Text, View, Dimensions, FlatList, RefreshControl, ScrollView, ActivityIndicator, LogBox, Image} from 'react-native'
import React, {useState} from 'react'
import {useFocusEffect} from '@react-navigation/native'
import {LineChart} from "react-native-chart-kit";
import {STRAVA_URI} from "../../constants"
import moment from "moment";


function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}


const Item = (data) => {
  const size = data["data"]["pregs"]["data"].length

  if(size != 0){

    //Nuevo formato para el label de las fechas.
    var labels = data["data"]["pregs"]["labels"].map(
      function(label) {
        return moment(new Date(label)).format('DD-MM-YYYY')
      }
    )

    return(
      <View>
        <Text style={{ fontSize: 15, textAlign: 'center', paddingTop: 10, color: "#000"}}> {decode_utf8(data["data"]["pregs"]["pregunta"])} </Text>
        {/*<Text style={{ fontSize: 15, textAlign: 'center', paddingTop: 10, color: "#000"}}> {data["data"]["pregs"]["pregunta"]} </Text>*/}
        <ScrollView 
          horizontal={true}
          centerContent = {true}
        >
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
            width={size < 12 ? Dimensions.get("window").width : Dimensions.get("window").width + (size-11)*36 } // from react-native
            height={315}
            yAxisInterval={1} // optional, defaults to 1
            withVerticalLabels={true}
            verticalLabelRotation={40}
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
                r: "3",
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
        </ScrollView>
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

  //Hook cuando se accede a a la pesta??a "Statistics" se actualiza.
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

        setData(res['registros'])
        setLoading(false)
      }
      getRegisterActivities()

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
  console.log("Dimensions width", Dimensions.get("window").width)
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
              <View>
                <Image 
                    style={styles.image}
                    source={require('../assets/statistics.png')}
                />
              {/*<Image 
                  style={styles.image}
                  source={{
                      uri: 'https://c.tenor.com/_4K_0sndwtEAAAAi/orange-white.gif'
                  }}
              />*/}
              <Text style={{fontSize: 17, fontWeight: "bold", textAlign: 'center'}}> {"\n"} ??Registra tus primeras actividades para ver tus estad??sticas!</Text>
          </View>
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
  image: {
    width: 300,
    height: 200,
    marginTop: 100,
    alignSelf: 'center'
},
})