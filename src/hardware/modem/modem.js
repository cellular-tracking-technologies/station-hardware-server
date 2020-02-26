const EventEmitter = require('events');
const SerialPort = require('serialport');
import Readline from '@serialport/parser-readline';
import { v4 as uuidv4 } from 'uuid';

/**
 * Modem Serial Port Control
 */
class Modem extends EventEmitter {
  /**
   * 
   * @param {*} opts.uri - string
   */
  constructor(opts) {
    super();
    this.uri = opts.uri ? opts.uri : '/dev/station_modem'
    this.baud_rate = opts.baud_rate ? opts.baud_rate : 115200;
    this.line_terminator = opts.line_terminator ? opts.line_terminator : '\r\n';
    this.serial;
    this.command_stack = [];
    this.response_buffer = '';
    this.response_timeout = 5000;
    this.lock = false;
  }

  /**
   * start the modem interface
   */
  start() {
    this.serial = this.buildModemInterface();
  }

  /**
   * build the serial port interface
   */
  buildModemInterface() {
    this.log(`starting modem interface on port ${this.uri} @ ${this.baud_rate}`);
    let serial_port = new SerialPort(this.uri, {
      baudRate: this.baud_rate
    });
    serial_port.on('open', () => {
      this.log('opened modem serial interface');
      this.emit('conneced');
    });
    serial_port.on('error', (err) => {
      this.emit('error', err.toString());
      console.error('error with modem interface', err.toString());
    });
    serial_port.on('data', (data) => {
      this.handleModemResponse(data.toString());
      this.log('modem -->', data.toString());
    });
    return serial_port;
  }

  /**
   * 
   * @param  {...any} msgs messages to log - include date, descriptor
   */
  log(...msgs) {
    msgs.unshift('modem');
    msgs.unshift(new Date());
    console.log(...msgs);
  }

  /**
   * 
   * @param {*} command - string
   * return command id pushed to command stack for event retrieval
   */
  issueCommand(command) {
    let id = uuidv4();

    this.command_stack.push({
      command_id: id,
      command: command,
      timeout: setTimeout(this.commandTimeout.bind(this), this.response_timeout),
      issued_at: new Date()
    });
    this.processCommand();
    return id;
  }

  /**
   * process next command in the stack
   */
  processCommand() {
    if (this.command_stack.length > 0) {
      if (this.lock === false) {
        let command = this.command_stack[0];
        this.write(command.command);
        this.lock = true;
      } else {
        this.log('command lock - not proccessing;  trying again later');
        setTimeout(this.processCommand.bind(this), 1000);
      }
    } else {
      this.lock = false;
      this.log('finished processing commands');
    }
  }

  /**
   * handle a command timeout
   */
  commandTimeout() {
    if (this.command_stack.length > 0) {
      let last_command = this.command_stack.shift();
      this.log(`command ${last_command.command} timed out`);
      last_command.response_at = new Date();
      this.emit('timeout', last_command);
      this.lock = false;
      this.processCommand();
    }
  }

  /**
   * 
   * @param {*} data - string write data to the modem
   */
  write(data) {
    let line = data.toString().trim();
    this.log(`modem <-- ${line}`);
    this.serial.write(line+this.line_terminator);
  }

  /**
   * 
   * @param {*} data - string block of data from the modem
   */
  handleModemResponse(data) {
    // if there is a command in queue - associate response with last command
    if (this.command_stack.length > 0) {
      let last_command = this.command_stack.shift();
      // assume response to the most recent command - clear timeout 
      clearTimeout(last_command.timeout);
      delete last_command.timeout;
      last_command.response = data.trim();
      last_command.response_at = new Date();
      this.emit('response', last_command);
      // process more commands, if in queue
      this.lock = false;
      setTimeout(this.processCommand.bind(this), 100);
    } else {
      // unsolicited data?
      this.emit('unsolicited', data);
    }
  }
}

export { Modem };
