const { Pool } = require('pg');

// Saves an authenticated user to database, if not exists
function saveUser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom) {
    //Datenbank Heroku Postgres Connection
    //Anmerkung Andre: Kann man diesen Prozess auslagern und bei jedem Query aufrufen? (ich weiß es nicht)
    var timestamp = new Date();
    const client = new Pool({
        connectionString: "postgres://yjrdjvggafmafm:b411ff567635bb4365f585f0199ea3ece058d537905626ce340cebfaf9948fa2@ec2-34-239-33-57.compute-1.amazonaws.com:5432/d58f8s5f6g4lkv",
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
async function loadRooms(moodleroomid) {
    const client = new Pool({
        connectionString: "postgres://yjrdjvggafmafm:b411ff567635bb4365f585f0199ea3ece058d537905626ce340cebfaf9948fa2@ec2-34-239-33-57.compute-1.amazonaws.com:5432/d58f8s5f6g4lkv",
        ssl: {
            rejectUnauthorized: false
        }
    });
    try {
        const results = await client.query(`SELECT moodleroomid, json_agg(json_build_object('moodleroomid', moodleroomid
                                            , 'moodleroomname' , moodleroomname, 'lernflixroomname', lernflixroomname, 'lernflixroomid', lernflixroomid)) AS moodleroomname
                                            FROM   rooms
                                            WHERE moodleroomid =  $1
                                            GROUP  BY moodleroomid`, [moodleroomid])

        var roomsFrontend = [];

        var roomLoadData = JSON.stringify(results.rows);
        var roomLoadDataObject = JSON.parse(roomLoadData);
        var innerArrayLength = roomLoadDataObject[0]["moodleroomname"].length;
        for (var i = 0; i < innerArrayLength; i++) {
            // console.log(roomLoadDataObject[0]["moodleroomname"][i]["lernflixroomname"])
            roomsFrontend.push(roomLoadDataObject[0]["moodleroomname"][i]["lernflixroomid"]); // lernflix ids
            roomsFrontend.push(roomLoadDataObject[0]["moodleroomname"][i]["lernflixroomname"]); // lernflix roomnames
        }
        return roomsFrontend;

    } catch (e) {
        console.log("Something went wrong " + e);
    } finally {
        await client.end();
    }
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