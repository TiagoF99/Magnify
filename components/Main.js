import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import firebase from 'react-native-firebase'
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

export default class Main extends React.Component {
  state = { currentUser: null, isTfReady: false, isModelReady: false }
  
  async componentDidMount() {

      const { currentUser } = firebase.auth()
      this.setState({ currentUser })

      await tf.setBackend('cpu')
      await tf.ready()
      this.setState({
        isTfReady: true
      })
      this.model = await mobilenet.load()
      this.setState({ isModelReady: true })

  }

  render() {
    const { currentUser } = this.state
    return (
          <View style={styles.container}>
            <Text>
              Hi {currentUser && currentUser.email}!
            </Text>
            <Text>
              TFJS ready? {this.state.isTfReady ? <Text>Yes</Text> : ''}
            </Text>
            <View style={styles.loadingModelContainer}>
              <Text style={styles.text}>Model ready? </Text>
              {isModelReady ? (
                <Text style={styles.text}>Yes</Text>
              ) : (
                <ActivityIndicator size='small' />
              )}
            </View>
          </View>
        )
      }
    }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
      loadingModelContainer: {
        flexDirection: 'row',
        marginTop: 10
      }
    })
