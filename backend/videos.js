const videos = [];

// Saves videoURL, videoTime and videoOffset on heaps
function saveVideoInformation(videoInformation) {
    console.log("saveVideoInformation called...")
    const video = videoInformation;
    const roomID = videoInformation.roomID;
    console.log("video ID is: " + roomID)
    const index = videos.findIndex(video => video.roomID === roomID)
    console.log("index is: " + index)
    if (index !== -1) {
        videos.splice(index, 1)[0]
    }
    console.log("created video looks like:")
    console.log(video)
    videos.push(video)
    console.log("Array:")
    console.log(videos)

}

// Returns videoURL, videoTime and videoOffset 
function loadVideoInformation(roomID) {
    console.log("videos LOADING: ")
    console.log("Array: " + videos)
    console.log("Find:")
    console.log(videos.find(video => video.roomID === roomID))
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