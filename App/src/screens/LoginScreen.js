import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View, Image,  ToastAndroid, Pressable, Modal, TouchableOpacity, Linking,
        KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView, Dimensions, ImageBackground, Button} from 'react-native'

import Loader from "react-native-modal-loader";

//import AwesomeAlert from 'react-native-awesome-alerts';
//import Loader from "react-native-modal-loader";

//Componentes customizados
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
//import WavyBackground from "react-native-wavy-background";

//Imagenes
import Logo from '../assets/logo.png'


var IP = "http://146.83.216.251:5000"; 

function LoginScreen({navigation}) {
    const [username, setUsername] = useState('91213168');
    const [password, setPassword] = useState('f0addde72af00b6a9c6aeb1671ce4bb4104ac852');
    const [showAlert, setShowAlert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    //Validcación username
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
            const result = await fetch(IP.concat('/login'), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(loginData)
            });
            const res = await result.json()
            console.log(res)

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
                    navigation.navigate('TabNavigator', {
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
        console.log("conectar con strava")
        const uri = IP.concat('/strava_authorize');
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
                    <Pressable onPress={forgetPassword} style={({pressed}) => [{backgroundColor: pressed ? '#9b9b9b' : '#FFFFFF' }, styles.containerForgetPass]}>
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
                            <Text style={styles.modalText}>Instrucciones:</Text>
                            <TouchableOpacity
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
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 300,
    }
})

export default LoginScreen;