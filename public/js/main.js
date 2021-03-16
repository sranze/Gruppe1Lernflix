const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io(); // New socket object
var didJoin = false;

// Join and switch between rooms
// TODO: Get Room Name(s) from server  (via PostgreSQL)
function joinRoom(roomName, roomId) {
    console.log("ID: " + roomId)
    console.log("Name: " + roomName)
    if (!didJoin) {
        // Join new room
        var userid = params.userid;
        var username = params.username;

        socket.emit('joinRoom', { userid, username, roomName, roomId });

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
    console.log(rooms);
    var roomName = "PLACEHOLDER";
    var roomId = 1234;
    for (var i = 0; i < rooms.length; i += 2) {
        roomName = rooms[i + 1];
        roomId = rooms[i];

        console.log("Id: " + roomId)
        console.log("Name: " + roomName)

        var button = document.createElement('button');
        var bText = document.createTextNode(roomName);

        button.setAttribute('id', rooms[i]);
        button.appendChild(bText);
        button.setAttribute('class', 'btn btn-primary')

        button.onclick = function() { joinRoom(this.childNodes[0].nodeValue, this.id); };

        var src = document.getElementById("body");
        src.appendChild(button);
    }
}