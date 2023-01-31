const users = []; // Holds all users on heap

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

// Get room users
function getRoomUsers(roomId) {
    return users.filter(user => user.roomId === roomId);
}

// Get users by moodle room (id)
function getMoodleRoomUsers(moodleRoom) {
    return users.filter(users => user.moodleRoom === moodleRoom);
}

// Returns all on heap available users
function returnAllUsers() {

    console.log(users)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getCurrentUser,
    returnAllUsers

}