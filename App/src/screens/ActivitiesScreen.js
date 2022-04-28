import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Pressable, FlatList, TouchableOpacity, Image} from 'react-native'

//Imagenes
import Logo from '../assets/logo.png'

const Item = ({data}) => {

    const onClickItem = () => {
        console.log("Probando")
    }
    return (
        <TouchableOpacity style={styles.item} onPress={onClickItem}>
            <View style={styles.view}>
                <Image
                    style={styles.logo}
                    source={Logo}
                />
                <Text style={styles.title}>{data.name}</Text>
            </View>
        </TouchableOpacity>
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
    


function ActivitiesScreen({route, navigation}) {
    const {id, refresh_token} = route.params;
    const [access_token, setAccess_token] = useState('');
    const [activities, setActivities] = useState(null);
    const [prob, setProb] = useState(true);
    const [loading, setLoading] = useState(true);

    //Se ejectua 1 sola vez al rederizar la aplicación por 1 vez.
    useEffect(()  => {
        async function getActivities(){

            //Update access_token
            var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
            var refresh_token_json ={'refresh_token': refresh_token};

            const result = await fetch('http://192.168.0.10:5000/update_token', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(refresh_token_json)
            });
        
            const res = await result.json()
            //console.log(res['access_token'])
            
            //Fetch activities 

            var access_token_json = {'access_token': res['access_token']};

            const result_activities = await fetch('http://192.168.0.10:5000/activities_user', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(access_token_json)
                });
    
            const res_activities = await result_activities.json()

            setActivities(res_activities['activities'])
            setLoading(false)
        }

        
        getActivities()
       
    }, []);

    const renderItem = ({ item }) => (
        <Item data={item} />
    )

    if(loading){
        return <Text> Loading ...</Text>
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}> Actividades última semana. </Text>
            <FlatList
                data={activities}
                renderItem={renderItem}
                keyExtractor={item => item.id_actividad}
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
    },
    title: {
        justifyContent: 'space-between',
        fontSize: 15
    },
    logo: {
        width: 70,
        height: 70,
        marginLeft: 5,
    },
    titleText: {
        textAlign: 'center',
        padding: 30,
        fontWeight: "bold",
        fontSize: 30,
        color: "#3C3C3C"
    }
})

export default ActivitiesScreen;