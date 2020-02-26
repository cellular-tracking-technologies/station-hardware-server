var express = require('express');
var router = express.Router();

import { ModemInterface } from '../hardware/modem/modem-interface';

const Modem = new ModemInterface({
  uri: '/dev/station_modem_status',
  baud_rate: 115200,
});
Modem.open()

setInterval(Modem.getInfo.bind(Modem), 2000);
setInterval(() =>{
  console.log(Modem.info);
}, 5000);

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
    signal: -90,
    tower: 'AT&T'
  }
  Modem.issueCommand('AT+CSQ');
  res.json(data);
});

module.exports = router;