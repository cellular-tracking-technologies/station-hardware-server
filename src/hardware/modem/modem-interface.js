import { Modem } from './modem';

/**
 * modem interface around modem serial class
 */
class ModemInterface {
  /**
   * 
   * @param {*} opts 
   */
  constructor(opts) {
    this.modem = new Modem(opts);
    this.buildModemInterface();
    this.info = {};
  }

  /**
   * 
   * @param  {...any} msgs class logger
   */
  log(...msgs) {
    msgs.unshift('modem-interface');
    msgs.unshift(new Date());
    console.log(...msgs);
  }

  /**
   * handle events from the modem
   */
  buildModemInterface() {
    this.modem.on('response', (response) => {
      this.log('response', response);
      this.info[response.command] = response.response;
    });
    this.modem.on('unsolicited', (unsolicited) => {
      this.log(unsolicited);
    });
    this.modem.on('error', (err) => {
      this.log('error', error);
    });
  }

  getInfo() {
    this.modem.issueCommand('AT+CSQ');
    this.modem.issueCommand('AT+CIMI');
    this.modem.issueCommand('AT+GSN');
    this.modem.issueCommand('ATI');
    this.modem.issueCommand('AT+CREG?');
    this.modem.issueCommand('AT');
  }

  open() {
    return this.modem.start();
  }
}

export { ModemInterface };