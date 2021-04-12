const moment = require('moment');
var Filter = require('bad-words'),
    filter = new Filter();

// Creates regular message object
function messageFormatter(messageFrom, text) {
    return {
        messageFrom,
        filter.clean(text),
        time: moment().format('D.M.YY H:mm')
    }
}

// Creates welcome message object (/w rooms)
function welcomeMessage(messageFrom, text, rooms) {
    return {
        messageFrom,
        text,
        rooms,
        time: moment().format('D.M.YY H:mm')
    }
}

module.exports = {
    messageFormatter,
    welcomeMessage
}