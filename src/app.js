var express = require('express');

var indexRouter = require('./routes/index');
var modemRouter = require('./routes/modem');
var sensorRouter = require('./routes/sensor');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/modem', modemRouter);
app.use('/sensor', sensorRouter)

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
