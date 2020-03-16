var express = require('express');
var router = express.Router();

const {UsbStorage, BlockDeviceCmd} = require('usb-storage-driver');

let usb = new UsbStorage();

/* GET home page. */
router.get('/', function(req, res, next) {

    new BlockDeviceCmd().poll()
    .then((devices) =>{
        res.json(devices);
    }).catch((error) => {
        res.json(null);
    });

});

const success = {status:"success"};
const fail = {status:"fail"};

router.get('/mount', function(req, res, next) {
    usb.mount()
    .then(()=>{
        res.json(success);
    }).catch((err) =>{
        res.json(fail);
    });
});

router.get('/unmount', function(req, res, next) {
    usb.unmount()
    .then(()=>{
        res.json(success);
    }).catch((err) =>{
        res.json(fail);
    });
});

router.get('/data', function(req, res, next) {
    usb.copyTo("/data", /.*(data|rotated|SG_files|uploaded|ctt|sg|.csv|.csv.gz|.tar.gz)$/, (err)=>{
        if(err){
            res.json(fail);
        }else{
            res.json(success);
        }
    });
});

router.get('/wifi', function(req, res, next) {

});

module.exports = router;