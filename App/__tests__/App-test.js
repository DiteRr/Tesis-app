/**
 * @format
 */

import 'react-native';

import React, {useState} from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { render, fireEvent, waitfor, waitFor, act} from "@testing-library/react-native"


//Screens
import LoginScreen from '../src/screens/LoginScreen';
import ActivitiesScreen from '../src/screens/ActivitiesScreen';
import RegisterEffortsScreen from '../src/screens/RegisterEffortsScreen';
import RegisterInjuriesScreen from '../src/screens/RegisterInjuriesScreen';
import Statistics from '../src/screens/StatisticsScreen';
import TabNavigator from '../src/screens/TabNavigator'
import Holamundo from '../src/screens/HolaMundo';

//Components
import CustomButton from '../src/components/CustomButton'
import StatisticsScreen from '../src/screens/StatisticsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();
//import fetchMockJest from 'fetch-mock-jest';


//Functions
import {Query} from "../src/utils/Query"
import {AuthStrava} from "../src/utils/AuthStrava"

import { authorize } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FlatList } from 'react-native-gesture-handler';

const navigation = { navigate: jest.fn() };
// El codigo ES6 debe compilarse antes de ejecutarse.
// react-native-reanimated requiere integracion nativa
// smocks -> verficar que se ha relizado alguna accion
// stub -> Asegurarse de que el la funcion de prueba devuelva lo que se espera

let component;
const reactMock = require('react');

//--APP--//

describe("<App />", () => {
  //const setState = jest.fn();
  //const useStateSpy = jest.spyOn(React, 'useState')
  //useStateSpy.mockImplementation((init) => [init, setState]);
  //const setState = jest.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //const useStateMock: any = (initState: any) => [initState, setState];

  beforeEach(() => {
    fetch.resetMocks()
    authorize.mockClear()
    AsyncStorage.clear()
    //useState.mockImplementation(jest.requireActual('react').useState);
  });

  it("Renderiza correctamente", () =>{
    component = render(<App/>);
    expect(component).toBeDefined();
  });

  it("TestID", () =>{
    component = render(<App/>);
    expect(component.getByTestId("Texto.Prob")).toBeDefined()
  });

  it("Datos de usuario NO guardados en memoria", async () =>{
    component = await render(<App/>);
    //expect(setState).toHaveBeenCalledTimes(1);
    //expect(setState).toBeCalledWith(false)
  });
  it("Datos de usuario guardados en memoria", async () =>{
    await AsyncStorage.setItem('username', ''+'9121316')
    await AsyncStorage.setItem('password', ''+'f0addde72af00b6a9c6aeb1671ce4bb4104ac852')
    component = await render(<App/>);
    //expect(setState).toBeCalledWith(true)

  });
});


