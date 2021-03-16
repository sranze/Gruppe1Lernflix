const users = [];

// Join user to chat
function userJoin(socketid, userid, username, roomName, roomId) {
    const user = { socketid, userid, username, roomName, roomId };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(socketid) {
    return users.find(user => user.socketid === socketid);
}

// User leaves chat
function userLeave(socketid) {
    const index = users.findIndex(user => user.socketid === socketid);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(roomId) {
    return users.filter(user => user.roomId === roomId);
}

// Export modules 
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}