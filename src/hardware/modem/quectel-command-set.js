import { CommandSetParser } from './command-set-parser';

const QuectelCommandSetParser = new CommandSetParser([{
  command: 'AT+CSQ',
  name: 'signal',
  parser: (response) => {
    return response.trim();
  }
},{
  command: 'AT+CIMI',
  name: 'imei',
  parser: (response) => {
    return response.trim();
  }
},{
  command: 'AT+GSN',
  name: 'gsn',
  parser: (response) => {
    return response.trim();
  }
},{
  command: 'ATI',
  name: 'info',
  parser: (response) => {
    return response.trim();
  }
},{
  command: 'AT+CREG?',
  name: 'creg',
  parser: (response) => {
    return response.trim();
  }
},{
  command: 'AT',
  name: 'ok',
  parser: (response) => {
    return response.trim();
  }
}]);

export default QuectelCommandSetParser;