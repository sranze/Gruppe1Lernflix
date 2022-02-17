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

let roomsShown = false;

const flagImg = new Image();
flagImg.src = "../assets/illustrations/Icon feather-flag.svg";

// Canvas (flags) 
let flagCanvas = document.getElementById('flagsCanvas');
let flagCanvasctx = flagCanvas.getContext("2d")
flagCanvas.width = videoplayer.offsetWidth;
flagCanvas.height = 25;
let flagsPositions = [],
  tippyFlagTooltips = [];

flagCanvas.addEventListener("mousemove", function (e) {
  var rect = flagCanvas.getBoundingClientRect();
  var canvasX = Math.round(e.clientX - rect.left); // Subtract the 'left' of the canvas 
  var canvasY = Math.round(e.clientY - rect.top); // from the X/Y positions to make  
  mouseWithinFlag(canvasX, canvasY);
});

// Videoplayer event listener
videoplayer.addEventListener('timeupdate', seekTimeSliderUpdate, false);
videoplayerSeekslider.addEventListener('change', skipToTime, false);

let lernflixRoomID;

// Join and switch between rooms
function joinRoom(roomName, roomId) {
  flagCanvasctx.clearRect(0, 0, flagCanvas.width, flagCanvas.height);
  if (!didJoin) {
    // Join new room
    var userid = params.userid;
    var username = params.username;
    var moodleRoom = params.moodleRoom;
    lernflixRoomID = roomId;
    socket.emit('joinRoom', {
      userid,
      username,
      roomName,
      roomId,
      moodleRoom
    });

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

  if (roomsShown == false) {
    showRooms(message.rooms);
  }
  roomsShown = true;

  getVideos(params.moodleContextId);
});

// Success on Room Creation
socket.on('createRoomSuccess', message => {
  createSystemNotification(message, true);
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
    console.log("Ich gehe in die refreshRooms Funktion rein");
    showRooms(messagePayload.roomInformation);
  }
})

// Enable Chat
socket.on('enableOnJoin', message => {
  document.getElementById("msg").disabled = false;
  document.getElementById("addVideo").disabled = false;
  document.getElementById("videoControls").style.display = "inherit";
  document.getElementById("videoElements").stylwe.display = "inherit";

});

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

  if (message.messageFrom == "System") {
    const div = document.createElement('div');
    div.classList.add('system-message');

    div.innerHTML = `<p class="meta">${message.messageFrom} <span>${message.time}</span></p>
            <p class="text">
                ${message.text}
            </p>`;
    div.style.background = "#212238";
    document.querySelector('.chat-messages').appendChild(div);

  } else {
    const div = document.createElement('div');
    div.classList.add('user-message');

    div.innerHTML = `<p class="meta">${message.messageFrom} <span>${message.time}</span></p>
            <p class="text">
                ${message.text}
            </p>`;
    document.querySelector('.chat-messages').appendChild(div);

  }

};




// Show rooms in DOM
function showRooms(rooms) {
  console.log("0i" + rooms);
  if (rooms !== undefined) {
    var roomName = "PLACEHOLDER";
    var roomId = 1234;
    console.log("0" + rooms.length);
    for (var i = 0; i < rooms.length; i += 2) {
      console.log("1" + roomName);
      roomName = rooms[i + 1];
      console.log("2" + roomName);
      roomId = rooms[i];
      console.log("3" + roomId);



      var userInRoom =
        '                  <div id="userInRoom">' +
        '                    <span class="countUser">3</span>' +
        '                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15.111" viewBox="0 0 17 15.111">' +
        '                      <path id="Icon_metro-users" data-name="Icon metro-users" d="M13.9,16.515v-.779a4.218,4.218,0,0,0,1.889-3.51c0-2.347,0-4.25-2.833-4.25s-2.833,1.9-2.833,4.25a4.218,4.218,0,0,0,1.889,3.51v.779c-3.2.262-5.667,1.836-5.667,3.739H19.571c0-1.9-2.463-3.477-5.667-3.739Zm-6.5.365a8.973,8.973,0,0,1,2.948-1.187,5.328,5.328,0,0,1-.6-.871,5.408,5.408,0,0,1-.686-2.6,8.386,8.386,0,0,1,.452-3.45,3.075,3.075,0,0,1,2.35-1.763c-.25-1.129-.914-1.87-2.683-1.87-2.833,0-2.833,1.9-2.833,4.25A4.218,4.218,0,0,0,8.238,12.9v.779c-3.2.262-5.667,1.836-5.667,3.739H6.689a6.05,6.05,0,0,1,.711-.541Z" transform="translate(-2.571 -5.143)" />' +
        '                    </svg>' +
        '' +
        '                  </div>'

      var listItem = document.createElement("div");
      listItem.setAttribute("class", "listItem")

      var button = document.createElement('button');
      button.setAttribute('id', rooms[i]);
      var bText = document.createTextNode(roomName);
      button.appendChild(bText);
      button.setAttribute('class', 'btn btn-primary')
      button.onclick = function () {
        joinRoom(this.childNodes[0].nodeValue, this.id);
      };

      button.insertAdjacentHTML("beforeend", userInRoom);
      listItem.appendChild(button)

      var src = document.getElementById("rooms");
      src.appendChild(listItem)

    }
  } else {
    console.log("Servus, das Problem wurde gefixt")
  }
}

