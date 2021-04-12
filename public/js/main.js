require('dotenv').config()

// Chat references
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Websocket
const socket = io(); // New socket object
var didJoin = false;

// Videoplayer references
const videoplayer = document.getElementById('videoplayer');
const videoplayerSeekslider = document.getElementById('seekslider');
let videoplayerTimeText = document.getElementById('videoplayerTimeText');

const flagImg = new Image();
flagImg.src = "../assets/illustrations/flag_black_24dp.svg";

// Videoplayer event listener
videoplayer.addEventListener('timeupdate', seekTimeSliderUpdate, false);
videoplayerSeekslider.addEventListener('change', skipToTime, false);

let lernflixRoomID;

// Join and switch between rooms
function joinRoom(roomName, roomId) {
    if (!didJoin) {
        // Join new room
        var userid = params.userid;
        var username = params.username;
        var moodleRoom = params.moodleRoom;
        lernflixRoomID = roomId;
        socket.emit('joinRoom', { userid, username, roomName, roomId, moodleRoom });

        didJoin = true;
        $("#lernflixRoomName").text(roomName);
    } else {
        // "Switch" rooms
        socket.emit('leaveRoom'); // Remove user from users array
        lernflixRoomID = roomId;
        didJoin = false;
        joinRoom(roomName, roomId);
        $("#lernflixRoomName").text(roomName);
    }
}

// Message from server
socket.on('message', message => {
    showMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down in chat
});

// Welcome message
socket.on('welcome', message => {
    showMessage(message);

    showRooms(message.rooms);
    getVideos(params.moodleContextId);
});

// TODO: Create Success message
socket.on('createRoomSuccess', message => {
    console.log(message);
});

// Log error messages
socket.on('error', message => {
    createSystemNotification(message, message.success);

});

// Refresh/Reload room view
socket.on('refreshRooms', (messagePayload) => {
    if (messagePayload.moodleRoom == params.moodleRoom) {
        const rooms = document.getElementById('rooms');
        while (rooms.firstChild) {
            rooms.removeChild(rooms.lastChild);
        }
        showRooms(messagePayload.roomInformation);
    }
})

// Submit/Send message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop default submission to file

    const message = e.target.elements.msg.value; // Get message value (string)

    socket.emit('chatMessage', message); // Emit message to backend

    document.getElementById('msg').value = ''; // Clear input textfield
    document.getElementById('msg').focus(); // Focus on latest message
});

// Show message in DOM (chat window)
function showMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
        if (message.messageFrom == "System") {

         div.innerHTML = `<p class="meta">${message.messageFrom} <span>${message.time}</span></p>
            <p class="text">
                ${message.text}
            </p>`;
            div.style.background = "#f8f5f1";
            document.querySelector('.chat-messages').appendChild(div);

        }
        else {

         div.innerHTML = `<p class="meta">${message.messageFrom} <span>${message.time}</span></p>
            <p class="text">
                ${message.text}
            </p>`;
            document.querySelector('.chat-messages').appendChild(div);

        }

};

// Show rooms in DOM
function showRooms(rooms) {
    var roomName = "PLACEHOLDER";
    var roomId = 1234;
    for (var i = 0; i < rooms.length; i += 2) {
        roomName = rooms[i + 1];
        roomId = rooms[i];

        var button = document.createElement('button');
        var bText = document.createTextNode(roomName);

        button.setAttribute('id', rooms[i]);
        button.appendChild(bText);
        button.setAttribute('class', 'btn btn-primary')

        button.onclick = function() { joinRoom(this.childNodes[0].nodeValue, this.id); };

        var src = document.getElementById("rooms");
        src.appendChild(button);
    }
}



// Create new Room
function createRoom() {
    var userid = params.userid;
    var username = params.username;
    var moodleRoom = params.moodleRoom;
    var moodleRoomName = params.moodleRoomName;
    var newLernflixRoomName = document.getElementById('createRoomInputTextField').value;
    socket.emit('createRoom', { userid, username, newLernflixRoomName, moodleRoom, moodleRoomName })
}

// Get request for videos
function getVideos(moodleContextId) {
    var message = { message: "Es konnten keine Videos geladen werden. Bitte schließe die Seite und versuche es erneut." }
    if (typeof moodleContextId === 'undefined') createSystemNotification(message, false);

    const url = "https://opencast-engage.hs-rw.de/search/episode.json?q=" + moodleContextId

}

//Join room über Button
function callJoinRoom() {
  var selectedRoom = $("button.selected");
  var roomName = selectedRoom.text();
  var roomID = selectedRoom.attr("id")
  if(roomName == ""){
    alert("Dieser Raum existiert nicht!");
  }
  else{
  selectedRoom.removeClass("selected");
  $("#searchRooms").val("");;
  joinRoom(roomName, roomID)
  }
}

//select Room
function selectRoom() {
  //Searchbar
  var searchbar = $(".search_room input")
  //Wenn auf einem "Raumbutton" geklickt wird.
  $("button.dropdown-item").click(function () {
    $("button.dropdown-item").removeClass("selected")
    $(this).addClass("selected")
    var roomName = $(this).text();
    //setzt raumnamen in die Suchleiste
    searchbar.val(roomName);
  });

}



// Creates HTML for error or success system notifications
function createSystemNotification(message, isSuccess) {
    const div = document.createElement('div');
    var errorMessage = message.message;
    div.classList.add('alert');
    div.classList.add('alert-dismissible');
    if (isSuccess == true) {
        div.classList.add('alert-success');
        div.innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Erfolg</strong> ${errorMessage}`;
    } else {
        if (typeof errorMessage === 'undefined') errorMessage = "Unbekannter Fehler. Bitte schließen Sie diesen Tab und öffnen Sie Lernflix erneut."
        div.classList.add('alert-danger');
        div.innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Fehler</strong> ${errorMessage}`;
    }
    div.classList.add('fade-in');

    var src = document.getElementById("error");
    src.appendChild(div);
}

