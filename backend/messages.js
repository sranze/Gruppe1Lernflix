const moment = require('moment');

function messageFormatter(messageFrom, text) {
    return {
        messageFrom,
        text,
        time: moment().format('D.M.YY H:mm')
    }
}

module.exports = messageFormatter;