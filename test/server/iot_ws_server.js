const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.action == 'YunApi' && data.params.Action == 'AppGetUser' && data.reqId == 0) {
      const result = JSON.stringify({
        data: {
          Response: {
            Error: {}
          }
        },
        reqId: 0
      })
      ws.send(result)
    }
  });
});