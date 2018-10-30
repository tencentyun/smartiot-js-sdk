# 腾讯云 IoT JS SDK


## 环境

这个 SDK 的目标是同时工作于以下环境：

* 小程序。使用 `dist/iot_sdk.miniprogram.js`
* Node.js。直接 require 此包
* 浏览器 or React Native。使用 `dist/iot_sdk.browser.js`

## 安装

```bash
$ npm i tencent-smartiot
```

## 示例

```js
const SDK = require('tencent-smartiot')

async function main() {
  const sdk = new SDK({
    // 从控制台申请一个应用，会得到 AppKey
    AppKey: 'xxxxxxx',
  });

  // 调用云api方法登录
  let response = await sdk.callYunApi({
    Action: 'AppGetToken',
    ActionParams: {
      UserName: 'iotappuser',
      Password: 'xxxx',
    }
  })
  // 获取登录令牌
  const AccessToken = response.AccessToken
  
  // 绑定登录令牌
  sdk.bindAccessToken(AccessToken);
  
  // 获取用户名下的设备列表
  response = await sdk.callYunApi({
    Action: 'AppGetDevices',
    ActionParams: {
    }
  })
  
  console.log(`AppGetDevices %j`, response)
    
}

main()
```

## 方法

### constructor

`AppKey`：每个app都有对应的 AppKey，在控制台的应用管理中的 secretId 就是 AppKey。一个app只能操作它有权限的产品，不能跨产品操作。

`AccessToken`：登录之后服务器会返回 AccessToken，用于标记一个用户的会话。这个参数也可以后面再通过 bindAccessToken 传入。

```js
new SDK({
  AppKey: 'xxxx',
  AccessToken: 'yyyyyy',
})
```

### callYunApi(options)

* `options.Action` string 云方法名
* `options.ActionParams` object 方法对应的参数
* `options.WithAccessToken` boolean 默认`true`。参考.bindAccessToken方法 

`Version` 默认为 `2018-01-23`

云api的文档在：https://cloud.tencent.com/document/product/568/16436

默认的超时时间为5s，超时会抛错。

### bindAccessToken(AccessToken)

登录之后，调用这个接口绑定 AccessToken。这样在调用云api任何接口时，都会自动传 AccessToken 参数。如果需要暂时忽略 AccessToken 参数，则在 `callYunApi` 时，传入 `options.WithAccessToken=false`

登录方式有多种，请参照 API 文档中的登录部分，并通过 `callYunApi` 进行登录。

## license

MIT
