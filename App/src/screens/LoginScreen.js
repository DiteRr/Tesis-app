import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View, Image,  ToastAndroid, Pressable, Modal, TouchableOpacity, Linking,
        KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Dimensions, ImageBackground, Button} from 'react-native'

import Loader from "react-native-modal-loader";
import axios from 'axios';

//import AwesomeAlert from 'react-native-awesome-alerts';
//import Loader from "react-native-modal-loader";

//Componentes customizados
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
//import WavyBackground from "react-native-wavy-background";
import {STRAVA_URI} from "../../constants"

//Imagenes
import Logo from '../assets/logo.png'

import AsyncStorage from '@react-native-async-storage/async-storage'


function LoginScreen({navigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);

    //Validacación username
    const validation = (user) => {
        //vacio, valor numerico, id demasiado largo (>30),
            if(user == ""){
                ToastAndroid.show( "El ID de usuario es obligatorio", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                return false
            }else if(isNaN(user)){
                ToastAndroid.show( "El ID de usuario debe ser un número", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                return false
            }else if(user.length > 30){
                ToastAndroid.show( "El ID de usuario es demasiado largo", ToastAndroid.LONG, ToastAndroid.BOTTOM)
                return false
            }
    
            return true;
            
    }

    const handleClick = async ()  => {
        //setLoader(true)
        var loginData ={id: username, password: password};
        var headers = {'Content-Type': 'application/json'};

        if(validation(username)){
            //Consulta verificación de datos login
            const result = await fetch(STRAVA_URI + 'login', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(loginData)
            });
            const res = await result.json()

            //const resAxios = await axios.post('http://192.168.0.5:5000/login', JSON.stringify(loginData));
            //const resAxios = await axios.post('http://192.168.0.5:5000/login', JSON.stringify(loginData), {headers : headers});
            //const res = await resAxios.json()


            //Validación mensaje            
            switch(res['message']){
                case 0:
                    alert("ID del usuario no valido o no registrado");
                    setLoader(false)
                    break;
                case 1:
                    alert("Contraseña no valida");
                    setLoader(false)
                    break
                case 2:
                    setLoader(false)
                    await AsyncStorage.setItem('username', ''+ username);
                    await AsyncStorage.setItem('password', ''+ password);
                    
                    navigation.replace('TabNavigator', {
                        id: username,
                        refresh_token: password,
                    })
            }
        }

    }


    const forgetPassword = () => {
        setModalVisible(true)
    }

    const connectStrava = () => {
        console.log("Conectando con STRAVA")
        const uri = STRAVA_URI+'strava_authorize';
        Linking.openURL(uri);
        setModalVisible(!modalVisible);
    }

    return (
         //Visualizacion del Login
         <View>
         <KeyboardAvoidingView
                 behavior={Platform.OS === "ios" ? "padding" : "position"}
                 style={styles.containerKeyBoard}
                 keyboardVerticalOffset={1}
             >
         <ScrollView
             showsHorizontalScrollIndicator={false}
             bounces={false}
         >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style = {styles.root}>
                    {/*<Text style = {styles.titleText}> HAPPY MINDER </Text>*/}
                    <Image source = {Logo} style={styles.logo} />
                    <CustomInput placeholder = "ID usuario" value={username} setValue={setUsername} secureTextEntry= {false}/>
                    <CustomInput placeholder = "Refresh token" value={password} setValue={setPassword} secureTextEntry= {true}/>
                    <Pressable onPress={forgetPassword} style={({pressed}) => [{backgroundColor: pressed ? '#FFFFFF' : '#FFFFFF' }, styles.containerForgetPass]}>
                        <Text style= {styles.textForgetPass}>
                            Olvidaste tus datos?
                        </Text>
                    </Pressable>
                    {/*<Loader loading={loader} color="#6CBCF1" />*/}

                    <CustomButton  text = "Ingresar" onPress={handleClick}/>
                </View>
            </TouchableWithoutFeedback>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{fontSize: 24, fontWeight: "bold", textAlign: 'center', color: "#000"}}> Instrucciones{"\n"}</Text>
                            <Text style={styles.modalText}>
                            <Text style={{fontWeight: "bold"}}>1. </Text> Para darnos autorización necesitamos que se conecte a STRAVA con el botón "Connect with STRAVA", que lo redireccionará
                            a la página de STRAVA desde su navegador predeterminado. Se tendrá que autenticar con sus credenciales de STRAVA y saldrá una ventana
                            que le pedirá la autorización de los permisos. {"\n"}{"\n"}
                            <Text style={{fontWeight: "bold"}}>2. </Text> Luego de conceder los permisos, se redireccionará a otra ventana con las credenciales para acceder a la aplicación. Cópielas y péguelas en
                            la aplicación en las casillas correspondientes e ingrese a la aplicación.{"\n"}

                            </Text>
                            <TouchableOpacity
                                style={{alignSelf: 'center'}}
                                onPress={connectStrava}
                            >
                                <Image
                                     source={require('../assets/btn_strava_connectwith_orange.png')}
                                />
                            </TouchableOpacity>
                            
                            {/*<Pressable
                                style={({pressed}) => [{backgroundColor: pressed ? '#FFA680' : '#FC4C02' }, styles.buttonConnectStrava]}
                                onPress={connectStrava}
                            >
                                <Text style={styles.textStyleConnect}> Conectar con Strava </Text>
                            </Pressable>*/}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Loader loading={loader} color="#FC4C02" />
         </ScrollView>
         </KeyboardAvoidingView>
         </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    },
    logo: {
        width: 200,
        height: 200,
        marginTop: 100,
        marginBottom: 50,
        alignSelf: 'center'
    },
    titleText: {
        textAlign: 'center',
        paddingTop: 40,
        fontWeight: "bold",
        fontSize: 40
    },
    containerKeyBoard: {
        width: Dimensions.get('window').width
    },

    containerForgetPass: {
        flexDirection: 'row',
        alignSelf:'baseline',
        justifyContent:'flex-end',
        paddingTop: 5,
        paddingBottom: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 50,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonConnectStrava: {
        borderRadius: 5,
        marginLeft: 10,
        padding: 12,
        elevation: 2,
        borderRadius: 10,
    },
    textStyleConnect: {
        textAlign: 'center',
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 15
    },
    modalText: {
        color: "#000",
        fontSize: 17,
        marginLeft: 10,
        marginBottom: 10,
    },
    textForgetPass: {
        marginLeft: 40,
    }
})

export default LoginScreen;