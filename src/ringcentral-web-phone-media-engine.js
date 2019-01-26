'use strict';

class MediaStreams {

  constructor(session, localStream, remoteStream) {
    this.ktag = 'MediaStreams';
    if (!session) {
      rcWPLoge(this.ktag, 'The session cannot be null!');
      return;
    }
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

  reconnectMedia(options) {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (self.session) {
        const RTCOptions = {
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 0,
          iceRestart: true
        };
        var offerOptions = (options && options.RTCOptions) || RTCOptions;
        if (!options) {
          options = {};
        }
        if (!options.extraHeaders) {
          options.extraHeaders = self.session.ua.defaultHeaders;
        }
        options.eventHandlers = {
          succeeded: resolve,
          failed: reject
        };
        var pc = self.session.sessionDescriptionHandler.peerConnection;
        pc.createOffer(offerOptions).then (offer => {
          rcWPLogd(self.tag, offer);
          pc.setLocalDescription(offer).then (() => {
            if (self.validateSDP(pc.localDescription.sdp)) {
              rcWPLogd(self.tag, 'reconnecting media');
              resolve('reconnecting media');
            } else {
              rcWPLoge(self.tag, 'fail to reconnect media');
              reject(new Error('fail to reconnect media'));
            }
          }, error => {
            rcWPLoge(self.tag, error);
            reject(error);
          });
        }, error => {
          rcWPLoge(self.tag, error);
          reject(error);
        });
        self.session.reinvite(options);
      } else {
        rcWPLoge(self.tag, 'The session cannot be empty');
      }
    });
  }
  
  validateSDP(sdp) {
    if (!sdp) {
      rcWPLoge(this.tag, 'The sdp cannot be null!');
      return false;
    }
    var cIP = this.getIPInSDP(sdp, 'c=');
    var aRtcpIP = this.getIPInSDP(sdp, 'a=rtcp:');
    return cIP && aRtcpIP && cIP !== '0.0.0.0' && aRtcpIP !== '0.0.0.0';
  }

  getIPInSDP(sdp, token) {
    if (sdp) {
        var ips = sdp.split('\r\n').filter(function(line){
            return line.indexOf(token) === 0;
        }).map(function(ip){
            return ip.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)[0];
        });
        if (typeof ips[0] !== 'undefined') {
          return ips[0];
        } else {
          return null;
        }
    }
    return null; // no connected peers
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
