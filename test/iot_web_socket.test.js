const { spawn } = require('child_process');
const pathLib = require('path')
const assert = require('assert')
const Sdk = require('..')
const IotWebSocket = Sdk.IotWebSocket
const delay = require('delay')


let websocketServerProcess;

async function startServer() {
  websocketServerProcess = spawn('node', [pathLib.join(__dirname, './server/iot_ws_server.js')])
  await delay(200)
}

async function killServer() {
  websocketServerProcess.kill()
  await delay(200)
}
describe('iot_web_socket.test.js', function () {
  this.timeout(10 * 1000);

  it('should work with ws://127.0.0.1:8080/', async function () {
    await startServer()

    const iotWebSocket = new IotWebSocket('ws://127.0.0.1:8080/', {
      hearbeatInterval: 2 * 1000,
      reconnectInterval: 5 * 1000,
    })
    let isOpenCallback = false;
    let isCloseCallback = false;

    iotWebSocket.onOpen(async function () {
      isOpenCallback = true;
    })
    iotWebSocket.onClose(function (event) {
      isCloseCallback = true;
    })

    const response = await iotWebSocket.call('YunApi', {
      AppKey: 'AKIDomu564hU6ku2FOvH5pdMLYp5BKSVeEwX',
      Action: 'AppGetUser',
      ActionParams: {
      }
    })

    iotWebSocket.close()
    await killServer()

    await delay(100);

    assert(isOpenCallback);
    assert(isCloseCallback);
    assert(response.data.Response.Error);
  })

  it('should reconnect and send buffer message', async function () {
    let isOpenCallback = false;
    let isCloseCallback = false;

    await startServer()

    const iotWebSocket = new IotWebSocket('ws://127.0.0.1:8080/', {
      hearbeatInterval: 2 * 1000,
      reconnectInterval: 1 * 1000,
    })

    iotWebSocket.onOpen(async function () {
      isOpenCallback = true;
    })
    iotWebSocket.onClose(function (event) {
      isCloseCallback = true;
    })
    iotWebSocket.onError(function (e) {
      // do nothing
    })


    await delay(200);
    // 第一次关闭server
    await killServer()
    await delay(200)
    assert(isOpenCallback);
    assert(isCloseCallback);

    // 再次启动server。这里使用异步启动，才能准确测试iotWebsocket的重连功能
    startServer()
    // server未启动之前，调用YunApi方法，等到重连成功时，await才会返回
    const response = await iotWebSocket.call('YunApi', {
      AppKey: 'AKIDomu564hU6ku2FOvH5pdMLYp5BKSVeEwX',
      Action: 'AppGetUser',
      ActionParams: {
      }
    })

    iotWebSocket.close()
    await killServer()

    assert(response.data.Response.Error);
  })
})