require('dotenv').config()
const { Pool } = require('pg');
const dbConnectionString = process.env.DB_CONNECTION_STRING;

// Create new Pool to db
function newPool() {
    const client = new Pool({
        connectionString: dbConnectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });
    return client;
}

// TODO: Asynchron umschreiben
// Saves an authenticated user to database, if not exists
function saveUser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom) {
    if (typeof firstname !== 'undefined') {
        if (firstname != 'undefined' && firstname != null && firstname != null) {
            // Datenbank Heroku Postgres Connection
            var timestamp = new Date();
            const client = newPool();

            client.query(`INSERT INTO moodledatauser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp) SELECT $1, $2, $3, $4, $5, $6, $7, $8 `, ["firstname", lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp], (err, res) => {
                if (err) {
                    console.log("USER SCHON VORHANDEN!");
                    console.log(err);
                }
            });
            client.end();
        }
    }
}


function saveFeedback( userid, username, feedbackText, moodleRoom, moodleRoomName ) {
    if (typeof userid !== 'undefined') {

            // Datenbank Heroku Postgres Connection
            var timestamp = new Date();
            const client = newPool();

            client.query(`INSERT INTO "feedbackLernflix"( userid, username, feedbackText, moodleRoom, moodleRoomName, timestamp) SELECT $1, $2, $3, $4, $5, $6`, [ userid, username, feedbackText, moodleRoom, moodleRoomName, timestamp], (err, res) => {
                if (err) {
                    console.log("Feedback geht nicht SCHON VORHANDEN!");
                    console.log(err);
                }
            });
            client.end();

    }
}



// Load all rooms related to moodleRooom
async function loadFeedback(feedbackText) {
    const client = newPool();

    try {
        const results = await client.query(`SELECT feedbackText, json_agg(json_build_object('feedbackText', feedbackText
                                            , 'userid' , userid, 'username', username, 'moodleRoom', moodleRoom)) AS userid
                                            FROM   "feedbackLernflix"
                                            GROUP  BY feedbackText`, [feedbackText])

        var roomsFrontend = [];

        var roomLoadData = JSON.stringify(results.rows);
        var roomLoadDataObject = JSON.parse(roomLoadData);
        var innerArrayLength = roomLoadDataObject[0]["userid"].length;
        for (var i = 0; i < innerArrayLength; i++) {
            // console.log(roomLoadDataObject[0]["moodleroomname"][i]["lernflixroomname"])
            roomsFrontend.push(roomLoadDataObject[0]["userid"][i]["userid"]); // lernflix ids
            roomsFrontend.push(roomLoadDataObject[0]["userid"][i]["username"]); // lernflix roomnames
        }
        return roomsFrontend;

    } catch (e) {
        // TODO: Return an Error message to frontend
        console.log("Something went wrong " + e);
    } finally {
        await client.end();
    }
}

// Load all rooms related to moodleRooom
async function loadRooms(moodleroomid) {
    const client = newPool();

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
        // TODO: Return an Error message to frontend
        console.log("Something went wrong " + e);
    } finally {
        await client.end();
    }
}

