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


    //Select all Columns from Table rooms where moodleroomid = id which you enter.
    //json_agg for the json object generation
    //Variablennamen nach Belieben ändern! Z.B. RaumID oder MoodleRaumName,.....

    //TODO: GROUP BY muss im Query enthalten sein, hier werden die Daten unter dem Namen moodleroomid gespeichert was natürlich semantisch nicht stimmt (Funktioniert alles, nur Namensgebung halt falsch)
    const results = client.query(`SELECT moodleroomid, json_agg(json_build_object('RaumID', moodleroomid
                                                             , 'MoodleRaumName' , moodleroomname, 'LernflixRoomName', lernflixroomname, 'LernflixRaumID', lernflixroomid)) AS moodleroomname
                  FROM   rooms
                  WHERE moodleroomid =  $1
                  GROUP  BY moodleroomid`, [moodleroomid], (err, res) => {
        if (err) {
            console.log("Error - Konnte Räume Moodle Raum ID" + moodleroomid + " NICHT laden! Leider noch keine Räume in diesem Kurs vorhanden!");
            console.log(err);
        }
        else{
            console.log("Oha!  - Konnte Räume mit Moodle Raum ID " + moodleroomid + "  laden");

            //Variable, welche das JSON enthält, fertig zum weiterbearbeiten und Abgreifen der Daten in herkömmlicher Art und Weise
            var roomLoadData = JSON.stringify(res.rows);
            console.log("Ouput des JSONs mit JSON.stringify" + JSON.stringify(res.rows));
            console.log("Output der Variable mit dem JSON" + roomLoadData);
        }
    });



}

// Save a new lernflixRoom related to a specific moodleRoom
function saveRooms(lernflixroomid, lernflixroomname, moodleroomid, moodleroomname) {

    //Datenbank Heroku Postgres Connection
    //Anmerkung Andre: Kann man diesen Prozess auslagern und bei jedem Query aufrufen? (ich weiß es nicht)
    var timestamp = new Date();
    const client = new Pool({
        connectionString: "postgres://tlppibizshslwr:a265b4540ba66642ff7edb6037431ade0539827f8241a165c4b7067a383717ae@ec2-54-90-13-87.compute-1.amazonaws.com:5432/d6ik9ccj4jges7",
        ssl: {
            rejectUnauthorized: false
        }
    });

    client.query(`INSERT INTO rooms(lernflixroomid, lernflixroomname, moodleroomid, moodleroomname) SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT * FROM rooms WHERE lernflixroomname = $2)`, ['Unique ID von Mathias', 'Name des Raumes wo von Frontend kommt', moodleroomid, moodleroomname], (err, res) => {
        if (err) {
            console.log("Raumname SCHON VORHANDEN!");
            console.log(err);
        }
    });

    client.end(); // Close connection

}

module.exports = {
    saveUser,
    loadRooms,
    saveRooms,
    loadUser
}