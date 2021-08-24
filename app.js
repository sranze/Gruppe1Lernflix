require('dotenv').config()

const express = require('express'); // Express as webserverr
//const Filter = require('bad-words');
const PORT = process.env.PORT;
const socketIO = require('socket.io');
const path = require('path');
const { messageFormatter, welcomeMessage } = require('./backend/messages'); // make messages.js available
const { userJoin, getCurrentUser, userLeave } = require('./backend/users'); // make functions in users.js available
const { saveUser, loadRooms, saveRooms, saveFeedback, loadFeedback } = require('./backend/database'); // make database functions available
const { loadVideoInformation, saveVideoInformation } = require('./backend/videos'); // make room (video-information) functions available
const { loadFlags, saveFlag, removeFlag } = require('./backend/flags') // make flag functionalities available

const MOODLE_PROFILE_PICTURE1 = process.env.MOODLE_PROFILE_PICTURE1;
const MOODLE_PROFILE_PICTURE2 = process.env.MOODLE_PROFILE_PICTURE2;
const ANWENDERSCHLUESSEL = process.env.ANWENDERSCHLUESSEL;
const OEFFENTLICHERSCHLUESSEL = process.env.OEFFENTLICHERSCHLUESSEL;

//filter = new Filter();
//const extraFilterWords = require("./extra_words_filter.json");
//filter.addWords(...extraFilterWords);

var uuid = require("uuid4"); // used for session IDs
var lti = require("ims-lti"); // used to implement the actual LTI-protocol
var fs = require('fs'); // filesystem
const http = require('http'); // used by express (createserver), but direct access needed for socket-io
var index = fs.readFileSync("public/html/index.html", "utf8");

var app = express(); // create a new express server
const server = http.createServer(app); // Create new server object for io (socketio)

app.enable('trust proxy'); // Propably not necessary. Heroku App most likely doesnt run behind proxy??

var sessions = {}; // array contains info about different sessions

app.use(express.static(__dirname + '/public')); // serve the files out of ./public as our main files (css, js, html)

app.post("*", require("body-parser").urlencoded({ extended: true }));

var moodleFirstName, moodleLastName, moodleFullName, moodleEmail, moodleUserID, moodleProfilePicture, moodleRoom;



