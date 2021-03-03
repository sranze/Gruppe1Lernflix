var express = require('express'); // Express as webserver

var cfenv = require('cfenv'); // cfenv provides access to your Cloud Foundry environment, e.g.: port, http binding host name/ip address, URL of the application

var uuid = require("uuid4"); // is used for session IDs
var lti = require("ims-lti"); // is used to implement the actual LTI-protocol

var fs = require('fs'); // filesystem
var index = fs.readFileSync("index.html", "utf8");

var app = express(); // create a new express server

app.enable('trust proxy'); // Propably not necessary. Heroku App most likely doesnt run behind proxy??

var sessions = {}; // array contains info about different sessions

app.use(express.static(__dirname + '/public')); // serve the files out of ./public as our main files

app.post("*", require("body-parser").urlencoded({extended: true}));

// OAuth
app.post("/auth", (req, res) => {	
	var moodleData = new lti.Provider("top", "secret"); // 
	moodleData.valid_request(req, (err, isValid) => {
		if (!isValid) {
			res.send("Invalid request: " + err);
			return ;
		}
		
		var sessionID = uuid();
		sessions[sessionID] = moodleData;

        // Shows all available session data from Moodle in Server logs
        console.log("\n\n\nAvailable Data:\n" + JSON.stringify(sessions));
	
		var sendMe = index.toString().replace("//PARAMS**GO**HERE",
				`
					const params = {
						sessionID: "${sessionID}",
						user: "${moodleData.body.ext_user_username}"
					};
				`);

		res.setHeader("Content-Type", "text/html");
		res.send(sendMe);
	});   
	
});       

var appEnv = cfenv.getAppEnv(); // Get app env

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url); // print a message when the server starts listening
});