//--LOGIN SCREEN--//
describe("LoginScreen",  () => {
  component = render(<LoginScreen />);

  beforeEach(() => {
    fetch.resetMocks()
    authorize.mockClear()
    AsyncStorage.clear()
  });
  it("Test ID", async () => {
    const pushMock = jest.fn();
    const paramsWaitFor = {"access_token": "d17236da1c6e02aa93ceee2a7103d5f78596d02f", "id": 91213168, "refresh_token": "f0addde72af00b6a9c6aeb1671ce4bb4104ac852"}
    component = render(<LoginScreen navigation={{ replace: pushMock}}/>);
    //expect(component.getByTestId("ConnectStrava")).toBeDefined()
    //expect(component.getByTestId("Loader.LoginScreen")).toBeDefined()
    //console.log("GETBYTESTID", component.getByTestId())
    expect(component.getByTestId("Text.LoginScreen")).toBeDefined()
    expect(component.getByTestId("ConnectStrava")).toBeDefined()
  })

  it("Autorización aceptada y datos guardados satisfactoriamente", async () => {
    fetch.mockResponseOnce(JSON.stringify({status: '200'}))
    const pushMock = jest.fn();
    const paramsWaitFor = {"access_token": "d17236da1c6e02aa93ceee2a7103d5f78596d02f", "id": 91213168, "refresh_token": "f0addde72af00b6a9c6aeb1671ce4bb4104ac852"}
    component = render(<LoginScreen navigation={{ replace: pushMock}}/>);
    expect(component.getByTestId('ConnectStrava'))
    await act( async () => fireEvent.press(component.getByTestId('ConnectStrava')))

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(pushMock).toBeCalledWith("TabNavigator", paramsWaitFor);

  })
  it("Autorización rechazada", async () => {
    fetch.mockResponseOnce(JSON.stringify({status: '200'}))
    authorize.mockRejectedValueOnce()
    const pushMock = jest.fn();
    const paramsWaitFor = {"access_token": "d17236da1c6e02aa93ceee2a7103d5f78596d02f", "id": 91213168, "refresh_token": "f0addde72af00b6a9c6aeb1671ce4bb4104ac852"}
    component = render(<LoginScreen navigation={{ replace: pushMock}}/>);
      
    await act( async () => fireEvent.press(component.getByTestId('ConnectStrava')))
    
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(pushMock).not.toBeCalledWith("TabNavigator", paramsWaitFor);

  })

  it("Autorización aceptada y datos NO guardados", async () => {
    fetch.mockReject(() => Promise.reject({'status' : 404}))
    const pushMock = jest.fn();

    const paramsWaitFor = {"access_token": "d17236da1c6e02aa93ceee2a7103d5f78596d02f", "id": 91213168, "refresh_token": "f0addde72af00b6a9c6aeb1671ce4bb4104ac852"}
    component = render(<LoginScreen navigation={{ replace: pushMock}}/>);
    
    await act( async () => fireEvent.press(component.getByTestId('ConnectStrava')))
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(pushMock).not.toBeCalledWith("TabNavigator", paramsWaitFor);

  })

  it("Datos guardados en AsyncStorage", async () => {
    fetch.mockResponseOnce(JSON.stringify({status: '200'}))
    authorize.mockRejectedValueOnce()
    const pushMock = jest.fn();
    const paramsWaitFor = {"access_token": "d17236da1c6e02aa93ceee2a7103d5f78596d02f", "id": 91213168, "refresh_token": "f0addde72af00b6a9c6aeb1671ce4bb4104ac852"}
    component = render(<LoginScreen navigation={{ replace: pushMock}}/>);
      
    await act( async () => fireEvent.press(component.getByTestId('ConnectStrava')))

    await AsyncStorage.setItem('expired_at', ''+'1655510240000')
    await AsyncStorage.setItem('username', ''+'9121316')
    await AsyncStorage.setItem('password', ''+'f0addde72af00b6a9c6aeb1671ce4bb4104ac852')
    await AsyncStorage.setItem('access_token', ''+'d17236da1c6e02aa93ceee2a7103d5f78596d02f');

    expect(await AsyncStorage.getItem('username')).toBe('9121316')
  })

})

