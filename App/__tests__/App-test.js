/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { render, fireEvent, waitfor, waitFor } from "@testing-library/react-native"


//Screens
import LoginScreen from '../src/screens/LoginScreen';
import ActivitiesScreen from '../src/screens/LoginScreen';
import RegisterEffortsScreen from '../src/screens/RegisterEffortsScreen';
import RegisterInjuriesScreen from '../src/screens/RegisterInjuriesScreen';
import Statistics from '../src/screens/StatisticsScreen';
import TabNavigator2 from '../src/screens/TabNavigator'

//Components
import CustomButton from '../src/components/CustomButton'
import StatisticsScreen from '../src/screens/StatisticsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import fetchMockJest from 'fetch-mock-jest';


//Functions
import {Query} from "../src/utils/Query"
import {AuthStrava} from "../src/utils/AuthStrava"


const navigation = { navigate: jest.fn() };
// El codigo ES6 debe compilarse antes de ejecutarse.
// react-native-reanimated requiere integracion nativa
// smocks -> verficar que se ha relizado alguna accion
// stub -> Asegurarse de que el la funcion de prueba devuelva lo que se espera

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock('@miblanchard/react-native-slider');
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

var mockAuthorize = () => new AuthStrava()

jest.mock('react-native-app-auth', () => ({
  authorize: mockAuthorize,
}));

console.log("mockAuthorize", mockAuthorize)

let component;

/*
describe("<App />", () => {
  component = render(<App/>);

  it("Renderiza correctamente", () =>{
    expect(component).toBeDefined();
  });
});
*/

describe("<LoginScreen />", () => {
  //component = render(<LoginScreen />);
  //Setting up fetch mock before execution of any test
  /*beforeAll(() => {
    const endPoint `${API_URL}${LOGIN_ENDPOINT}`;
    fetchMock.post(endPoint, {
      status: 200,
      body: JSON.stringify(LOGIN_EXPECTED_RESPONSE);
    })
  })*/
  global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({'status': 200}),
      })
  );

  mockAuthorize = jest.fn(() => 
      Promise.resolve({
        json: () => Promise.resolve({'status': 200}),
      })
  )

  beforeEach(() => {
    fetch.mockClear();
    mockAuthorize.mockClear();
  });


  it("Autorización aceptada", async () => {
    const res= await mockAuthorize();
    expect(res).toEqual({'status': 200});
  })

  it("Autorización rechazada", async () => {
    const res= await mockAuthorize();
    expect(res).toEqual({'status': 200});
  })

  it("Guardar datos", async () =>{
    const res= await Query('save_user', {'id' : '1231231', 'user' : 'spacheco'});
    expect(res).toEqual({'status': 200});
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("Error guardar datos", async () => {
    //allows us to override the default mock behaviour just for this one test
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));
    const res= await Query('save_user', {'id' : '1231231', 'user' : 'spacheco'});
    expect(res).toEqual({'status': 404})

  })
});

/*
describe("<ActivitiesScreen />", () => {;
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852'}}
    const navigate = jest.fn();
    component = render(<ActivitiesScreen route= {route} navigation={{ navigate }}  />);
    expect(component).toBeDefined();
  });
});


describe("<TabNavigator />", () => {
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852'} }
    const navigate = jest.fn();
    const comp = ( 
      <NavigationContainer> 
        <TabNavigator2 route= {route} navigation={{ navigate }}/>  
      </NavigationContainer>
      )
    component = render(comp)
    expect(component).toBeDefined();
  });
});

describe("<StatisticsScreen />", () => {
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852'}}
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
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852'} }
    const navigate = jest.fn();
    //const tree = renderer.create(<StatisticsScreen route= {route} navigation={{ navigate }} />).toJSON();
    component = render(<RegisterEffortsScreen route= {route} navigation={{ navigate }}  />);
    expect(component).toBeDefined();
  });
});

describe("<RegisterInjuriesScreen />", () => {
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852'} }
    const navigate = jest.fn();
    component = render(<RegisterInjuriesScreen route= {route} navigation={{ navigate }}  />);
    expect(component).toBeDefined();
  });
});
*/