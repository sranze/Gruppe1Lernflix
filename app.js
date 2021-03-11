const express = require('express'); // Express as webserver
const PORT = process.env.PORT || 3000;
const socketIO = require('socket.io');
const INDEX = '/public/html/index.html';
const path = require('path');
const cfenv = require('cfenv'); // cfenv provides access to your Cloud Foundry environment, e.g.: port, http binding host name/ip address, URL of the application
const messageFormatter = require('./backend/messages'); // make messages.js available
const { userJoin, getCurrentUser } = require('./backend/users'); // make functions in users.js available
const { saveUser } = require('./backend/database');


var uuid = require("uuid4"); // is used for session IDs
var lti = require("ims-lti"); // is used to implement the actual LTI-protocol
var fs = require('fs'); // filesystem
const http = require('http'); // used by express (createserver), but direct access needed for socket-io
var index = fs.readFileSync("public/html/index.html", "utf8");

var app = express(); // create a new express server
const server = http.createServer(app); // Create new server object for io (socketio)

app.enable('trust proxy'); // Propably not necessary. Heroku App most likely doesnt run behind proxy??

var sessions = {}; // array contains info about different sessions

app.use(express.static(__dirname + '/public')); // serve the files out of ./public as our main files (css, js, html)

app.post("*", require("body-parser").urlencoded({ extended: true }));

var moodleUsername;
var moodleFirstName, moodleLastName, moodleFullName, moodleEmail, moodleUserID, moodleProfilePicture, moodleRoom;

// OAuth Post
app.post("/auth", (req, res) => {
    var moodleData = new lti.Provider("3=((gMW7aqH[ZzKr", "Wt3A6Ts8mYjxV25v"); // First is "Anwenderschlüssel" in Moodle. Second is "Öffentliches Kennwort"
    moodleData.valid_request(req, (err, isValid) => {
        if (!isValid) {
            // Sends user to authentication error site
            res.sendFile(path.join(__dirname + "/public/html/not_authenticated.html"));
            return;
        } else {
            var sessionID = uuid();

            sessions[sessionID] = moodleData;
            moodleUsername = moodleData.body.lis_person_name_given;
            moodleFirstName = moodleData.body.lis_person_name_given;
            moodleLastName = moodleData.body.lis_person_name_family;
            moodleFullName = moodleFirstName + moodleLastName;
            moodleEmail = moodleData.body.lis_person_contact_email_primary;
            moodleUserID = moodleData.body.user_id;
            moodleProfilePicture = "https://elearning.hs-ruhrwest.de/user/pix.php/" + moodleUserID + "/f1.jpg";
            moodleRoom = moodleData.body.resource_link_id;

            // Shows all available session data from Moodle in Server logs
            //console.log("\n\n\nAvailable Data:\n" + JSON.stringify(sessions));

            // Send html Back, if authentication correct
            var sendMe = index.toString().replace("//PARAMS**GO**HERE",
                `
						const params = {
							sessionID: "${sessionID}",
							user: "${moodleData.body.ext_user_username}",
                            url_picture: "https://elearning.hs-ruhrwest.de/user/pix.php/${moodleUserID}/f1.jpg"
						};
					`);

            // Save connected user to DB if not exists
            saveUser(moodleFirstName, moodleLastName, moodleFullName, moodleEmail, moodleUserID, moodleProfilePicture, moodleRoom);
            res.setHeader("Content-Type", "text/html");
            res.send(sendMe);
        }
    });
});



// Sends user to not authenticated site, if get request is sent
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/html/not_authenticated.html"));
    //res.sendFile(path.join(__dirname + "/public/html/index.html"));
});
// Sends user to not authenticated site, if get request to /auth is sent
app.get('/auth', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/html/not_authenticated.html"));
});
/*
// Sends user to error site, if get request is sent to 404 pages
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/html/error_404.html"));
}); */


// start server on the specified port and binding host
server.listen(PORT, '0.0.0.0', function() {
    console.log("Server starting on " + PORT); // print a message when the server starts listening
});

'use strict';

const io = socketIO(server); // New socket-io object

// Runs when a client connects (and is authenticated)
io.on('connection', (socket) => {
    console.log(moodleUsername + ' connected'); // Log when Client connects to websockets

    socket.emit('message', messageFormatter('System', ('Welcome to Lernflix, ' + moodleUsername + "!"))); // Greet User | Welcome message

    socket.broadcast.emit('message', messageFormatter('System', (moodleUsername + " ist dem Raum beigetreten."))); // Broadcast when a user connects to room

    socket.on('disconnect', () => {
        io.emit('message', messageFormatter('System', (moodleUsername + ' hat den Raum verlassen.'))); // Broadcast when a user leaves Room
        console.log(moodleUsername + ' disconnected.'); //Log when Client disconnects from websockets
    });

    // Listen for chat messages
    socket.on('chatMessage', message => {
        console.log(message);
        io.emit('message', messageFormatter(moodleUsername, message));
    });
});

/*
// ROOM STUFF
// Runs when a client connects (and is authenticated)
io.on('connection', (socket) => {
    console.log(moodleUsername + ' connected'); // Log when Client connects to websockets

    // Handle joining a Room
    socket.on('joinRoom', connectionObject => { // TODO connectionObject needs to be "real" out of PostgreSQL DB
        const user = userJoin(socket.id, connectionObject.username, connectionObject.roomName);

        socket.join(user.room);

        socket.emit('message', messageFormatter('System', ('Welcome to Lernflix, ' + moodleUsername + "!"))); // Greet User | Welcome message

        //socket.broadcast.to(user.room).emit('message', messageFormatter('System', (moodleUsername + " ist dem Raum beigetreten."))); // Broadcast when a user connects to room
        socket.broadcast.emit('message', messageFormatter('System', (moodleUsername + " ist dem Raum beigetreten."))); // Broadcast when a user connects to room
    });

    // Listen for chat messages
    socket.on('chatMessage', message => {
        console.log(message);
        io.emit('message', messageFormatter(moodleUsername, message));
    });

    // Broadcast when a user leaves Room
    socket.on('disconnect', () => {
        io.emit('message', messageFormatter('System', (moodleUsername + ' hat den Raum verlassen.')));
        console.log(moodleUsername + ' disconnected.'); //Log when Client disconnects from websockets
    });
}); */