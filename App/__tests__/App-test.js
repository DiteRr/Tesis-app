/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { render } from "@testing-library/react-native"


//Screens
import LoginScreen2 from '../src/screens/LoginScreen2';
import ActivitiesScreen from '../src/screens/LoginScreen2';
import RegisterEffortsScreen from '../src/screens/RegisterEffortsScreen';
import RegisterInjuriesScreen from '../src/screens/RegisterInjuriesScreen';
import Statistics from '../src/screens/StatisticsScreen';
import TabNavigator2 from '../src/screens/TabNavigator'

//Components
import CustomButton from '../src/components/CustomButton'
import StatisticsScreen from '../src/screens/StatisticsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";


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

let component;

describe("<App />", () => {
  component = render(<App/>);

  it("Renderiza correctamente", () =>{
    expect(component).toBeDefined();
  });
});


describe("<LoginScreen2 />", () => {
  component = render(<LoginScreen2 />);

  it("Renderiza correctamente", () =>{
    expect(component).toBeDefined();
  });
});


describe("<ActivitiesScreen />", () => {;
  it("Renderiza correctamente", () =>{
    const route = { params: { id : '91213168', refresh_token: 'f0addde72af00b6a9c6aeb1671ce4bb4104ac852'}}
    const navigate = jest.fn();
    omponent = render(<ActivitiesScreen route= {route} navigation={{ navigate }}  />);
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