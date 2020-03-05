var express = require('express');
var router = express.Router();

import {Ads7924 as Adc} from "../hardware/sensor/ads7924";

const adc = new Adc();
adc.init();

let voltages = {
    battery: 0,
    solar: 0,
    rtc: 0
}

setInterval(() =>{
    let data = adc.read();    
    voltages.battery = data[0].toFixed(2);
    voltages.solar = data[1].toFixed(2);
    voltages.rtc = data[2].toFixed(2);
}, 5000);

/* GET home page. */
router.get('/voltages', function(req, res, next) {
    res.json(voltages);
});
  
  module.exports = router;