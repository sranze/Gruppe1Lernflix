const flags = [];

// Saves a specific flag with time in video, the flag-annotation, roomID and the videoURL
function saveFlag(flagInformation) {
    if (typeof flagInformation.roomID !== 'undefined' && typeof flagInformation.creatorID !== 'undefined' && flagInformation.creatorID !== 'System' && typeof flagInformation.videoTime !== 'undefined' && typeof flagInformation.videoURL !== 'undefined' && typeof flagInformation.annotation !== 'undefined' && typeof flagInformation.creatorUsername !== 'undefined') {
        console.log("Saving new Flags")
        const flag = flagInformation;
        flags.push(flag);
    }
}

// Loads flags based on videoURL and roomID
function loadFlags(roomID, videoURL) {
    if (typeof roomID !== 'undefined' && typeof videoURL !== 'undefined') {
        console.log("Loading Flags for room " + roomID);
        const loadedFlags = [];
        for (var i = 0; i < flags.length; i++) {
            if (flags[i].roomID === roomID && flags[i].videoURL === videoURL) {
                loadedFlags.push(flags[i]);
            }
        }
        return loadedFlags;
    }
}

// Removes flag based on VideoURL, videoTime (of Flag Position) and roomID
function removeFlag(roomID, flagInformation) {
    for (var i = 0; i < flags.length; i++) {
        if (flags[i].roomID === roomID && flags[i].videoURL === flagInformation.videoURL && flags[i].videoTime === flagInformation.videoTime) {
            if (i > -1) flags.splice(i, 1);
        }
    }
}

module.exports = {
    loadFlags,
    saveFlag,
    removeFlag
}