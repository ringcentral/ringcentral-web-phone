var error = console.error;
var EventEmitter = require('./emitter');

module.exports = {

    play: function(url, options) {

        var emitter = new EventEmitter();

        var audio = new Audio();

        audio.volume = 1;

        audio.addEventListener("timeupdate", function(event) {
            emitter.emit('progress', {
                duration: audio.duration,
                progress: audio.currentTime / audio.duration
            });
        });

        audio.addEventListener("seeked", function(event) {
            emitter.emit('progress', {
                    duration: audio.duration,
                    progress: audio.currentTime / audio.duration
            });
        });
        audio.addEventListener("ended", function(event) {
            emitter.emit('ended');
        });
        audio.addEventListener("pause", function(event) {
            emitter.emit('progress', {
                    duration: audio.duration,
                    paused: true,
                    progress: audio.currentTime / audio.duration
            });
        });
        audio.addEventListener("play", function(event) {
            emitter.emit('progress', {
                    duration: audio.duration,
                    resumed: true,
                    progress: audio.currentTime / audio.duration
            });
        });
        audio.addEventListener("error", function() {
            console.log("error", audio.error); //FIXME
            emitter.emit('error', audio.error);
        });

        emitter.stop = audio.pause.bind(audio);
        emitter.pause = audio.pause.bind(audio);
        emitter.resume = audio.play.bind(audio);
        emitter.reset = function() {
            audio.currentTime = 0;
            audio.play();
        };

        emitter.duration = function() {
            return Math.ceil(audio.duration);
        };

        audio.src = url;
        audio.load(url);

        if (options) { //FIXME angular.isObject
            for (var prop in options) {
                if (prop in audio) {
                    audio[prop] = options[prop];
                }
            }
        }

        audio.play();

        return emitter;

    }
};