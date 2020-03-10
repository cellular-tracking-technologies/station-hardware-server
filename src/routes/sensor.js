var express = require('express');
var router = express.Router();
const {Adc} = require('adc-driver');

let options = {type:"Ads7924"};
const adc = new Adc(options);
adc.init();

let voltages = {
    battery: 0,
    solar: 0,
    rtc: 0
}

setInterval(() =>{

    voltages.battery = (adc.read(0) * (5.016 / 4096) * 6).toFixed(2);
    voltages.solar = (adc.read(1) * (5.016 / 4096) * 6).toFixed(2);
    voltages.rtc = (adc.read(2) * (5.016 / 4096)).toFixed(2);

}, 5000);

router.get('/voltages', function(req, res, next) {
    res.json(voltages);
});
  
module.exports = router;