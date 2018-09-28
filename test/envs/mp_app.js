const IotSdk = require('./utils/iot-js-sdk/iot_sdk.miniprogram.js')

//app.js
App({
  onLaunch: function () {
    testIotJsSdk()
  },
  globalData: {
    userInfo: null
  }
})

function testIotJsSdk() {
  const sdk = new IotSdk()
  const instance = sdk.request
  instance.request({
    url: 'https://api.github.com'
  }).then((response) => {
    console.log(response)
  })

  const MyWebSocket = IotSdk.MyWebSocket
  const ws = new MyWebSocket('wss://echo.websocket.org/');

  let sendData;
  let isOpen = false;
  let isOnmessage = false;
  let isError = false;

  ws.onopen = function open() {
    console.log('connected')
    isOpen = true;
    sendData = String(Date.now())
    ws.send(sendData);
  };

  ws.onclose = function close() {
    if (isOpen !== true) { throw '' }
    if (isOnmessage !== true) { throw '' }
    if (isError !== false) { throw '' }
    console.log('closed')
  };

  ws.onerror = function (event) {
    isError = true;
  }

  ws.onmessage = function incoming(event) {
    if (sendData !== event.data) { throw '' }
    isOnmessage = true;

    ws.close()
  };
}