describe("<ActivitiesScreen />", () => {
  const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852', access_token: 'd17236da1c6e02aa93ceee2a7103d5f78596d02f'}}
  const pushMock = jest.fn();

  beforeEach(() => {
    fetch.resetMocks()
    AsyncStorage.clear()
  });
  
  it("Fetch actividades y actividades registradas guardadas en memoria", async () => {
    fetch.mockResponseOnce(JSON.stringify({"access_token": "7af2bc9baf101ca5b8aeb7756109b29ebdd10dc7", 
    "activities": [{"average_speed": 0.068, "distance": 3.6, "elapsed_time": 129, "elev_high": 7.4, "elev_low": 7.4, "id_actividad": 1, "name": "Carrera nocturna", "start_date": "Sun, 12 Jun 2022 04:54:23 GMT", "start_date_local": "Sun, 12 Jun 2022 00:54:23 GMT", "type": "Run"}, 
    {"average_speed": 2.482, "distance": 136.5, "elapsed_time": 297, "elev_high": 7.6, "elev_low": 7.5, "id_actividad": 2, "name": "Carrera por la tarde", "start_date": "Wed, 15 Jun 2022 21:31:01 GMT", "start_date_local": "Wed, 15 Jun 2022 17:31:01 GMT", "type": "Run"}, 
    {"average_speed": 3.53, "distance": 3.5, "elapsed_time": 24, "elev_high": 7.6, "elev_low": 7.4, "id_actividad": 3, "name": "Carrera vespertina", "start_date": "Fri, 17 Jun 2022 00:52:31 GMT", "start_date_local": "Thu, 16 Jun 2022 20:52:31 GMT", "type": "Run"}, 
    {"average_speed": 4.248, "distance": 352.6, "elapsed_time": 208, "elev_high": 8, "elev_low": 7.4, "id_actividad": 4, "name": "Carrera vespertina", "start_date": "Sat, 18 Jun 2022 22:38:34 GMT", "start_date_local": "Sat, 18 Jun 2022 18:38:34 GMT", "type": "Run"}], 
    "expired_at": 1655613697}))
    
    await AsyncStorage.setItem('length', '3')
    await AsyncStorage.setItem('0', '6')
    await AsyncStorage.setItem('1', '7')
    await AsyncStorage.setItem('2', '8')
    component = render(<ActivitiesScreen route={route} navigation={{ replace: pushMock}}/>);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(component.getByTestId('Progress.Activity')).toBeDefined()

  })
  
  it("Fetch actividades y actividades no guardadas en memoria", async () => {

    fetch.mockResponseOnce(JSON.stringify({"access_token": "7af2bc9baf101ca5b8aeb7756109b29ebdd10dc7", 
    "activities": [{"average_speed": 0.068, "distance": 3.6, "elapsed_time": 129, "elev_high": 7.4, "elev_low": 7.4, "id_actividad": 1, "name": "Carrera nocturna", "start_date": "Sun, 12 Jun 2022 04:54:23 GMT", "start_date_local": "Sun, 12 Jun 2022 00:54:23 GMT", "type": "Run"}, 
    {"average_speed": 2.482, "distance": 136.5, "elapsed_time": 297, "elev_high": 7.6, "elev_low": 7.5, "id_actividad": 2, "name": "Carrera por la tarde", "start_date": "Wed, 15 Jun 2022 21:31:01 GMT", "start_date_local": "Wed, 15 Jun 2022 17:31:01 GMT", "type": "Run"}, 
    {"average_speed": 3.53, "distance": 3.5, "elapsed_time": 24, "elev_high": 7.6, "elev_low": 7.4, "id_actividad": 3, "name": "Carrera vespertina", "start_date": "Fri, 17 Jun 2022 00:52:31 GMT", "start_date_local": "Thu, 16 Jun 2022 20:52:31 GMT", "type": "Run"}, 
    {"average_speed": 4.248, "distance": 352.6, "elapsed_time": 208, "elev_high": 8, "elev_low": 7.4, "id_actividad": 4, "name": "Carrera vespertina", "start_date": "Sat, 18 Jun 2022 22:38:34 GMT", "start_date_local": "Sat, 18 Jun 2022 18:38:34 GMT", "type": "Run"}], 
    "expired_at": 1655613697}))

    fetch.mockResponseOnce(JSON.stringify({"data" : [{"id_activity" : "6"}, {"id_activity" : "7"}, {"id_activity" : "8"}]}))

    component = render(<ActivitiesScreen route={route} navigation={{ replace: pushMock}}/>);
    
    expect(fetch).toHaveBeenCalledTimes(1); //Deberia llamar 2 veces?????????????????????
    expect(component.getByTestId('Progress.Activity')).toBeDefined()

  });

  it("Clickear una actividad y Pasar los parametros correspodientes a la otra pantalla", async () => {

    await AsyncStorage.setItem('length', '3')
    await AsyncStorage.setItem('0', '6')
    await AsyncStorage.setItem('1', '7')
    await AsyncStorage.setItem('2', '8')

    const activities = [{"average_speed": 0.068, "distance": 3.6, "elapsed_time": 129, "elev_high": 7.4, "elev_low": 7.4, "id_actividad": 1, "name": "Carrera nocturna", "start_date": "Sun, 12 Jun 2022 04:54:23 GMT", "start_date_local": "Sun, 12 Jun 2022 00:54:23 GMT", "type": "Run"}, 
    {"average_speed": 2.482, "distance": 136.5, "elapsed_time": 297, "elev_high": 7.6, "elev_low": 7.5, "id_actividad": 2, "name": "Carrera por la tarde", "start_date": "Wed, 15 Jun 2022 21:31:01 GMT", "start_date_local": "Wed, 15 Jun 2022 17:31:01 GMT", "type": "Run"}, 
    {"average_speed": 3.53, "distance": 3.5, "elapsed_time": 24, "elev_high": 7.6, "elev_low": 7.4, "id_actividad": 3, "name": "Carrera vespertina", "start_date": "Fri, 17 Jun 2022 00:52:31 GMT", "start_date_local": "Thu, 16 Jun 2022 20:52:31 GMT", "type": "Run"}, 
    {"average_speed": 4.248, "distance": 352.6, "elapsed_time": 208, "elev_high": 8, "elev_low": 7.4, "id_actividad": 4, "name": "Carrera vespertina", "start_date": "Sat, 18 Jun 2022 22:38:34 GMT", "start_date_local": "Sat, 18 Jun 2022 18:38:34 GMT", "type": "Run"}]

    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, () => null]).mockImplementationOnce(() => [activities, () => null]).mockImplementation((x) => [x, () => null]); // ensures that the rest are unaffected


    component = render(<ActivitiesScreen route={route} navigation={{ navigate: pushMock}}/>);

    expect(component.getByTestId("Text.Activity")).toBeDefined();
    expect(component.getByTestId("activity-row-1")).toBeDefined();

    await act( async () => fireEvent.press(component.getByTestId("activity-row-1")))
    
    const paramsWaitFor2 = { data_actividad : {"average_speed": 0.068, "distance": 3.6, "elapsed_time": 129, "elev_high": 7.4, "elev_low": 7.4, "id_actividad": 1, "name": "Carrera nocturna", 
    "start_date": "Sun, 12 Jun 2022 04:54:23 GMT", "start_date_local": "Sun, 12 Jun 2022 00:54:23 GMT", "type": "Run"}, id_user : "91213168", refresh_token: "f0addde72af00b6a9c6aeb1671ce4bb4104ac852"}

    expect(pushMock).toBeCalledWith("RegisterEffortsScreen", paramsWaitFor2);
  })

