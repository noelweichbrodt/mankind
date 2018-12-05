import React, { Component } from 'react'
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native'
import {name as appName} from './app.json'
import Spokestack from 'react-native-spokestack'
// import GoogleCredentials from './google-key.json'
import GoogleAPIKey from './google-api-key.json'

export default class Mankind extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'waiting',
      results: [],
      final_results: ''
    }
  }

  onResultsChange (r) {
    this.setState({ results: r })
  }

  onRecognitionDone () {
    if (this.state.results && this.state.results[0]) {
      this.setState({ final_results: this.state.results[0].toString() })
    }
  }

  onStatusChange (s) {
    this.setState({ status: s })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          In 1998...
        </Text>
        <RNSpokestackButton
          statusChange={(status) => this.onStatusChange(status)}
          resultsChange={(results) => this.onResultsChange(results)}
        />
        <Text style={styles.stat}>
          {`Status: ${this.state.status}`}
        </Text>
        {this.state.results.map((result, index) => {
          return (
            <Text key={`result-${index}`} style={styles.stat}>
              {index + 1}: {result}
            </Text>
          )
        })}
      </View>
    )
  }
}

class RNSpokestackButton extends Component {
  constructor (props) {
    super(props)
    this.activtyTimer = null
    this.activityTimeout = 10000
    Spokestack.onSpeechStarted = this.onSpeechStart.bind(this)
    Spokestack.onSpeechEnded = this.onSpeechEnd.bind(this)
    Spokestack.onSpeechRecognized = this.onSpeechRecognized.bind(this)
    Spokestack.onError = this.onSpeechError.bind(this)
  }

  componentDidMount () {
  }

  onStart () {
    // console.log("GoogleAPIKey " + JSON.parse(GoogleAPIKey))
    this.activtyTimer = setTimeout(() => this.onActivityTimeout(), this.activityTimeout)

    Spokestack.initialize({
      'input': 'com.pylon.spokestack.android.MicrophoneInput',
      'stages': [
        'com.pylon.spokestack.libfvad.VADTrigger',
        'com.pylon.spokestack.google.GoogleSpeechRecognizer'
      ],
      'properties': {
        // 'vad-mode': 'aggressive'
        // 'google-credentials': JSON.stringify(GoogleCredentials),
        'google-api-key': JSON.parse(GoogleAPIKey).google_api_key,
        // JSON.parse(GoogleAPIKey).google_api_key,
        'locale': 'en-US',
        'sample-rate': 16000,
        'frame-width': 20,
        'buffer-width': 20
        //        'vad-rise-delay': 30,
        //        'vad-fall-delay': 40
      }
    })

    Spokestack.start()
  }

  onStop () {
    Spokestack.stop()
    console.log('Mankind told RNSpokestack to stop')
  }

  onStatusChange (s) {
    this.props.statusChange(s)
  }

  onResultsChange (r) {
    this.props.resultsChange(r)
  }

  onActivityTimeout () {
    console.log('Mankind activity timeout')
    this.onStop()
  }

  onSpeechStart (e) {
    this.onStatusChange('started')
    this.onResultsChange([])
    console.log('spokestack speech started')
  }
  onSpeechRecognized (e) {
    this.onResultsChange(e.transcript)
    console.log('results: ' + e.transcript)
  }
  onSpeechEnd (e) {
    this.onStatusChange('ended')
    console.log('spokestack speech ended')
  }
  onSpeechError (e) {
    this.onStatusChange('error' + e.error)
    console.log('error: ' + e.errort)
  }

  render () {
    return (
      <Button title='Spoke!' onPress={() => this.onStart()} accessibilityLabel='Spake to me' />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1
  }
})

AppRegistry.registerComponent(appName, () => Mankind)
