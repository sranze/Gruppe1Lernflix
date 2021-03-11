const { Pool } = require('pg');

// TODO: Timestamp kaputt -> korrigieren
function saveUser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom) {
    //Datenbank Heroku Postgres Connection
    const client = new Pool({
        connectionString: "postgres://tlppibizshslwr:a265b4540ba66642ff7edb6037431ade0539827f8241a165c4b7067a383717ae@ec2-54-90-13-87.compute-1.amazonaws.com:5432/d6ik9ccj4jges7",
        ssl: {
            rejectUnauthorized: false
        }
    });

    //Insert SQL for MoodleData
    client.query(`INSERT INTO moodledatauser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom) SELECT 'firstName', 'lastname','fullname','email','userid','profilepicture','moodleRoom', WHERE NOT EXISTS (SELECT * FROM moodledatauser WHERE userid = 'userid')`), (err, res) => {
        if (err) {
            console.log("Error - Failed to insert data into DB");
            console.log(err);
        }
    });

    // TODO: Close DB
    client.end();
}

function loadUser(params) {

}

function loadRooms(params) {

}

function saveRooms(params) {

}

module.exports = {
    saveUser
}