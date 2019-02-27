const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from, 
        text, 
        createdAt: moment().valueOf(),
    };
};

const generateSpyList = (array, recipient) => {
    array = array.filter(spy => spy.name !== recipient.name);
    let str = '';
    for(let i = array.length - 1; i > 0; i--) {
        str += array[i].name;
        if(i === 1) {
            str += ' and ';
        } else {
            str += ', ';
        }
    }
    str += array[0].name;
    return str;
}

module.exports = {generateMessage, generateSpyList};