var express = require('express');
var router = express.Router();
const { spawn } = require('child_process');

const { ModemInterface, QuectelCommandSetParser } = require('@cellular-tracking-technologies/modem-status-driver');

const Modem = new ModemInterface({
  uri: '/dev/station_modem_status',
  baud_rate: 115200,
  command_set_parser: QuectelCommandSetParser,
  poll_frequency_seconds: 10
});
Modem.open();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json(Modem.info);
});

const RunCommand = (cmd, args) => {
  console.log('about to run command', cmd);
  return new Promise((resolve, reject) => {
    const command_process = spawn(cmd, args);
    command_process.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    command_process.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    command_process.on('close', (code) => {
      resolve(code);
    });
    command_process.on('error', (err) => {
      console.error('error processing command', cmd);
      console.error(err);
      reject(err);
    });
  });
};

router.post('/stop', (req, res, next) => {
  RunCommand('systemctl', ['stop', 'modem'])
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    })
});

router.post('/start', (req, res, next) => {
  RunCommand('systemctl', ['start', 'modem'])
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    })
});

router.post('/enable', (req, res, next) => {
  RunCommand('systemctl', ['enable', 'modem'])
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    })
});

router.post('/disable', (req, res, next) => {
  RunCommand('systemctl', ['disable', 'modem'])
    .then((response) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send(err.toString());
    })
});

module.exports = router;