// Create new Room
function createRoom() {
  var userid = params.userid;
  var username = params.username;
  var moodleRoom = params.moodleRoom;
  var moodleRoomName = params.moodleRoomName;
  var newLernflixRoomName = document.getElementById('createRoomInputTextField').value;
  socket.emit('createRoom', {
    userid,
    username,
    newLernflixRoomName,
    moodleRoom,
    moodleRoomName
  })

  var safetyCheckRoom = 1;
}

// Create new Feedback
function createFeedback() {
  var userid = params.userid;
  var username = params.username;
  var moodleRoom = params.moodleRoom;
  var moodleRoomName = params.moodleRoomName;
  var feedbackText = document.getElementById('createFeedbackForLernflix').value;
  socket.emit('createFeedback', {
    userid,
    username,
    feedbackText,
    moodleRoom,
    moodleRoomName
  })
}

// Get request for videos
function getVideos(moodleContextId) {
  var message = {
    message: "Es konnten keine Videos geladen werden. Bitte schließe die Seite und versuche es erneut."
  }
  if (typeof moodleContextId === 'undefined') createSystemNotification(message, false);

  const url = "https://opencast-engage.hs-rw.de/search/episode.json?q=" + moodleContextId
}

//Join room über Button
function callJoinRoom() {
  var selectedRoom = $("#rooms > div.listItem > button")
  var roomName = selectedRoom.text();
  var roomID = selectedRoom.attr("id")
  if (roomName == "") {
    alert("Dieser Raum existiert nicht!");
  } else {
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
  videoplayer.onloadedmetadata = function () {
    var videoInfo = getVideoInfo();
    socket.emit('updateVideoInfo', videoInfo);
  }
  $(".videoStatus").removeClass("pause");
})

//Change Video Title
$(document).ready(function () {
  $(".videolist > button").click(function () {
    var videotitle = this.innerHTML;
    document.getElementById("title").innerHTML = videotitle;
  });

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
  $(".videoStatus").removeClass("pause");
  var videoInfo = getVideoInfo();
  socket.emit('updateVideoInfo', videoInfo);
})

