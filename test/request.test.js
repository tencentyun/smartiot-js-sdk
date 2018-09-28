const assert = require('assert');
const Sdk = require('..')
const Request = Sdk.Request
const axios = require('axios')
const nock = require('nock')


const instance = new Request({})

describe('request.test.js', function () {
  it('should get with querystring', async function () {
    nock('http://www.qq.com')
      .get('/')
      .query({q: 2})
      .reply(200, {data: 1})

    const response = await instance.request({
      url: 'http://www.qq.com',
      data: {
        q: 2
      }
    })

    assert.equal(response.statusCode, 200)
    assert.equal(response.data.data, 1)
    assert.equal(response.header['content-type'], 'application/json')
  })

  it('should post with json body', async function () {
    nock('http://www.qq.com')
      .post('/', {q: 2})
      .reply(200, {data: 1})

    const response = await instance.request({
      method: 'POST',
      url: 'http://www.qq.com',
      data: {
        q: 2
      }
    })

    assert.equal(response.statusCode, 200)
    assert.equal(response.data.data, 1)
    assert.equal(response.header['content-type'], 'application/json')
  })

  it('should post with json string body', async function () {
    nock('http://www.qq.com')
      .post('/', {q: 2})
      .reply(200, {data: 1})

    const response = await instance.request({
      method: 'POST',
      url: 'http://www.qq.com',
      data: '{"q": 2}'
    })

    assert.equal(response.statusCode, 200)
    assert.equal(response.data.data, 1)
    assert.equal(response.header['content-type'], 'application/json')
  })
})