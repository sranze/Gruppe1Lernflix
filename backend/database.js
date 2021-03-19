const { Pool } = require('pg');

// Create new Pool to db
function newPool() {
    const client = new Pool({
        connectionString: "postgres://tlppibizshslwr:a265b4540ba66642ff7edb6037431ade0539827f8241a165c4b7067a383717ae@ec2-54-90-13-87.compute-1.amazonaws.com:5432/d6ik9ccj4jges7v",
        ssl: {
            rejectUnauthorized: false
        }
    });
    return client;
}

// TODO: Fehlerbehandlung
// TODO: Asynchron umschreiben
// Saves an authenticated user to database, if not exists
function saveUser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom) {
    // Datenbank Heroku Postgres Connection
    // TODO: Anmerkung Andre: Kann man diesen Prozess auslagern und bei jedem Query aufrufen? (ich weiß es nicht)
    // TODO: Check if something is undefined
    var timestamp = new Date();
    const client = newPool();

    client.query(`INSERT INTO moodledatauser(firstname, lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp) SELECT $1, $2, $3, $4, $5, $6, $7, $8 WHERE NOT EXISTS (SELECT * FROM moodledatauser WHERE userid = $5)`, [firstname, lastname, fullname, email, userid, profilepicture, moodleRoom, timestamp], (err, res) => {
        if (err) {
            console.log("USER SCHON VORHANDEN!");
            console.log(err);
        }
    });
    console.log("User created");
    client.end();
}

// Load all rooms related to moodleRooom
async function loadRooms(moodleroomid) {
    // TODO: auslagern
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
    console.log("Moodleroomid: " + moodleroomid)
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
module.exports = {
    saveUser,
    loadRooms,
    saveRooms
}