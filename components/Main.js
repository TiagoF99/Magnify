import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
  Button
} from 'react-native'
import firebase from 'react-native-firebase'
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as jpeg from 'jpeg-js'

export default class Main extends React.Component {
  
  state = { currentUser: null, isTfReady: false, isModelReady: false, predictions: null, image: null }
  
  async componentDidMount() {

      // get current user logged in
      const { currentUser } = firebase.auth()
      this.setState({ currentUser })

      // set up tenserflow and mobilenet
      await tf.setBackend('cpu')
      await tf.ready()
      this.setState({isTfReady: true})
    
      this.model = await mobilenet.load()
      this.setState({ isModelReady: true })

      // ask for camera permission
      this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

  imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  classifyImage = async () => {
    try {
      const imageAssetPath = Image.resolveAssetSource(this.state.image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.classify(imageTensor)
      this.setState({ predictions })
      console.log(predictions)
    } catch (error) {
      console.log(error)
    }
  }


  /* 
   - let the image be selected by the user
   - populate the source URI object in the state.image—if the image selection process isn’t canceled
   - invoke classifyImage() method to make predictions from the given input
  */
  selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      })

      if (!response.cancelled) {
        const source = { uri: response.uri }
        this.setState({ image: source })
        this.classifyImage()
      }
    } catch (error) {
      console.log(error)
    }
  }

  signOutUser = async () => {
      try {
          await firebase.auth().signOut()
          this.props.navigation.navigate('Login')
      } catch (e) {
          console.log(e);
      }
  }

  render() {
    const { currentUser, isTfReady, isModelReady, predictions, image } = this.state
 
    return (
          <View style={styles.container}>
            <StatusBar barStyle='light-content' />
            <View style={styles.logoutContainer}>
              <Button style={styles.logout} title="logout" onPress={() => this.signOutUser()} />
            </View>
            <View style={styles.loadingContainer}>
              <Text style={styles.text}>Hi {currentUser && currentUser.email}</Text>
              <Text style={styles.text}>
                Is TFJS ready? {isTfReady ? <Text>Yes</Text> : <Text>No</Text>}
              </Text>
              <Text style={styles.text}>
                Is Model ready? {isModelReady ? (<Text style={styles.text}>Yes</Text>) : (<ActivityIndicator size='small' />)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.imageWrapper}
              onPress={isModelReady ? this.selectImage : undefined}>
              {image && <Image source={image} style={styles.imageContainer} />}

              {isModelReady && !image && (
                <Text style={styles.text}>Tap to choose image</Text>
              )}
            </TouchableOpacity>
            <View style={styles.predictionWrapper}>
              {isModelReady && image && (
                <Text style={styles.text}>
                  Predictions: {predictions ? '' : 'Predicting...'}
                </Text>
              )}
              {isModelReady &&
                predictions &&
                predictions.map(p => this.renderPrediction(p))}
            </View>
          </View>
        )
      }
    }
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#171f24',
        alignItems: 'center'
      },
      loadingContainer: {
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center'
      },
      text: {
        color: '#ffffff',
        fontSize: 16
      },
      loadingModelContainer: {
        flexDirection: 'row',
        marginTop: 10
      },
      logoutContainer: {
        marginTop: 20,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
      },
      logout: {
        borderColor: '#ca867f',
        borderWidth: 3,
        backgroundColor: '#111111'
      },
      imageWrapper: {
        width: 280,
        height: 280,
        padding: 10,
        borderColor: '#ca867f',
        borderWidth: 5,
        borderStyle: 'dashed',
        marginTop: 40,
        marginBottom: 10,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
      },
      imageContainer: {
        width: 250,
        height: 250,
        position: 'absolute',
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
      },
      predictionWrapper: {
        height: 100,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center'
      }
    })