afterEach(() => {    
  jest.clearAllMocks();
});

});

describe("<TabNavigator />", () => {
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852', access_token: 'd17236da1c6e02aa93ceee2a7103d5f78596d02f'} }
    const navigate = jest.fn();
    const comp = ( 
      <NavigationContainer> 
        <TabNavigator route= {route} navigation={{ navigate }}/>  
      </NavigationContainer>
      )
    component = render(comp)
    expect(component).toBeDefined();
  });
});

describe("<StatisticsScreen />", () => {
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852', access_token: 'd17236da1c6e02aa93ceee2a7103d5f78596d02f'}}
    const navigate = jest.fn();
    const comp = ( 
    <NavigationContainer> 
      <StatisticsScreen route= {route} navigation={{ navigate }}/>  
    </NavigationContainer>
    )
    component = render(comp);
    expect(component).toBeDefined();
  });
});


describe("<RegisterEffortsScreen />", () => {
  const route = { params: { data_actividad : {"average_speed": 0.068, "distance": 3.6, "elapsed_time": 129, "elev_high": 7.4, "elev_low": 7.4, "id_actividad": 1, "name": "Carrera nocturna", 
  "start_date": "Sun, 12 Jun 2022 04:54:23 GMT", "start_date_local": "Sun, 12 Jun 2022 00:54:23 GMT", "type": "Run"}, 
  id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852', access_token: 'd17236da1c6e02aa93ceee2a7103d5f78596d02f'}}
  
  const pregs = [{"id_pregunta": 11, "pregunta": "¿Cómo calificaría el nivel de esfuerzo para completar el entrenamiento?", "tipo_cuestionario": "pep", "tipo_preg": "negativa", "tipo_respuesta": "slider", "valueStringMax": "Extremadamente duro", "valueStringMin": "Extremadamente ligero"}, 
    {"id_pregunta": 12, "pregunta": "¿Cómo calificaría su calidad de sueño la noche anterior al entrenamiento?", "tipo_cuestionario": "pep", "tipo_preg": "negativa", "tipo_respuesta": "slider", "valueStringMax": "Bastante mala", "valueStringMin": "Bastante buena"}, 
    {"id_pregunta": 13, "pregunta": "¿Como calificaria su motivación durante el entrenamiento?", "tipo_cuestionario": "pep", "tipo_preg": "positiva", "tipo_respuesta": "slider", "valueStringMax": "Muy motivado", "valueStringMin": "Nada motivado"}, 
    {"id_pregunta": 14, "pregunta": "¿Cómo calificaría su estrés durante el entrenamiento?", "tipo_cuestionario": "pep", "tipo_preg": "negativa", "tipo_respuesta": "slider", "valueStringMax": "Muy estresado", "valueStringMin": "Nada de estresado"}, 
    {"id_pregunta": 15, "pregunta": "¿Cómo calificaría su ánimo durante el entrenamiento?", "tipo_cuestionario": "pep", "tipo_preg": "positiva", "tipo_respuesta": "slider", "valueStringMax": "Muy animado", "valueStringMin": "Muy desanimado"}, 
    {"id_pregunta": 16, "pregunta": "¿Cómo calificaría su fatiga en general?", "tipo_cuestionario": "pep", "tipo_preg": "negativa", "tipo_respuesta": "slider", "valueStringMax": "Muy fatigado", "valueStringMin": "Nada de fatigado"}]

  const respuestas = [{"id_preg": 11, "respuesta": "0"}, {"id_preg": 12, "respuesta": "0"}, {"id_preg": 13, "respuesta": "0"}, 
    {"id_preg": 14, "respuesta": "0"}, {"id_preg": 15, "respuesta": "0"}, {"id_preg": 16, "respuesta": "0"}]
  
  const pushMock = jest.fn();
  const pushMockReset = jest.fn();

  beforeEach(() => {
    fetch.resetMocks()
    AsyncStorage.clear()
  });

  it("Recibe las pregunta de la base de datos", () =>{
    //const tree = renderer.create(<StatisticsScreen route= {route} navigation={{ navigate }} />).toJSON();
    component = render(<RegisterEffortsScreen route= {route}  navigation={{navigate : pushMock, reset: pushMock}}/>);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(component.getByTestId('Progress.RegisterEfforts')).toBeDefined()
  });
  it("Rederiza las preguntas en la interfaz", () =>{

    fetch.mockResponseOnce(JSON.stringify(pregs))
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, () => null]).mockImplementationOnce(() => [pregs, () => null]).mockImplementationOnce(() => [respuestas, () => null]).mockImplementation((x) => [x, () => null]); // ensures that the rest are unaffected
    
    component = render(<RegisterEffortsScreen route= {route}  navigation={{navigate : pushMock, reset: pushMock}}/>);

    expect(component.getByTestId('Text.RegisterEfforts')).toBeDefined()
    expect(component.getByTestId('SaveData.Button')).toBeDefined()
  });

  it("Registrar preguntas de lesión (CheckInjury=true)", async () =>{

    //fetch.mockResponseOnce(JSON.stringify(pregs))
    jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, () => null])
    .mockImplementationOnce(() => [pregs, () => null])
    .mockImplementationOnce(() => [respuestas, () => null])
    .mockImplementationOnce(() => [true, () => null])
    .mockImplementation((x) => [x, () => null]); // ensures that the rest are unaffected
    
    component = render(<RegisterEffortsScreen route= {route}  navigation={{navigate : pushMock, reset: pushMock}}/>);

    fireEvent.press(component.getByTestId("SaveData.Button"))

    expect(fetch).toHaveBeenCalledTimes(1); //Preguntas
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it("Guardar datos(CheckInjury es false)", async () =>{

    fetch.mockResponseOnce(JSON.stringify(pregs))
    fetch.mockResponseOnce(JSON.stringify({'status' : 200}))
    jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, () => null])
    .mockImplementationOnce(() => [pregs, () => null])
    .mockImplementationOnce(() => [respuestas, () => null])
    .mockImplementationOnce(() => [false, () => null])
    .mockImplementation((x) => [x, () => null]); // ensures that the rest are unaffected
    
    component = render(<RegisterEffortsScreen route= {route}  navigation={{navigate : pushMock, reset: pushMockReset}}/>);

    await act( async () => fireEvent.press(component.getByTestId("SaveData.Button")))

    expect(fetch).toHaveBeenCalledTimes(2); //Preguntas + Registrar respuestas
    expect(pushMockReset).toHaveBeenCalledTimes(1);
  });