// OAuth Post
app.post("/auth", (req, res) => {
    var moodleData = new lti.Provider(ANWENDERSCHLUESSEL, OEFFENTLICHERSCHLUESSEL); // First is "Anwenderschlüssel" in Moodle. Second is "Öffentliches Kennwort"
    moodleData.valid_request(req, (err, isValid) => {
        if (!isValid) {
            // Sends user to authentication error site
            res.sendFile(path.join(__dirname + "/public/html/not_authenticated.html"));
            return;
        } else {
            var sessionID = uuid();

            sessions[sessionID] = moodleData;
            moodleFirstName = moodleData.body.lis_person_name_given;
            moodleLastName = moodleData.body.lis_person_name_family;
            moodleFullName = moodleFirstName + " " + moodleLastName;
            moodleEmail = moodleData.body.lis_person_contact_email_primary;
            moodleUserID = parseInt(moodleData.body.user_id);
            moodleProfilePicture = MOODLE_PROFILE_PICTURE1 + moodleUserID + MOODLE_PROFILE_PICTURE2;
            moodleRoom = moodleData.body.resource_link_id;
            moodleRoomName = moodleData.body.context_title;
            moodleContextId = moodleData.body.context_id;

            // Shows all available session data from Moodle in Server logs
            //console.log("\n\n\nAvailable Data:\n" + JSON.stringify(sessions));j

            // Send html Back, if authentication correct
            var sendMe = index.toString().replace("//PARAMS**GO**HERE",
                `           const params = {
							sessionID: "${sessionID}",
							user: "${moodleData.body.ext_user_username}",
                            username: "${moodleFirstName}",
                            userid: "${moodleUserID}",
                            moodleRoom: "${moodleRoom}",
                            moodleRoomName: "${moodleRoomName}",
                            moodleContextId: "${moodleContextId}",
                            url_picture: "${MOODLE_PROFILE_PICTURE1}${moodleUserID}${MOODLE_PROFILE_PICTURE2}"
						};
					`);

            // Save connected user to DB if not exists
            saveUser(moodleFirstName, moodleLastName, moodleFullName, moodleEmail, moodleUserID, moodleProfilePicture, moodleRoom);
            //saveFeedback(moodleUserID, moodleFullName, "Lol ein BeispielText", moodleRoom, moodleContextId);
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

// Sends user to logout site
app.get('/logout.html', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/html/logout.html"));
});

// Sends user to error site, if get request is sent to 404 pages
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/html/error_404.html"));
});

// start server on the specified port and binding host
server.listen(PORT, '0.0.0.0', function() {
    console.log("Server starting on " + PORT); // print a message when the server starts listening
});

const io = socketIO(server); // New socket-io object

// Runs when a user connects (and is authenticated)
io.on('connection', (socket) => {
    // Disconnect user if session parameters are undefined
    if (typeof moodleFirstName === 'undefined' || moodleFirstName == 'undefined' || moodleFirstName == undefined || moodleFirstName == null) {
        io.to(socket.id).emit('error', 'Etwas ist schief gelaufen. Bitte rufe Lernflix erneut aus Deinem LMS (z.B. Moodle) auf.');
        const user = userLeave(socket.id);
        if (user) console.log(user.username + ' disconnected from room ' + user.roomName + '.');
    } else {
        console.log("User " + moodleFirstName + " " + moodleUserID + ' connected' + "Summary " + socket.client.conn.server.clientsCount); // Log when Client connects to websockets




        // Load rooms and emit list of rooms to frontend
        (async() => {
            const roomInformation = await loadRooms(moodleRoom);

            io.to(socket.id).emit('welcome', welcomeMessage('System', `Willkommen zu Lernflix! Am oberen Bildschirmrand kannst Du Räume finden, denen Du beitreten kannst. Klicke einfach auf einen.\nWähle danach das Video aus.`, roomInformation));
            io.to(socket.id).emit('welcome', welcomeMessage('System', `Es sind aktuell ` socket.client.conn.server.clientsCount ` User online!`, roomInformation));
        })()

        // Join Room
        socket.on('joinRoom', ({ userid, username, roomName, roomId, moodleRoom }) => {
            console.log("User " + username + " " + userid + " joins Room: " + roomName + " " + roomId + " in Moodle Room " + moodleRoom);
            const user = userJoin(socket.id, userid, username, roomName, roomId, moodleRoom); // Get current userid, name and room

            socket.join(roomId); // Join the actual room
            socket.emit('message', messageFormatter('System', ('Hallo, ' + user.username + "! Du bist Raum " + user.roomName + " beigetreten."))); // Greet User | Welcome message to room
            socket.broadcast.to(user.roomId).emit('message', messageFormatter('System', (user.username + " ist dem Raum " + user.roomName + " beigetreten."))); // Broadcast when a user connects to room
            // Get currently playing Video-Info and tell client
            const videoInfo = loadVideoInformation(user.roomId);
            io.to(socket.id).emit('videoSync', videoInfo);
            // Load flags
            const flags = loadFlags(user.roomId, videoInfo.videoURL);
            io.to(user.roomId).emit('createFlags', flags);
        });

        // Create New Lernflix Room
        socket.on('createRoom', ({ userid, username, newLernflixRoomName, moodleRoom, moodleRoomName }) => {
            var isSuccess;
            (async() => {
                isSuccess = await saveRooms(userid, username, newLernflixRoomName, moodleRoom, moodleRoomName);
                if (isSuccess.success == true) {
                    // TODO: Join Room automatically

                    // Refresh room view for all clients
                    const roomInformation = await loadRooms(moodleRoom);
                    var moodleRoomId = isSuccess.moodleroomid;
                    const messagePayload = { roomInformation: roomInformation, moodleRoom: moodleRoomId }
                    io.emit('refreshRooms', messagePayload);
                    io.emit('createRoomSuccess', "Raum erfolgreich erstellt.");
                    io.to(socket.id).emit('error', isSuccess);
                } else {
                    console.log("Couldnt create room. Error: " + isSuccess.message);
                    io.to(socket.id).emit('error', isSuccess);
                }
            })()
        });

 // Create New Lernflix Room

        socket.on('createFeedback', ({ userid, username, feedbackText, moodleRoom, moodleRoomName }) => {
           /* var isSuccess;
            (async() => {
                isSuccess = await saveFeedback(userid, username, feedbackText, moodleRoom, moodleRoomName);
                //saveFeedback(moodleUserID, moodleFullName, "Lol ein BeispielText", moodleRoom, moodleContextId);
            })() */
            saveFeedback(userid, username, feedbackText, moodleRoom, moodleRoomName);
        });

        // Remove user from users-array and emit message
        socket.on('leaveRoom', () => {
            const user = userLeave(socket.id);
            socket.leave(user.roomId); // Kick user out of room
            if (user) {
                io.to(user.roomId).emit('message', messageFormatter('System', (user.username + ' hat den Raum ' + user.roomName + ' verlassen.'))); // Broadcast when a user leaves Room
                console.log("User " + user.username + " " + user.userid + ' disconnected.'); //Log when Client disconnects from websockets
            }
        });

        // Listen for chat messages and emit
        socket.on('chatMessage', message => {
            const user = getCurrentUser(socket.id)
            if (typeof user !== 'undefined') {
                console.log("User " + user.userid + " " + user.username + ": " + message + " to room: " + user.roomName + " with id: " + user.roomId);
                //io.to(user.roomId).emit('message', messageFormatter(user.username, filter.clean(message)));
                io.to(user.roomId).emit('message', messageFormatter(user.username, message));
            }
        });

        // Runs when user disconnects
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if (user) {
                io.to(user.roomId).emit('message', messageFormatter('System', (user.username + ' hat den Raum ' + user.roomName + ' verlassen.'))); // Broadcast when a user leaves Room
                console.log("User " + user.username + " with ID " + user.userid + ' disconnected from room ' + user.roomName + '.'); //Log when Client disconnects from websockets
            }
        });

        // Change Video
        socket.on('changeVideo', url => {

            const user = getCurrentUser(socket.id)
            if (typeof user !== 'undefined') {
                console.log("Changing Video in Room w/ ID " + user.roomId + " Video with URL " + url)
                io.to(user.roomId).emit('loadNewVideo', url);
            }
            // Load flags
            const flags = loadFlags(user.roomId, url);
            io.to(user.roomId).emit('createFlags', flags);
        })

        // Play video
        socket.on('playVideo', () => {
            const user = getCurrentUser(socket.id)
            if (typeof user !== 'undefined') {
                console.log("Playing Video in Room w/ ID " + user.roomId)
                io.to(user.roomId).emit('playVideo');
            }
        })

        // Pause video
        socket.on('pauseVideo', () => {
            const user = getCurrentUser(socket.id)
            if (typeof user !== 'undefined') {
                console.log("Pausing Video in Room w/ ID " + user.roomId)
                io.to(user.roomId).emit('pauseVideo');
            }
        })

        // Skip time video
        socket.on('skipTimeVideo', time => {
            // Send Skip Time command to all clients of room
            const user = getCurrentUser(socket.id)
            if (typeof user !== 'undefined') {
                console.log("Skipping Time in Video in Room w/ ID " + user.roomId + " to Time " + time)
                io.to(user.roomId).emit('skipTimeVideo', time);
            }
        })

        // Updates video Information (time etc.) on heap
        socket.on('updateVideoInfo', videoInformation => {
            if (videoInformation.videoURL !== 'undefined' && videoInformation.videoURL !== 'null') {
                saveVideoInformation(videoInformation);
            }
        })

        // Adds flag to heap, specific to videoURL and roomID
        socket.on('addFlag', flagInformation => {
            const user = getCurrentUser(socket.id)
            if (typeof user !== 'undefined') {
                if (flagInformation !== 'undefined') {
                    console.log("Received Flag information: RoomID: " + flagInformation.roomID + " Current Time: " + flagInformation.videoTime + " Video URL: " + flagInformation.videoURL + " Annotation: " + flagInformation.annotation);
                    saveFlag(flagInformation);
                }
                // Load flags
                const flags = loadFlags(user.roomId, flagInformation.videoURL);
                io.to(user.roomId).emit('updateFlags', flags);
            }
        })

        // Removes Flag from Heap
        socket.on('removeFlag', flagInformation => {
            const user = getCurrentUser(socket.id)
            if (typeof flagInformation.videoURL !== 'undefined' && typeof flagInformation.videoTime !== 'undefined' && typeof user !== 'undefined') {
                // Remove flag
                removeFlag(user.roomId, flagInformation);
                // Load/Update flags
                const flags = loadFlags(user.roomId, flagInformation.videoURL);
                io.to(user.roomId).emit('updateFlags', flags);
            } else {
                var isSuccess = { message: "Ein Fehler ist beim Entfernen der Flagge aufgetreten.", isSuccess: false };
                io.to(socket.id).emit('error', isSuccess);
            }
        })

        // Feedback
        socket.on('createFeedback', ({ userid, username, feedbackText, moodleRoom, moodleRoomName }) => {
            /* var isSuccess;
             (async() => {
                 isSuccess = await saveFeedback(userid, username, feedbackText, moodleRoom, moodleRoomName);
                 //saveFeedback(moodleUserID, moodleFullName, "Lol ein BeispielText", moodleRoom, moodleContextId);
             })() */
            saveFeedback(userid, username, feedbackText, moodleRoom, moodleRoomName);
        });
    }
});