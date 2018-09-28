const { spawn } = require('child_process');
const assert = require('assert')
const delay = require('delay')
const pathLib = require('path')
const Sdk = require('..')
const MyWebSocket = Sdk.MyWebSocket


let websocketServerProcess;
describe('my_web_socket.test.js', function() {
  before(async function () {
    websocketServerProcess = spawn('node', [pathLib.join(__dirname, './server/simple_ws_server.js')])
    await delay(1000)
  })
  after(function () {
    websocketServerProcess.kill()
  })

  this.timeout(10 * 1000);

  it('echo.websocket.org test', (done) => {
    const ws = new MyWebSocket('ws://127.0.0.1:8080/');

    let sendData;
    let isOpen = false;
    let isOnmessage = false;
    let isError = false;

    ws.onOpen(function () {
      isOpen = true;
      sendData = String(Date.now())
      ws.send(sendData);
    });

    ws.onClose(function () {
      assert(isOpen === true)
      assert(isOnmessage === true)
      assert(isError === false);
      done()
    })

    ws.onError(function (event) {
      isError = true;
    })

    ws.onMessage(function (event) {
      assert(sendData === event.data);
      isOnmessage = true;

      ws.close()
    });
  })
})