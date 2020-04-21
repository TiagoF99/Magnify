import React from 'react'
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native'
import firebase from 'react-native-firebase'


export default class Login extends React.Component {

  state = { email: '', password: '', errorMessage: null }

  handleLogin = () => {
    const { email, password } = this.state
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }))
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Magnify</Text>
        <Text style={styles.logintext}>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor = "#ffffff"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor = "#ffffff"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <View style={{ flexDirection: 'row', marginTop: 30 }}>
          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <View style={styles.buttoncontainer}>
              <Text style={styles.buttontext}>Login</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('SignUp')}>
            <View style={styles.buttoncontainer}>
              <Text style={styles.buttontext}>Signup</Text>
            </View>
          </TouchableOpacity>
        </View>
  
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171f24'
  },
  title: {
    color: '#ffffff',
    fontSize: 50,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 50
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: '#ca867f',
    borderWidth: 2,
    borderRadius: 2,
    marginTop: 8,
    color: 'white'
  },
  logintext: {
    color: "#ffffff", 
    fontSize:20, 
    fontFamily: 'roboto', 
    fontWeight: 'bold'
  },
  buttoncontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ca867f',
    borderRadius: 2,
    width: '42.5%',
    marginLeft: '2.5%',
    marginRight: '2.5%',
    height: 30
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif"
  }
})