const { Pool } = require('pg');

// Saves an authenticated user to database, if not exists
function saveUser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom) {
    //Datenbank Heroku Postgres Connection
    //Anmerkung Andre: Kann man diesen Prozess auslagern und bei jedem Query aufrufen? (ich weiß es nicht)
    var timestamp = new Date();
    const client = new Pool({
        connectionString: "postgres://tlppibizshslwr:a265b4540ba66642ff7edb6037431ade0539827f8241a165c4b7067a383717ae@ec2-54-90-13-87.compute-1.amazonaws.com:5432/d6ik9ccj4jges7",
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.query(`INSERT INTO moodledatauser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp) SELECT $1, $2, $3, $4, $5, $6, $7, $8 WHERE NOT EXISTS (SELECT * FROM moodledatauser WHERE userid = $5)`, [firstname, lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp], (err, res) => {
        if (err) {
            console.log("USER SCHON VORHANDEN!");
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

    //Datenbank Heroku Postgres Connection
    var timestamp = new Date();
    const client = new Pool({
        connectionString: "postgres://tlppibizshslwr:a265b4540ba66642ff7edb6037431ade0539827f8241a165c4b7067a383717ae@ec2-54-90-13-87.compute-1.amazonaws.com:5432/d6ik9ccj4jges7",
        ssl: {
            rejectUnauthorized: false
        }
    });



const results = client.query(`SELECT moodleroomid, json_agg(json_build_object('RaumID', moodleroomid
                                                         , 'MoodleRaumName' , moodleroomname, 'LernflixRoomName', lernflixroomname, 'LernflixRaumID', lernflixroomid)) AS moodleroomname
              FROM   rooms
              WHERE moodleroomid =  $1
              GROUP  BY moodleroomid`, [moodleroomid], (err, res) => {
    if (err) {
        console.log("Error - Konnte Räume Moodle Raum ID" + moodleroomid + " NICHT ziehen! Leider noch keine Räume in diesem Kurs vorhanden!");
        console.log(err);
    }
    else{
        console.log("Oha!  - Konnte Räume mit Moodle Raum ID " + moodleroomid + "  ziehen");
        var roomLoadData = JSON.stringify(res.rows);
        console.log(JSON.stringify(res.rows));
        console.log(roomLoadData);
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