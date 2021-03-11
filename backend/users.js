// TODO: Use PostgreSQL DB instead of array in memory...
const users = []; // TODO Use PostgreSQL DB for this

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user); // TODO use PostgreSQL DB for this

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id); // TODO get user by PostgreSQL DB for this
}

// Export modules for app.js
module.exports = {
    userJoin,
    getCurrentUser
}