// Emit change of video to server
function changeVideo(url) {
    socket.emit('changeVideo', url);
}

// Change video
socket.on('loadNewVideo', url => {

    videoplayer.setAttribute('src', url);
    videoplayer.controls = false;
    videoplayer.play();
    videoplayer.onloadedmetadata = function() {
        var videoInfo = getVideoInfo();
        socket.emit('updateVideoInfo', videoInfo);
    }
})

// Pause video - html listener
function pauseVideo() {
    socket.emit('pauseVideo');
}

// Play video - html listener
function playVideo() {
    socket.emit('playVideo');
}

// Pause video - socket
socket.on('playVideo', () => {
    videoplayer.play();
    var videoInfo = getVideoInfo();
    socket.emit('updateVideoInfo', videoInfo);
})

// Play video - socket
socket.on('pauseVideo', () => {
    videoplayer.pause();
    // TODO Update Video on Heap
    var videoInfo = getVideoInfo();
    socket.emit('updateVideoInfo', videoInfo);
})

// Skip time - html listener
function skipToTime() {
    var jumpToTime = videoplayer.duration * (videoplayerSeekslider.value / 100);
    socket.emit('skipTimeVideo', jumpToTime)
}

// Skip time - socket
socket.on('skipTimeVideo', time => {
    videoplayer.currentTime = time;
    // TODO Update Video on Heap
    var videoInfo = getVideoInfo();
    socket.emit('updateVideoInfo', videoInfo);
})

// Set volume
function setVolume(volume) {
    videoplayer.volume = volume / 100;
}

// Update seek time slider 
function seekTimeSliderUpdate() {
    var sliderValue = videoplayer.currentTime * (100 / videoplayer.duration);
    videoplayerSeekslider.value = sliderValue;
    var currentMinutes = Math.floor(videoplayer.currentTime / 60);
    var currentSeconds = Math.floor(videoplayer.currentTime - currentMinutes * 60);
    var durationMinutes = Math.floor(videoplayer.duration / 60);
    var durationSeconds = Math.floor(videoplayer.duration - durationMinutes * 60);
    if (currentSeconds < 10) currentSeconds = '0' + currentSeconds;
    if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;

    videoplayerTimeText.innerHTML = currentMinutes + ':' + currentSeconds + '/' + durationMinutes + ':' + durationSeconds;
}

// Sync video on room join
socket.on('videoSync', video => {
    videoplayer.setAttribute('src', video.videoURL);

    // Play video at specific time if is still playing
    let currentTime = (Date.now() / 1000);
    let maxDurationTime = video.videoTime + currentTime;
    let actualDurationTime = video.videoOffset + currentTime;
    let timeVideoStarted = video.timestamp;
    let actualPlayTime;
    if (actualDurationTime < maxDurationTime) {
        if (video.isPaused == false) {
            actualPlayTime = (currentTime - timeVideoStarted) + video.videoOffset;
        } else {
            actualPlayTime = video.videoOffset;
        }
        videoplayer.currentTime = actualPlayTime;
        video.isPaused == true ? videoplayer.pause() : videoplayer.play();
    } else {
        videoplayer.currentTime = 0;
        videoplayer.pause();
    }
    videoplayer.controls = false;
});

// Gets video information, returns obj with info
function getVideoInfo() {
    var isPaused = videoplayer.paused;
    if (isPaused == undefined) isPaused = true;
    const videoObject = {
        roomID: lernflixRoomID,
        videoURL: videoplayer.src,
        videoTime: videoplayer.duration,
        videoOffset: videoplayer.currentTime,
        timestamp: (Date.now() / 1000),
        isPaused: isPaused
    }
    return videoObject;
}

// Adds flag
function addFlag() {
    let roomID = lernflixRoomID;
    let videoTime = videoplayer.currentTime;
    let annotation = document.getElementById('flagAnnotation').value;
    let videoURL = videoplayer.src;
    let creator = params.userid;
    let flagInformation = {
            roomID: roomID,
            creator: creator,
            videoTime: videoTime,
            videoURL: videoURL,
            annotation: annotation,
        }
        // TODO: Error handling if something is undefined or empty
    socket.emit('addFlag', flagInformation);
}

// Updates flags
socket.on('updateFlags', flags => {
    var flagCanvas = document.getElementById('flagsCanvas');
    var flagCanvasctx = flagCanvas.getContext("2d")
    flagCanvasctx.clearRect(0, 0, flagCanvas.width, flagCanvas.height);
    var oneSecondLength = videoplayerSeekslider.offsetWidth / videoplayer.duration;
    var positionOnCanvas = 0;
    flagCanvas.width = videoplayerSeekslider.offsetWidth;
    flagCanvas.height = videoplayerSeekslider.offsetHeight * 0.75;
    // TODO: Show flags on videoplayer, update flags (visually)
    // TODO: Create functionality for flags on videoplayer
    console.log("Flags:")
    for (var i = 0; i < flags.length; i++) {
        console.log("Flags in der Schleife " + flags[i])
        positionOnCanvas = flags[i].videoTime * oneSecondLength;
        flagCanvasctx.drawImage(flagImg, positionOnCanvas, 0);
    }
})

// Prepares information for flag modallable
function loadFlagModal() {
    let videoPreview = document.getElementById('videoPreview');
    var canvas = capture(videoplayer);
    canvas.onclick = function() {
        window.open(this.toDataURL());
    };
    videoPreview.innerHTML = '';
    videoPreview.appendChild(canvas);
}

// Captures Video Preview
function capture(video) {
    const scaleFactor = 0.5;
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    return canvas;
}