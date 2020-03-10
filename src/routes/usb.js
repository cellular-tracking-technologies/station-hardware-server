var express = require('express');
var router = express.Router();

const { BlockDeviceCmd, MountUsb } = require('usb-storage-driver');

/* GET home page. */
router.get('/', function(req, res, next) {
    let cmd = new BlockDeviceCmd();

    cmd.poll()
    .then((devices) =>{
        res.json(devices);
    }).catch((error) => {
        res.json(null);
    });

});
  
module.exports = router;