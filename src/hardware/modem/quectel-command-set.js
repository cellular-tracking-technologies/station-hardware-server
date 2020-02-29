import { CommandSetParser } from './command-set-parser';

const QuectelCommandSetParser = new CommandSetParser([{
    command: 'AT+CSQ',
    name: 'signal',
    parser: (response) => {
        return response.trim();
    }
}, {
    command: 'AT+CIMI',
    name: 'imei',
    parser: (response) => {
        return response.trim();
    }
}, {
    command: 'AT+GSN',
    name: 'gsn',
    parser: (response) => {
        return response.trim();
    }
}, {
    command: 'ATI',
    name: 'info',
    parser: (response) => {
        return response.trim();
    }
}, {
    command: 'AT+CREG?',
    name: 'creg',
    parser: (response) => {
        return response.trim();
    }
}, {
    command: 'AT+COPS?',
    name: 'carrier',
    parser: (response) => {
        // 'AT+COPS?\r\r\n+COPS: 0,0,"Twilio",7',
        let lines = response.split("\r\n")
        let ret = "Searching...";
        lines.forEach(element => {
            if(element.includes("COPS:")){
                let columns = element.split(",");
                if(columns.length == 4){
                        const accessTechnology = {
                            0:"2G",
                            2:"3G",
                            4:"3G",
                            5:"3G",
                            6:"3G",
                            7:"LTE"
                        }
                    ret = `${columns[2] == "\"Twilio\"" ? "T-Mobile": columns[2]},${accessTechnology[columns[3]]}`;
                }
            }
        });
        return ret;
    }
}, {
    command: 'AT',
    name: 'ok',
    parser: (response) => {
        return response.trim();
    }
}]);

export default QuectelCommandSetParser;