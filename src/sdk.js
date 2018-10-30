const Request = require('./request')
const MyWebSocket = require('./my_web_socket')
const IotWebSocket = require('./iot_web_socket')
const debug = require('debug')('iot:sdk')

class Sdk {
  constructor(options) {
    options = options || {}

    if (!options.AppKey) {
      throw new Error('must provide `AppKey`')
    }

    this.AppKey = options.AppKey;
    this.AccessToken = options.AccessToken;

    this.request = new Request()
    this.ws = new IotWebSocket(options.wsOptions)

    this.init()
  }

  init() {
    const self = this;

    self.ws.onOpen(function () {
      self.activePush().catch(function (err) {
        debug(`onOpen activePush ${err}`)
      })
    })
  }

  callYunApi(options) {
    const self = this;

    const Action = options.Action
    const ActionParams = flattenArray(options.ActionParams)
    const Version = options.Version;
    const Region = options.Region
    const WithAccessToken = options.WithAccessToken === void 0 ? true : options.WithAccessToken;

    // AccessToken 的默认值逻辑
    if (!ActionParams.AccessToken && self.AccessToken && WithAccessToken) {
      ActionParams.AccessToken = self.AccessToken
    }

    return self.ws.call('YunApi', {
      AppKey: self.AppKey,
      Action: Action,
      Version: Version,
      Region: Region,
      ActionParams: ActionParams
    }).then(function (response) {
      return response.data.Response
    })
  }

  bindAccessToken(AccessToken) {
    const self = this;
    self.AccessToken = AccessToken;

    self.activePush().catch(function (err) {
      debug(`activePush activePush ${err}`)
    })
  }

  unbindAccessToken() {
    const self = this;
    self.AccessToken = null
  }

  // activePush是个幂等操作，多次调用也没事。
  activePush() {
    const self = this;

    if (self.AppKey && self.AccessToken) {
      return self.ws.call('ActivePush', {
        AppKey: self.AppKey,
        AccessToken: self.AccessToken,
      })
    }
    return Promise.reject(new Error('Please ensure `AppKey` and `AccessToken` exist'))
  }

  call() {
    return this.ws.call.apply(this.ws, arguments);
  }

  /*
  fn(dataObj);
   */
  onPush(fn) {
    const self = this;
    self.ws.on('push', fn);
  }
}

exports = module.exports = Sdk;
exports.Request = Request;
exports.MyWebSocket = MyWebSocket;
exports.IotWebSocket = IotWebSocket;

/*
腾讯云云api专用的一个参数转换方法
用于将 {a: [1, 2, 3]} 转成 { 'a.0': 1, 'a.1': 2, 'a.2': 3 }
 */
function flattenArray(input, prefix = '') {
  let output = {}

  for (const key in input) {
    const value = input[key]
    if (typeof value === 'object') {
      Object.assign(output, flattenArray(value, `${prefix}${key}.`))
    } else {
      output[`${prefix}${key}`] = value;
    }
  }

  return output
}
