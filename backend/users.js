const users = [];

// Join user to chat
function userJoin(socketid, userid, username, roomName, roomId, moodleRoom) {
    const user = { socketid, userid, username, roomName, roomId, moodleRoom };

    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(socketid) {
    return users.find(user => user.socketid === socketid);
}

// User leaves chat
function userLeave(socketid) {
    if (typeof socketid !== 'undefined') {
        const index = users.findIndex(user => user.socketid === socketid);
        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
    }
}

function getSocketId(userid) {
    return users.find(user => user.userid === userid);
}

// Get room users
function getRoomUsers(roomId) {
    return users.filter(user => user.roomId === roomId);
}

function getMoodleRoomUsers(moodleRoom) {
    return users.filter(users => user.moodleRoom === moodleRoom);
}

function returnAllUsers() {
    return users;
}
// Export modules 
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getSocketId,
    getMoodleRoomUsers,
    returnAllUsers
}