var express = require('express');
var router = express.Router();

const { GpsClient } = require('gps-client');

let gps = new GpsClient({ max_gps_records: 100 });
gps.start();

let info = gps.info();
setInterval(() => {
    info = gps.info();
}, 1000);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json(info);
});

module.exports = router;