// Save a new lernflixRoom related to a specific moodleRoom
// TODO: check if entered room-string is okay (check each letter etc)
async function saveRooms(userid, username, lernflixroomname, moodleroomid, moodleroomname) {
    var isSuccess = {
        success: false,
        message: "",
        lernflixroomname: "",
        lernflixroomid: 1234,
        moodleroomid: moodleroomid
    };
    // TODO: CHECK IF SOMETHING IS UNDEFINED ...
    //Datenbank Heroku Postgres Connection
    var timestamp = new Date();
    var allLernflixRoomNames = [];
    allLernflixRoomNames = await getAllLernflixRoomNames(moodleroomid);
    var allLernflixRoomIds = [];
    allLernflixRoomIds = await getAllLernflixRoomIds(moodleroomid);
    var newLernflixRoomId = generateNewLernflixRoomId(999999, allLernflixRoomIds);

    const client = newPool();

console.log("test von id" + moodleroomid);

       // (SELECT email IF(moodleroomid = $4) FROM moodledatauser)

    if (allLernflixRoomNames.includes(lernflixroomname)) {
        // TODO: Tell Frontend roomName already exists
        console.log("Room with Name " + lernflixroomname + " already exists")
        isSuccess.success = false;
        isSuccess.message = "Ein Raum mit dem Namen " + lernflixroomname + " existiert bereits. Bitte anderen Namen wählen";
        return isSuccess;
    } else {
        try {
            await client.query(`INSERT INTO rooms(lernflixroomid, lernflixroomname, moodleroomid, moodleroomname, timestamp) SELECT $1, $2, $3, $4, $5`, [newLernflixRoomId, lernflixroomname, moodleroomid, moodleroomname, timestamp]);
            console.log("Room " + lernflixroomname + " with ID " + newLernflixRoomId + " successfully stored in db");
            isSuccess.success = true;
            isSuccess.lernflixroomname = lernflixroomname;
            isSuccess.lernflixroomid = newLernflixRoomId;
            isSuccess.message = "Raum " + lernflixroomname + " wurde erfolgreich angelegt.";
            return isSuccess;
            // TODO: Put user into new room + message to frontend that room is created 
        } catch (error) {
            console.log("ERROR creating room " + lernflixroomname + " with ID " + newLernflixRoomId);
            // TODO: Tell Frontend error creating room occured
            isSuccess.success = false;
            isSuccess.message = "Es ist ein Fehler beim Anlegen des Raums " + lernflixroomname + " aufgetreten.";
            return isSuccess;
        } finally {
            client.end();
        }
    }
}
// TODO: Catch errors for frontend
async function getAllLernflixRoomNames(moodleroomid) {
    var allLernflixRoomNames = [];
    const client = newPool();
    // Get all room names of db
    try {
        const roomNamesInUsage = await client.query(`SELECT lernflixroomname FROM rooms WHERE moodleroomid =$1`, [moodleroomid]);
        var lernflixroomnamesInUsage = JSON.stringify(roomNamesInUsage.rows);
        var lernflixroomnamesInUsageObject = JSON.parse(lernflixroomnamesInUsage);
        var innerArrayLength = lernflixroomnamesInUsageObject.length;
        for (var i = 0; i < innerArrayLength; i++) {
            allLernflixRoomNames.push(lernflixroomnamesInUsageObject[i]["lernflixroomname"]) // add all room names to array
        }
        return allLernflixRoomNames;
    } catch (error) {
        return error;
    } finally {
        client.end();
    }
}
// TODO: Catch errors for frontend
async function getAllLernflixRoomIds(moodleroomid) {
    var allLernflixRoomIds = [];
    const client = newPool();
    try {
        // Get all room Ids
        const roomIDsInUsage = await client.query(`SELECT lernflixroomid FROM rooms WHERE moodleroomid =$1`, [moodleroomid]);
        var lernflixroomIdsInUsage = JSON.stringify(roomIDsInUsage.rows);
        var lernflixroomIdsInUsageObject = JSON.parse(lernflixroomIdsInUsage);
        var innerArrayLength = lernflixroomIdsInUsageObject.length;
        for (var i = 0; i < innerArrayLength; i++) {
            allLernflixRoomIds.push(lernflixroomIdsInUsageObject[i]["lernflixroomid"]) // add all room names to array
        }
        return allLernflixRoomIds;
    } catch (error) {
        return error;
    } finally {
        client.end();
    }
}

// Generates a new random ID for a new lernflix room. Ensures that ID is unique. Returns ID
function generateNewLernflixRoomId(upperBoundary, allLernflixRoomIds) {
    var randomNumber = Math.floor(Math.random() * upperBoundary) + 1;
    if (allLernflixRoomIds.includes(randomNumber)) {
        generateNewLernflixRoomId(upperBoundary, allLernflixRoomIds);
    } else {
        return randomNumber;
    }
}

// Datenbank Heroku Postgres Connection
function saveFeedback(userid, username, feedbackText, moodleRoom, moodleRoomName) {
    if (typeof userid !== 'undefined') {
        var timestamp = new Date();
        const client = newPool();

        client.query(`INSERT INTO "feedbackLernflix"( userid, username, feedbackText, moodleRoom, moodleRoomName, timestamp) SELECT $1, $2, $3, $4, $5, $6`, [userid, username, feedbackText, moodleRoom, moodleRoomName, timestamp], (err, res) => {
            if (err) {
                console.log("Feedback geht nicht SCHON VORHANDEN!");
                console.log(err);
            }
        });
        client.end();
    }
}

// Datenbank Heroku Postgres Connection
function saveProbandencode( userid, probandencode) {
    if (typeof userid !== 'undefined') {
        var timestamp = new Date();
        const client = newPool();

        client.query(`INSERT INTO "probandencode"( userid, probandencode) SELECT $1, $2`, [userid, probandencode], (err, res) => {


            if (err) {
                console.log("Probandencode kann nicht gespeichert werden");
                console.log(err);
            }
        });
        client.end();
    }
}

module.exports = {
    saveUser,
    loadRooms,
    saveRooms,
    saveFeedback,
    saveProbandencode,
    loadFeedback
}