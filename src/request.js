/*
这是一个 http 请求的同构层，同构了小程序，h5与node.js的websocket调用。
 */

const envDetect = require('./env_detect')
let axios;

if (!envDetect.isMiniProgram) {
  axios = require('axios');
}



class Request {
  constructor(options) {
    options = options || {}

    this.axios = axios;
  }

  request(options) {
    const self = this;

    options = self.transformReuqestOptions(options)

    if (envDetect.isMiniProgram) {
      return new Promise(function (resolve, reject) {
        const wxOptions = Object.assign({}, {
          success: function (res) {
            resolve(res);
          },
          fail: function(err) {
            reject(err);
          },
        }, options);

        wx.request(wxOptions)
      })

    } else {
      let axiosOptions = {
        url: options.url,
        headers: options.header,
        method: options.method,
      }
      if (options.method === 'GET') {
        axiosOptions.params = options.data;
      } else if (options.method === 'POST' && options.header['content-type'] === 'application/json') {
        axiosOptions.data = options.data;
      }

      return this.axios.request(axiosOptions)
        .then(function (response) {
          return ({
            data: response.data,
            statusCode: response.status,
            header: response.headers,
          })
        })
    }
  }

  transformReuqestOptions(options) {
    if (options.method) {
      options.method = options.method.toUpperCase()
    } else {
      options.method = 'GET'
    }

    if (options.method === 'POST') {
      options.header = options.header || {};
      options.header['content-type'] = options.header['content-type'] || 'application/json'
    }

    return options;
  }
}


module.exports = Request;