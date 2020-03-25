var express = require('express');
var router = express.Router();
const { exec } = require('child_process');
var fs = require('fs');
var path = require('path');

class FileFinder {
    constructor(options) {
        this.dir = options.dir;
        this.ignore = options.ignore;
        this.match = options.match;
    }
    scan() {
        return this.walkSync_(this.dir);
    }
    walkSync_(dir) {
        let list = [];
        let files = fs.readdirSync(dir);
        files.forEach((file) => {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                if (file.match(this.ignore) == null) {
                    list.push(...this.walkSync_(path.join(dir, file)));
                }
            }
            else {
                if (file.match(this.match) != null) {
                    list.push(path.join(dir, file));
                }
            }
        });
        return list;
    }
}

function GetPackageVersions() {

    let finder = new FileFinder({
        dir: '/home/pi/ctt',
        ignore: 'node_modules',
        match: 'package.json'
    });

    let list = [];
    finder.scan().forEach(file => {
        try {
            const contents = JSON.parse(fs.readFileSync(file, 'utf8'));

            list.push({
                name:contents.name,
                version:contents.version
            })
        } catch (err) {
            throw err;
        }
    });
    return list;
}

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

router.get('/node/version', function(req, res, next) {
    res.json(GetPackageVersions());
});

module.exports = router;
