var uuid = require('./utils').uuid;

function DomAudio(){

    /*
     * We create audio containers here
     * Sorry for DOM manipulations inside a service, but it is for the good :)
     */
    var LOCAL_AUDIO = document.createElement('video'),
        REMOTE_AUDIO = document.createElement('video'),
        LOCAL_AUDIO_ID = 'local_' + uuid(),
        REMOTE_AUDIO_ID = 'remote_' + uuid();

    LOCAL_AUDIO.setAttribute('id', LOCAL_AUDIO_ID);
    LOCAL_AUDIO.setAttribute('autoplay', 'true');
    LOCAL_AUDIO.setAttribute('hidden', 'true');
    LOCAL_AUDIO.setAttribute('muted', '');

    REMOTE_AUDIO.setAttribute('id', REMOTE_AUDIO_ID);
    REMOTE_AUDIO.setAttribute('autoplay', 'true');
    REMOTE_AUDIO.setAttribute('hidden', 'true');

    document.body.appendChild(LOCAL_AUDIO);
    document.body.appendChild(REMOTE_AUDIO);

    LOCAL_AUDIO.volume = 0;

    this.localAudio = LOCAL_AUDIO;
    this.remoteAudio = REMOTE_AUDIO;
    this.localAudioId = LOCAL_AUDIO_ID;
    this.remoteAudioId = REMOTE_AUDIO_ID;

}

module.exports = DomAudio;