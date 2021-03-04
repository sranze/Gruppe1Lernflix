const express = require('express'); // Express as webserver
const PORT = process.env.PORT || 3000;
const socketIO = require('socket.io');
const INDEX = '/public/html/index.html';
const path = require('path');
const cfenv = require('cfenv'); // cfenv provides access to your Cloud Foundry environment, e.g.: port, http binding host name/ip address, URL of the application


var uuid = require("uuid4"); // is used for session IDs
var lti = require("ims-lti"); // is used to implement the actual LTI-protocol
var fs = require('fs'); // filesystem
const http = require('http');
var index = fs.readFileSync("public/html/index.html", "utf8");

var app = express(); // create a new express server
const server = http.createServer(app); // Create new server object for io (socketio)

app.enable('trust proxy'); // Propably not necessary. Heroku App most likely doesnt run behind proxy??

var sessions = {}; // array contains info about different sessions

app.use(express.static(__dirname + '/public')); // serve the files out of ./public as our main files (css, js, html)

app.post("*", require("body-parser").urlencoded({ extended: true }));

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

            // Shows all available session data from Moodle in Server logs
            console.log("\n\n\nAvailable Data:\n" + JSON.stringify(sessions));

            // Send html Back, if authentication correct
            var sendMe = index.toString().replace("//PARAMS**GO**HERE",
                `
						const params = {
							sessionID: "${sessionID}",
							user: "${moodleData.body.ext_user_username}"
						};
					`);

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
// Sends user to error site, if get request is sent to 404 pages
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/html/error_404.html"));
});

//var appEnv = cfenv.getAppEnv(); // Get app env

// start server on the specified port and binding host
server.listen(PORT, '0.0.0.0', function() {
    console.log("server starting on " + PORT); // print a message when the server starts listening
});

'use strict';

//const express = require('express');
//const PORT = process.env.PORT || 3000;
/*
 const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
*/
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);




//Web Socket with ws package (old)
/*
//const { Server } = require('ws');
const { Server } = require('ws');
const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
});



setInterval(() => {
    wss.clients.forEach((client) => {
        client.send(new Date().toTimeString());
    });
}, 1000);

*/
