var express = require('express');
var router = express.Router();
const icmp = require("icmp");

const DEFAULT_PING_COUNT = 3;
const PING_IP = '4.2.2.2';

const ping = function() {
  return new Promise((resolve, reject) => {
    icmp.send(PING_IP)
    .then((ping_result) => {
      resolve(ping_result);
    })
    .catch((err) => {
      reject(err);
    });
  })
}

router.get('/status', (req, res, next) => {
  let ping_success = 0;
  let ping_loss = 0;
  let ping_count = req.query.ping_count ? req.query.ping_count : DEFAULT_PING_COUNT;
  // issue a ping to the given IP address
  let promises = [];
  for (let i=0; i<ping_count; i++) {
    promises.push(ping())
  }
  Promise.all(promises)
  .then((results) => {
    results.forEach((result) => {
      result ? ping_success++ : ping_loss ++;
    });
    return res.json({
      success: ping_success,
      fail: ping_loss
    });
  })
  .catch((err) => {
    console.log('something went wrong with ping status...');
    console.error(err);
    return res.json({
      success: 0,
      fail: ping_count 
    });
  })
});

module.exports = router;