var express = require('express');
var router = express.Router();

import { ModemInterface } from '../hardware/modem/modem-interface';
import QuectelCommandSetParser from '../hardware/modem/quectel-command-set';

const Modem = new ModemInterface({
  uri: '/dev/station_modem_status',
  baud_rate: 115200,
  command_set_parser: QuectelCommandSetParser,
  poll_frequency_seconds: 10
});
Modem.open()

setInterval(() =>{
  console.log(Modem.info);
}, 15000);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(Modem.info);
});

module.exports = router;