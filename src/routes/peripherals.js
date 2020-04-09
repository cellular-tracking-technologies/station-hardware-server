const express = require('express');
const router = express.Router()
const { exec }= require('child_process');

router.get('/', function(req, res, next) {
  exec("lsusb", (err, stdout, stderr) => {
    if (err) {
      res.json({'error': err.toString()});
    }
    res.json({
      info: stdout
    });
  });
});

module.exports = router;