function getUserMedia(constraints, success, failure) {
    if (getUserMedia.fail) {
        setTimeout(failure, 0);
    } else {
        setTimeout(success.bind(null, getUserMedia.fakeStream()), 0);
    }
}
getUserMedia.fakeStream = function() {
    var audioTracks = [{
        id: Math.random().toString(),
        stop: function(){}
    }];
    var videoTracks = [];
    return {
        getAudioTracks: function() {
            return audioTracks;
        },
        getTracks: function() {
            return audioTracks.concat(videoTracks);
        },
        getVideoTracks: function() {
            return videoTracks;
        }
    };
};
getUserMedia.orig = window.navigator.getUserMedia;
window.navigator.getUserMedia = getUserMedia;