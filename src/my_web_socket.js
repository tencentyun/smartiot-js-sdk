/*
这是一个websocket的同构层，同构了小程序，h5与node.js的websocket调用。
 */

const debug = require('debug')('iot:my_web_socket')
const envDetect = require('./env_detect')

let wsLib

if (envDetect.isNode) {
  wsLib = require('ws')
}

class MyWebSocket {
  constructor(url, options) {
    this.options = options || {};
    this.url = url;
    this.origin = this.options.origin;

    this.wxWs = null;
    this.ws = null;

    this.initWs()
  }

  initWs() {
    if (envDetect.isMiniProgram) {
      this.wxWs = wx.connectSocket({
        url: this.url,
        header: {
          origin: this.origin,
        }
      })
    } else if (envDetect.isNode) {
      this.ws = new wsLib(this.url, {
        origin: this.origin,
      });
    } else if (envDetect.isBrowser || envDetect.isRN) {
      this.ws = new WebSocket(this.url);
    }
  }

  send(data) {
    if (envDetect.isMiniProgram) {
      this.wxWs.send({
        data: data,
      })
    } else {
      this.ws.send(data)
    }
  }

  close(code, reason) {
    if (envDetect.isMiniProgram) {
      this.wxWs.close({
        code: code,
        reason: reason,
      })
    } else {
      this.ws.close(code, reason)
    }
  }

  onOpen(callback) {
    if (envDetect.isMiniProgram) {
      this.wxWs.onOpen(callback)
    } else {
      this.ws.addEventListener('open', callback)
    }
  }

  onClose(callback) {
    if (envDetect.isMiniProgram) {
      this.wxWs.onClose(callback)
    } else {
      this.ws.addEventListener('close', callback)
    }
  }

  onMessage(callback) {
    if (envDetect.isMiniProgram) {
      this.wxWs.onMessage(callback)
    } else {
      this.ws.addEventListener('message', callback)
    }
  }

  onError(callback) {
    if (envDetect.isMiniProgram) {
      this.wxWs.onError(callback)
    } else {
      this.ws.addEventListener('error', callback)
    }
  }
}

exports = module.exports = MyWebSocket