// Play video - socket
socket.on('pauseVideo', () => {
  videoplayer.pause();
  $(".videoStatus").addClass("pause");
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
  if (isNaN(durationMinutes)) {
    durationMinutes = '0';
    durationSeconds = '00';
  }
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
  let creatorID = params.userid;
  let creatorUsername = params.username;
  let flagInformation = {
    roomID: roomID,
    creatorID: creatorID,
    videoTime: videoTime,
    videoURL: videoURL,
    annotation: annotation,
    creatorUsername: creatorUsername,
  }
  if (flagInformation.roomID === 'undefined' || flagInformation.creatorID === 'undefined' || flagInformation.videoTime === 'undefined' || flagInformation.videoURL === 'undefined' || flagInformation.annotation === 'undefined' || flagInformation.creatorUsername === 'undefined') {
    createSystemNotification("Fehler beim Hinzufügen einer Flagge. Bitte später erneut versuchen.", false);
  }

  socket.emit('addFlag', flagInformation);
}

// Updates flags
socket.on('updateFlags', flags => {
  drawFlags(videoplayer, flags);
  loadRemoveFlagModal();
})

socket.on('createFlags', flags => {
  let videoplayerInformation = document.getElementById('videoplayer');
  videoplayerInformation.onloadedmetadata = function () {
    drawFlags(videoplayerInformation, flags);
  }
})

// Draws Flags on canvas and creates tooltip-instances
function drawFlags(videoplayerInformation, flags) {
  let flagCanvas = document.getElementById('flagsCanvas');
  let flagCanvasctx = flagCanvas.getContext("2d")
  let videoplayerSeekslider = document.getElementById('seekslider');
  flagCanvasctx.clearRect(0, 0, flagCanvas.width, flagCanvas.height);
  // vorher videoplayerSeekslider
  var oneSecondLength = videoplayerSeekslider.offsetWidth / videoplayerInformation.duration;
  var positionOnCanvas = 0;
  flagsPositions = [];
  // Clean up existing tooltips
  for (var i = 0; i < tippyFlagTooltips.length; i++) {
    tippyFlagTooltips[i].destroy()
  }
  tippyFlagTooltips = []
  // Create flag objects for mouse tracking and tooltip-instances
  for (var i = 0; i < flags.length; i++) {

    positionOnCanvas = flags[i].videoTime * oneSecondLength;

    flagCanvasctx.drawImage(flagImg, positionOnCanvas, flagCanvas.height * (1 / 4));
    var flagObject = {
      xPos: positionOnCanvas,
      yPos: flagCanvas.height * (1 / 4),
      annotation: flags[i].annotation,
      creatorUsername: flags[i].creatorUsername,
      roomID: flags[i].roomID,
      creatorID: flags[i].creatorID,
      videoURL: videoplayer.src,
      videoTime: flags[i].videoTime,
    }
    flagsPositions.push(flagObject);
    let tippyInstance = tippy(document.getElementById('tooltipFlag'));
    tippyInstance.setProps({
      followCursor: true,
      theme: 'translucent',
      delay: [200, 1000],
    });
    tippyInstance.setContent(flagsPositions[i].creatorUsername + ":\n" + flagsPositions[i].annotation);
    tippyFlagTooltips.push(tippyInstance)
  }
}

// Prepares information for flag modallable
function loadFlagModal() {
  document.getElementById('flagAnnotation').value = "";
  let videoPreview = document.getElementById('videoPreview');
  var canvas = capture(videoplayer);
  canvas.onclick = function () {
    window.open(this.toDataURL());
  };
  videoPreview.innerHTML = '';
  videoPreview.appendChild(canvas);
}

// Loads all Flags into Modal
function loadRemoveFlagModal() {
  let flagListing = document.getElementById('flagListing');
  while (flagListing.firstChild) {
    flagListing.removeChild(flagListing.lastChild);
  }
  if (flagsPositions.length == 0) {
    var error = document.createElement('div')
    error.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Hier ist es noch leer</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Zur Zeit wehen noch keine Flaggen im Wind.</h6>
                                <p class="card-text">Wenn Du Flaggen entfernen willst, musst Du erst welche hinzufügen.</p>
                            </div>
                        </div>`;
    flagListing.appendChild(error);
  } else {
    for (var i = 0; i < flagsPositions.length; i++) {
      var error = document.createElement('div')
      var minutes = Math.floor(flagsPositions[i].videoTime / 60).toFixed(0);
      var seconds = (flagsPositions[i].videoTime - minutes * 60).toFixed(0);
      var videotime;
      minutes == 0 ? videotime = seconds + " Sekunden" : videotime = "Minute " + minutes + ":" + seconds;
      error.innerHTML = `
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Flagge ${i+1}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">Von ${flagsPositions[i].creatorUsername} bei ${videotime}</h6>
                                    <p class="card-text">${flagsPositions[i].annotation}</p>
                                </div>
                                <button type="button" class="btn btn-danger" onclick="deleteFlag(${i})">Entfernen</button>
                            </div>
                            <br>
                            `;
      flagListing.appendChild(error);
    }
  }
  //videoPreview.innerHTML = '';
  //videoPreview.appendChild(canvas);
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

// Sends flag delete request
function deleteFlag(position) {
  if (flagsPositions[position] !== 'undefined') {
    socket.emit('removeFlag', flagsPositions[position]);
  } else {
    createSystemNotification("Ein Fehler ist beim Löschen der Flagge aufgetreten. Bitte versuche es später erneut.", false);
  }
}

// Checks if mouse is withing position of a flag
function mouseWithinFlag(mouseX, mouseY) {
  if (flagsPositions.length !== 0) {
    for (var i = 0; i < flagsPositions.length; i++) {
      if (mouseX >= (flagsPositions[i].xPos) && mouseX <= (flagsPositions[i].xPos + flagImg.width) && mouseY > flagsPositions[i].yPos && mouseY < (flagsPositions[i].yPos + flagImg.height)) {
        tippyFlagTooltips[i].show()
      } else {
        tippyFlagTooltips[i].hide()
      }
    }
  }
}