const rooms = [];

// Saves videoURL, videoTime and videoOffset on heap
// TODO: Check if room exists, then update values
function saveVideoInformation(videoInformation) {
    console.log("saveVideoInformation called...")
    const room = videoInformation;
    const roomID = videoInformation.roomID;
    console.log("Room ID is: " + roomID)
    const index = rooms.findIndex(room => room.roomID === roomID)
    console.log("index is: " + index)
    if (index !== -1) {
        rooms.splice(index, 1)[0]
    }
    console.log("created room looks like:")
    console.log(room)
    rooms.push(room)
    console.log("Array:")
    console.log(rooms)

}

// Returns videoURL, videoTime and videoOffset 
function loadVideoInformation(roomID) {
    console.log("ROOMS LOADING: ")
    console.log("Array: " + rooms)
    console.log("Find:")
    console.log(rooms.find(room => room.roomID === roomID))
    if (rooms.find(room => room.roomID === roomID) == undefined) {
        return { roomID: roomID, videoURL: "", videoTime: "00:00", videoOffset: "", isPaused: false, timestamp: null };
    } else {
        return rooms.find(room => room.roomID === roomID);
    }
}

module.exports = {
    saveVideoInformation,
    loadVideoInformation
}