/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import IotSdk from 'tencent-iot-js-sdk'
import envDetect from 'tencent-iot-js-sdk/src/env_detect'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
  'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    testIotSdk()
    return (
      <View style={styles.container}>
  <Text style={styles.welcome}>Welcome to React Native!</Text>
    <Text style={styles.instructions}>To get started, edit App.js</Text>
    <Text style={styles.instructions}>{instructions}</Text>
    </View>
  );
  }
}

function testIotSdk() {
  const MyWebSocket = IotSdk.MyWebSocket
  const ws = new MyWebSocket('wss://echo.websocket.org/');

  let sendData;
  let isOpen = false;
  let isOnmessage = false;
  let isError = false;

  console.log('MyWebSocket', ws)
  ws.onopen = function open() {
    console.log('connected')
    isOpen = true;
    sendData = String(Date.now())
    ws.send(sendData);
  };
}

function testEnvDetect() {
  console.log('envDetect.isMiniProgram', envDetect.isMiniProgram);
  console.log('envDetect.isBrowser', envDetect.isBrowser);
  console.log('envDetect.isNode', envDetect.isNode);
  console.log('envDetect.isRN', envDetect.isRN)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
