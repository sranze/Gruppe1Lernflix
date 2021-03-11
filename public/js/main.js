const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io(); // New socket object

/*
// ROOM FRONTEND STUFF
// Join specific room
// TODO: Get username from server (via LTI)
// TODO: Get Room Name(s) from server  (via PostgreSQL)
// Server will then connect user to room
const connectionObject = { username, roomName };
connectionObject.username = "Testname"; // TODO Change to real username
connectionObject.roomName = "Test-Room 1"; // TODO Change to real room

socket.emit('joinRoom', connectionObject);

*/

// Message thats from server
socket.on('message', message => {
    console.log(message);
    showMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll down in chat
});

// Submit/Send message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop default submission to file

    const message = e.target.elements.msg.value; // Get message value (string)

    socket.emit('chatMessage', message); // Emit message to backend

    document.getElementById('msg').value = ''; // Clear input textfield
    e.target.elements.message.focus();
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