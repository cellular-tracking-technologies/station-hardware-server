var express = require('express');
var router = express.Router();
const WebSocket = require('ws');
const WebSocketURL = 'http://localhost:8001';

router.get('/', (req,res,next) => {
  res.json({wtf:true});
});

router.get('/stats', (req, res, next) => {
  let ws = new WebSocket(WebSocketURL);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      msg_type: 'cmd',
      cmd: 'stats'
    }));
    ws.on('message', (msg) => {
      msg = JSON.parse(msg);
      if (msg.msg_type == 'stats') {
        ws.close();
        res.json(msg);
      }
    })
    ws.on('close', () => {
      console.log('ws closed')
    })
  });
});

module.exports = router;