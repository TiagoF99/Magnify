import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
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
        <Text>Login</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <View style={{ flexDirection: 'row' }}>
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
  textInput: {
    height: 40,
    width: '90%',
    borderColor: '#ca867f',
    borderWidth: 2,
    borderRadius: 2,
    marginTop: 8
  },
  buttoncontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ca867f',
    borderRadius: 2,
    width: 80,
    height: 30
  },
  buttontext: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "serif"
  }
})