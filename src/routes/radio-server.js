const fs = require('fs');
const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const WebSocketURL = 'ws://localhost:8001';
const ConfigFileURI = '/etc/ctt/station-config.json';

router.get('/checkin', (req, res, next) => {
  let ws = new WebSocket(WebSocketURL);
  ws.on('open', () => {
    ws.send(JSON.stringify({
      msg_type: 'cmd',
      cmd: 'checkin'
    }));
    res.send(204);
  });
  ws.on('close', () => {
    res.status(500).send('web socket closed');
  });
  ws.on('error', (err) => {
    console.error('error connected to radio server web socket');
    console.error(err);
    res.status(500).send('web socket connect error');
  });
});

router.get('/config', (req, res, next) => {
  try {
    let config = JSON.parse(fs.readFileSync(ConfigFileURI).toString());
    res.json(config);
  } catch (err) {
    res.json({err: err.toString()});
  }
});

module.exports = router;