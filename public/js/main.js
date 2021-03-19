const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io(); // New socket object
var didJoin = false;

// Join and switch between rooms
function joinRoom(roomName, roomId) {
    if (!didJoin) {
        // Join new room
        var userid = params.userid;
        var username = params.username;
        var moodleRoom = params.moodleRoom;
        socket.emit('joinRoom', { userid, username, roomName, roomId, moodleRoom });

        didJoin = true;
    } else {
        // "Switch" rooms
        socket.emit('leaveRoom'); // Remove user from users array 
        didJoin = false;
        joinRoom(roomName, roomId);
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
});

// TODO: Create Success message
socket.on('createRoomSuccess', message => {
    console.log(message);
});

// Log error messages
socket.on('error', message => {
    const div = document.createElement('div');
    div.classList.add('alert');
    div.classList.add('alert-danger');
    div.classList.add('alert-dismissible');
    div.classList.add('fade-in');
    div.innerHTML = `<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
    <strong>Fehler</strong> ${message}`;

    var src = document.getElementById("error");
    src.appendChild(div);
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
    div.innerHTML = `<p class="meta">${message.messageFrom} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
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