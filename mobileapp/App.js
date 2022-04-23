import 'react-native-gesture-handler';
import * as React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './src/pages/welcomescreen';
import SplashScreen from './src/pages/splashscreen';
import {navName} from './src/navigation/navigation_name';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar hidden={true} />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={navName.SplashScreen} component={SplashScreen} />
        <Stack.Screen name={navName.WelcomeScreen} component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
