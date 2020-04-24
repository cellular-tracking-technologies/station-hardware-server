const fs = require('fs');
const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const WebSocketURL = 'ws://localhost:8001';
const ConfigFileURI = '/etc/ctt/station-config.json';

router.get('/config', (req, res, next) => {
  try {
    let config = JSON.parse(fs.readFileSync(ConfigFileURI).toString());
    res.json(config);
  } catch (err) {
    res.json({err: err.toString()});
  }
});

module.exports = router;