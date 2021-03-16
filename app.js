const express = require('express'); // Express as webserver
const PORT = process.env.PORT || 3000;
const socketIO = require('socket.io');
const path = require('path');
const messageFormatter = require('./backend/messages'); // make messages.js available
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./backend/users'); // make functions in users.js available
const { saveUser, loadRooms, loadUser, saveRooms } = require('./backend/database'); // make database functions available

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
    var moodleData = new lti.Provider("3=((gMW7aqH[ZzKr", "Wt3A6Ts8mYjxV25v"); // First is "Anwenderschlüssel" in Moodle. Second is "Öffentliches Kennwort"
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
            moodleProfilePicture = "https://elearning.hs-ruhrwest.de/user/pix.php/" + moodleUserID + "/f1.jpg";
            moodleRoom = moodleData.body.resource_link_id;
            moodleRoomName = moodleData.body.context_title;
            lernflixroomid = "666";
            lernflixroomname = "EIn neuen Test Raum";
            // Load all Rooms according to moodleRoom user is from
            loadRooms(moodleRoom);
            saveRooms(lernflixroomid, lernflixroomname, moodleRoom, moodleRoomName);
            // Shows all available session data from Moodle in Server logs
            //console.log("\n\n\nAvailable Data:\n" + JSON.stringify(sessions));

            // Send html Back, if authentication correct
            var sendMe = index.toString().replace("//PARAMS**GO**HERE",
                `
						const params = {
							sessionID: "${sessionID}",
							user: "${moodleData.body.ext_user_username}",
                            username: "${moodleFirstName}",
                            userid: "${moodleUserID}",
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
    console.log(moodleFirstName + ' connected'); // Log when Client connects to websockets
    socket.emit('message', messageFormatter('System', `Willkommen zu Lernflix! Am oberen Bildschirmrand kannst Du Räume finden, denen Du beitreten kannst. Klicke einfach auf einen.\nWenn Du einen Raum wechseln möchtest, klicke einfach auf einen anderen.`));
    socket.on('joinRoom', ({ userid, username, roomName }) => {
        const user = userJoin(socket.id, userid, username, roomName); // Get current userid, name and room

        socket.join(user.room); // Join the actual room

        socket.emit('message', messageFormatter('System', ('Hallo, ' + user.username + "! Du bist Raum " + user.room + " beigetreten."))); // Greet User | Welcome message to room

        socket.broadcast.to(user.room).emit('message', messageFormatter('System', (user.username + " ist dem Raum " + user.room + " beigetreten."))); // Broadcast when a user connects to room

    });

    // Remove user from users-array and emit message
    socket.on('leaveRoom', () => {
        const user = userLeave(socket.id);
        socket.leave(user.room); // Kick user out of room
        if (user) {
            io.to(user.room).emit('message', messageFormatter('System', (user.username + ' hat den Raum ' + user.room + ' verlassen.'))); // Broadcast when a user leaves Room
            console.log(user.username + ' disconnected.'); //Log when Client disconnects from websockets
        }
    })

    // Listen for chat messages and emit
    socket.on('chatMessage', message => {
        const user = getCurrentUser(socket.id)
        console.log(message);
        io.to(user.room).emit('message', messageFormatter(user.username, message));
    });

    // Runs when user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', messageFormatter('System', (user.username + ' hat den Raum ' + user.room + ' verlassen.'))); // Broadcast when a user leaves Room
            console.log(user.username + ' disconnected from room ' + user.room + '.'); //Log when Client disconnects from websockets
        }
    });
});