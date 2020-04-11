import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

// import the different screens
import Loading from './components/Loading'
import SignUp from './components/SignUp'
import Login from './components/Login'
import Main from './components/Main'
// create our app's navigation stack
const App = createSwitchNavigator({
  Loading: Loading,
  SignUp: SignUp,
  Login: Login,
  Main: Main
  },
  {
    initialRouteName: 'Loading',
  }
);
export default createAppContainer(App)