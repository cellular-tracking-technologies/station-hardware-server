var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = {
    signal: -90,
    tower: 'AT&T'
  }

  res.json(data);
});

module.exports = router;