afterEach(() => {    
  jest.clearAllMocks();
});

});


describe("<RegisterInjuriesScreen />", () => {
  const route = { params: { dataEP : [{"id_preg": 1, "respuesta": "0"}, {"id_preg": 2, "respuesta": "0"}, {"id_preg": 3, "respuesta": "0"}, {"id_preg": 4, "respuesta": "0"}, {"id_preg": 5, "respuesta": "0"}, {"id_preg": 6, "respuesta": "0"}],
   data_actividad : {"average_speed": 0.068, "distance": 3.6, "elapsed_time": 129, "elev_high": 7.4, "elev_low": 7.4, "id_actividad": 1, "name": "Carrera nocturna", 
  "start_date": "Sun, 12 Jun 2022 04:54:23 GMT", "start_date_local": "Sun, 12 Jun 2022 00:54:23 GMT", "type": "Run"}, 
  id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852', access_token: 'd17236da1c6e02aa93ceee2a7103d5f78596d02f'}}

  const pregs = [{"alternativas": [1,2,3], "id_pregunta": 17, "pregunta": "¿Cómo se produjo su lesión?", "tipo_respuesta": "dropdown"}, 
  {"alternativas": [1,2,3], "id_pregunta": 18, "pregunta": "¿Cómo fue el inicio de su lesión?", "tipo_respuesta": "dropdown"}, 
  {"alternativas": [1,2,3], "id_pregunta": 19, "pregunta": "Si el inicio de su lesión fue súbidto, ¿Cuál fue el mecanismo de su lesión?", "tipo_respuesta": "dropdown"}, 
  {"alternativas": [1,2,3], "id_pregunta": 20, "pregunta": "¿En qué parte del cuerpo fue su lesión?", "tipo_respuesta": "dropdown"}, 
  {"alternativas": [1,2,3,4], "id_pregunta": 21, "pregunta": "¿En qué tejido fue su lesión?", "tipo_respuesta": "dropdown"}]

  const respuestas = [{"id_preg": 17, "respuesta": "0"}, {"id_preg": 18, "respuesta": "0"}, {"id_preg": 19, "respuesta": "0"}, 
    {"id_preg": 20, "respuesta": "0"}, {"id_preg": 21, "respuesta": "0"}, {"id_preg": 22, "respuesta": "0"}]

  const pushMockReset = jest.fn();

  beforeEach(() => {
    fetch.resetMocks()
    AsyncStorage.clear()
  });

  it("Renderiza correctamente", () =>{
    component = render(<RegisterInjuriesScreen route= {route} navigation={{reset: pushMockReset}}  />);
    expect(component).toBeDefined();
  });

  it("Renderiza correctamente", async () =>{
    let prega = [{"alternativas": [1,2,3], "id_pregunta": 17, "pregunta": "¿Cómo se produjo su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3], "id_pregunta": 18, "pregunta": "¿Cómo fue el inicio de su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3], "id_pregunta": 19, "pregunta": "Si el inicio de su lesión fue súbidto, ¿Cuál fue el mecanismo de su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3], "id_pregunta": 20, "pregunta": "¿En qué parte del cuerpo fue su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3,4], "id_pregunta": 21, "pregunta": "¿En qué tejido fue su lesión?", "tipo_respuesta": "dropdown"}]

    fetch.mockResponseOnce(JSON.stringify(pregs))
    jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, () => null])
    .mockImplementationOnce(() => [prega, () => null])
    .mockImplementationOnce(() => [respuestas, () => null])
    .mockImplementation((x) => [x, () => null]); // ensures that the rest are unaffected

    component = render(<RegisterInjuriesScreen route= {route} navigation={{reset: pushMockReset}}  />);
    
    expect(component).toBeDefined();
    expect(component.getByTestId('Text.RegisterInjuries')).toBeDefined()
    expect(component.getByTestId('SaveData.Button')).toBeDefined()

  });
  it("Guardar datos", async () =>{
    let prega = [{"alternativas": [1,2,3], "id_pregunta": 17, "pregunta": "¿Cómo se produjo su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3], "id_pregunta": 18, "pregunta": "¿Cómo fue el inicio de su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3], "id_pregunta": 19, "pregunta": "Si el inicio de su lesión fue súbidto, ¿Cuál fue el mecanismo de su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3], "id_pregunta": 20, "pregunta": "¿En qué parte del cuerpo fue su lesión?", "tipo_respuesta": "dropdown"}, 
      {"alternativas": [1,2,3,4], "id_pregunta": 21, "pregunta": "¿En qué tejido fue su lesión?", "tipo_respuesta": "dropdown"}]

    fetch.mockResponseOnce(JSON.stringify(pregs))
    fetch.mockResponseOnce(JSON.stringify({'status' : 200}))
    jest.spyOn(React, 'useState')
    .mockImplementationOnce(() => [false, () => null])
    .mockImplementationOnce(() => [prega, () => null])
    .mockImplementationOnce(() => [respuestas, () => null])
    .mockImplementation((x) => [x, () => null]); // ensures that the rest are unaffected

    component = render(<RegisterInjuriesScreen route= {route} navigation={{reset: pushMockReset}}  />);

    await act( async () => fireEvent.press(component.getByTestId("SaveData.Button")))
    expect(fetch).toHaveBeenCalledTimes(2); //Preguntas + Registrar respuestas
    expect(pushMockReset).toHaveBeenCalledTimes(1);


  });
});