const { Pool } = require('pg');

// Saves an authenticated user to database, if not exists
function saveUser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom) {
    //Datenbank Heroku Postgres Connection
    var timestamp = new Date();
    const client = new Pool({
        connectionString: "postgres://tlppibizshslwr:a265b4540ba66642ff7edb6037431ade0539827f8241a165c4b7067a383717ae@ec2-54-90-13-87.compute-1.amazonaws.com:5432/d6ik9ccj4jges7",
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.query(`INSERT INTO moodledatauser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp) SELECT $1, $2, $3, $4, $5, $6, $7, $8 WHERE NOT EXISTS (SELECT * FROM moodledatauser WHERE userid = $5)`, [firstname, lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp], (err, res) => {
        if (err) {
            console.log("Error - Failed to insert userdata into moodledatauser");
            console.log(err);
        }
    });

    client.end(); // Close connection
}

// Load information about user from db
function loadUser(userid) {

}

// Load all rooms related to moodleRooom
function loadRooms(moodleroomid) {

pool.query(`SELECT * FROM rooms WHERE moodleroomid = '1970';`, (err, res) => {
    if (err) {
        console.log("Error - Konnte nicht Moodle Raum ID 1970 ziehen!");
        console.log(err);
    }
    else{
        console.log("Oha!  - Konnte Moodle Raum ID 1970 ziehen");
        console.log(res.rows);
    }
});

}

// Save a new lernflixRoom related to a specific moodleRoom
function saveRooms(lernflixRoomName, moodleRoomID) {

}

module.exports = {
    saveUser,
    loadRooms,
    saveRooms,
    loadUser
}