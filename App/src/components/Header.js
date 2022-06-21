
import { Platform, StyleSheet, Text, View, Modal, Button} from 'react-native'
import React , {useState} from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import OptionsMenu from "react-native-option-menu";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationHelpersContext } from '@react-navigation/native';
import PushNotification from "react-native-push-notification";
import TimePickerAndroid from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Header({title, navigation}) {
  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);

  const onChange = (event, selectedDate)  =>{
    if(event.type == "set"){
      console.log(selectedDate)
      const currentDate = selectedDate || date
      let tempDate = new Date(currentDate)
      setDate(tempDate)
      let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes ' + tempDate.getMinutes();
      console.log(fTime)

      setShow(false)
      notifications(tempDate.getMinutes(), tempDate.getHours())
    }else{
      setShow(false) 
    }
  }

  const openMenu = () => {
      console.log("Abriendo menu")
  }


  const modalNotification = () => {
    setShow(true)
    console.log("modalNotification")
  }


  const notifications = (mins, hours) => {
    const d = new Date()

    const minute = mins * 60 * 1000;
    const hour = hours * 3600 * 1000;
    const time = minute + hour
    const todayTime= new Date(Date.now()) //Hora UTC actual
    const todayChileUTC= new Date(d.getFullYear(), d.getMonth(), d.getDate()) //Hora UTC 04:00

    const oneday = 24*60*60*1000
    //console.log(new Date(todayTime.getTime()), new Date(todayChileUTC.getTime() + time))
    //console.log(todayTime.getTime() - todayChileUTC.getTime() - time)
    //console.log(todayTime.getTime(), todayChileUTC.getTime(), time)
    if(todayTime.getTime() - (todayChileUTC.getTime() + time) > 0){
      var alarm = new Date(todayChileUTC.getTime() + time + oneday)
      //console.log(alarm)
    }else{
      var alarm = new Date(todayChileUTC.getTime() + time)
    }
    //console.log(alarm)



    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      message: "¡Registra el esfuerzo percibido de tus actividades!", // (required)
      date: alarm, // Hora de la alarma.
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    
      /* Android Only Properties */
      repeatType: 'day',
      //repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      channelId: "1"
    });
    setModalVisible(true)
    console.log("notificaciones")
  }

  const signOut = async () => {
      console.log("cerrar sesion")
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');
      navigation.replace("Login")

  }


  return (
    <View style={styles.header}>
        <View>
        <Text style={styles.headerText}>{title}</Text>
        </View>
        <OptionsMenu
            style={styles.icon}
            customButton={(<FontAwesome name="gear" color="rgba(255, 255, 255, .9)" size={26}/>)}
            destructiveIndex={1}
            options={["Notificación recordatorio", "Cerrar sesión", 'Cancelar']}
            actions={[modalNotification, signOut]}/>
        { show ? (
            <TimePickerAndroid
              style= {{ backgroundColor : "white"}}
              testID='dateTimePicker'
              value= {date}
              mode= 'time'
              is24Hour = {true}
              //display = 'clock'
              textColor="white"
              backgroundColor = "#FC4C02"
              onChange={onChange}
            >
            </TimePickerAndroid>
            
        ): null}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
              setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Ionicons style={{alignSelf : "center"}} name="alarm" color="rgba(255, 79, 1, .9)" size={60} />
            <Text style={{fontSize : 20, color : "#000", textAlign: 'center', lineHeight: 30}}> Notificación recordatorio {"\n"}
            
            <Text style={{fontWeight: "bold"}}>
              {date.getHours()< 10 ? '0'+date.getHours(): date.getHours()}:
              {date.getMinutes() < 10 ? '0'+ date.getMinutes():date.getMinutes()}{"\n"}
            </Text>
              ¡Todos los días! {"\n"}
            </Text>        
            <Button style={{marginTop : 10, borderRadius: 20}} title="Aceptar" color="#FC4C02" onPress={() => setModalVisible(!modalVisible)}></Button>
            </View>
          </View>
        </Modal>
    </View>

  )
}

const styles = StyleSheet.create({
    header: {
      width: '97%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: '#fff',
      letterSpacing: 0,
    },
    icon: {
      flexDirection: 'row-reverse',
      marginRight: 30,
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
  });
