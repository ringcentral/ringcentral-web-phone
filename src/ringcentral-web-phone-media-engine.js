'use strict';

class MediaStreams {

  constructor(session, localStream, remoteStream) {
    this.ktag = 'MediaStreams';
    this.session = session;
    this.lStream = localStream;
    this.rStream = remoteStream;
    this.onMediaConnectionStateChange = null;
    if (this.session && this.session.sessionDescriptionHandler) {
      this.session.sessionDescriptionHandler.on('iceConnection', this.onPeerConnectionStateChange.bind(this));
      this.session.sessionDescriptionHandler.on('iceConnectionChecking', this.onPeerConnectionStateChange.bind(this));
      this.session.sessionDescriptionHandler.on('iceConnectionConnected', this.onPeerConnectionStateChange.bind(this));
      this.session.sessionDescriptionHandler.on('iceConnectionCompleted', this.onPeerConnectionStateChange.bind(this));
      this.session.sessionDescriptionHandler.on('iceConnectionFailed', this.onPeerConnectionStateChange.bind(this));
      this.session.sessionDescriptionHandler.on('iceConnectionDisconnected', this.onPeerConnectionStateChange.bind(this));
      this.session.sessionDescriptionHandler.on('iceConnectionClosed', this.onPeerConnectionStateChange.bind(this));
    }
    this.connectionState = {
      'new': 'mediaConnectionStateNew',
      'checking': 'mediaConnectionStateChecking',
      'connected': 'mediaConnectionStateConnected',
      'completed': 'mediaConnectionStateCompleted',
      'failed': 'mediaConnectionStateFailed',
      'disconnected': 'mediaConnectionStateDisconnected',
      'closed': 'mediaConnectionStateClosed'
    }
  }

  get tag() {
    return this.ktag;
  }

  set localStream(stream) {
    this.lStream = stream;
  }

  get localStream() {
    return this.lStream;
  }

  set remoteStream(stream) {
    this.rStream = stream;
  }

  get remoteStream() {
    return this.rStream;
  }

  onPeerConnectionStateChange(peerConnection) {
    let eventState = 'unknown';
    if (this.connectionState.hasOwnProperty(peerConnection.iceConnectionState)) {
      eventState = this.connectionState[peerConnection.iceConnectionState];
      if (this.onMediaConnectionStateChange) {
        this.onMediaConnectionStateChange(this.session, eventState);
      } else if (this.session && this.session.onMediaConnectionStateChange) {
        this.session.onMediaConnectionStateChange(this.session, eventState);
      } else {
        this.session.emit(eventState, this.session);
      }
    } else {
      rcWPLoge(this.tag,`Unknown peerConnection state: ${peerConnection.iceConnectionState}`);
    }
    rcWPLogd(this.tag, `peerConnection State: ${eventState}`);
  }

  removeListeners() {

    this.session.sessionDescriptionHandler.removeListener('iceConnection', () => {
      rcWPLogd(this.tag, 'removed  event iceConnection');
    });

    this.session.sessionDescriptionHandler.removeListener('iceConnectionChecking', () => {
      rcWPLogd(this.tag, 'removed  event iceConnectionChecking');
    });

    this.session.sessionDescriptionHandler.removeListener('iceConnectionConnected', () => {
      rcWPLogd(this.tag, 'removed  event iceConnectionConnected');
    });


    this.session.sessionDescriptionHandler.removeListener('iceConnectionCompleted', () => {
      rcWPLogd(this.tag, 'removed  event iceConnectionCompleted');
    });

    this.session.sessionDescriptionHandler.removeListener('iceConnectionFailed', () => {
      rcWPLogd(this.tag, 'removed  event iceConnectionFailed');
    });

    this.session.sessionDescriptionHandler.removeListener('iceConnectionDisconnected', () => {
      rcWPLogd(this.tag, 'removed  event iceConnectionDisconnected');
    });

    this.session.sessionDescriptionHandler.removeListener('iceConnectionClosed', () => {
      rcWPLogd(this.tag, 'removed  event iceConnectionClosed');
    });
  }

}

if (typeof process !== 'undefined'  && typeof process.env !== 'undefined' && typeof process.env.JEST_WORKER_ID !== 'undefined') {
  module.exports = MediaStreams;
}
