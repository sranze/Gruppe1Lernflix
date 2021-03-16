const moment = require('moment');
// Helperfunction: Helps creating message object
function messageFormatter(messageFrom, text) {
    return {
        messageFrom,
        text,
        time: moment().format('D.M.YY H:mm')
    }
}

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