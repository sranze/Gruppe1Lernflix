const videos = [];

// Saves videoURL, videoTime and videoOffset on heap
function saveVideoInformation(videoInformation) {
    const video = videoInformation;
    const roomID = videoInformation.roomID;
    const index = videos.findIndex(video => video.roomID === roomID)
    if (index !== -1) {
        videos.splice(index, 1)[0]
    }
    videos.push(video)
}

// Returns videoURL, videoTime and videoOffset 
function loadVideoInformation(roomID) {
    if (videos.find(video => video.roomID === roomID) == undefined) {
        return { roomID: roomID, videoURL: "", videoTime: "00:00", videoOffset: "", isPaused: false, timestamp: null };
    } else {
        return videos.find(video => video.roomID === roomID);
    }
}

module.exports = {
    saveVideoInformation,
    loadVideoInformation
}