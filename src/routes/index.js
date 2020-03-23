var express = require('express');
var router = express.Router();
const { exec } = require('child_process');

function deviceId(){
    return new Promise((resolve, reject) =>{ 
        let id = "";
        let child = exec(`hashlet serial-num`, (error,stdout, stderr) =>{
            if(error){                
                reject(error);
            }
        })
        child.stdout.on('data', (data) => {
            id += data;
        });
        child.on('close', (code) => {
            resolve(id);
        });       
    });
}

let device_id = "";
deviceId().then((response) =>{
    device_id = response.substring(4, response.length - 3);
}).catch((err) =>{
    device_id = "error";
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({welcome: true});
});

router.get('/id', function(req, res, next) {
    res.json({id: device_id});
});

module.exports = router;
