/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */

'use strict';

/**
 * @Supported browsers: @Chrome  @Firefox @Safari
 *
 * @Section1 @type MediaStreams public interfaces
 *
 * @release : release the resource after the call is ended.
 * @param : none
 *
 * @reconnectMedia : reconnect media streams in a call at any time.
 * @param : none
 *
 * @getMediaStats : get the media RTP statistics
 * @param1 onMediaStat : @optional  @callback function to receive the RTP statistics report.
 *   Ways to receive media report:
 *   @way1 onMediaStat = function(report) {...}
 *   @way2 session.on("rtpStat") to listen on the event
 *   @way3 session.onRTPStat = function(report)
 *   @way4 session.mediaStreams.onRTPStat = function(report)
 * @param2 interval : @optional  the interval in seconds to fetch a media statistics report. 1 second by default.
 * @return: @inboundRtpReport : bytesReceived, jitter, packetsLost, packetsReceived, mediaType, fractionLostIn
 *          @outboundRtpReport : bytesSent, packetsSent, mediaType
 *          @rttMS : currentRoundTripTime
 *
 * @stopMediaStats :stop the media statistics
 * @param : none
 *
 * @Section2 @type MediaStreams public properties
 *
 * @property onRTPStat : @optional @callback function to receive the RTP statistics report.
 * @property onMediaConnectionStateChange : @optional @callback function to receive media connectionState
 *   Ways to receive the media connection state
 *   @way1 session.onMediaConnectionStateChange = function(session, event) {...}
 *   @way2 session.mediaStreams.onMediaConnectionStateChange = function(session, event) {...}
 *   @way3 session.on(event)  event = element in connectionState
 *
 * @Section3 @type MediaStreams public events
 * @connectionState : media connection state. @emit :
 *   @state1 'mediaConnectionStateNew' : A new RTCPeerConnection is created.
 *   @state2 'mediaConnectionStateChecking' : A new RTCPeerConnection is created.
 *   @state3 'mediaConnectionStateConnected' : RTCPeerConnection media connection is connected.
 *   @state4 'mediaConnectionStateCompleted' : RTCPeerConnection media connection is ready.
 *   @state5 'mediaConnectionStateFailed' : RTCPeerConnection media connection is failed.
 *   @state6 'mediaConnectionStateDisconnected': RTCPeerConnection media connection is disconnected.
 *   @state7 'mediaConnectionStateClosed' : RTCPeerConnection media connection is closed.
 */


export default class MediaStreams {
    private mediaStreamsImpl: MediaStreamsImpl;
    public release: any;
    public reconnectMedia: any;
    public getMediaStats: any;
    public stopMediaStats: any;

  public constructor(session) {
    this.mediaStreamsImpl = new MediaStreamsImpl(session);
    this.release = this.mediaStreamsImpl.release.bind(this.mediaStreamsImpl);
    this.reconnectMedia = this.mediaStreamsImpl.reconnectMedia.bind(this.mediaStreamsImpl);
    this.getMediaStats = this.mediaStreamsImpl.getMediaStats.bind(this.mediaStreamsImpl);
    this.stopMediaStats = this.mediaStreamsImpl.stopMediaStats.bind(this.mediaStreamsImpl);
  }

  set onRTPStat(statsCallback) {
    this.mediaStreamsImpl.onRTPStat = statsCallback;
  }

  set onMediaConnectionStateChange(stateChangeCallBack) {
    this.mediaStreamsImpl.onMediaConnectionStateChange = stateChangeCallBack;
  }
}

/**
 * MediaStreams Implementation
 */
class MediaStreamsImpl {

  public onMediaConnectionStateChange: any;
  public onRTPStat: any;

  private ktag: string = 'MediaStreams';
  private session: any;
  private onStateChange: any;
  private connectionState: any;
  private browsers: any;
  private isChrome: any;
  private isFirefox: any;
  private isSafari: any;
  private preRTT: any;
  private RTPReports: any;
  private mediaStatsTimer: any;

  constructor(session) {
    this.ktag = 'MediaStreams';
    if (!session) {
      this.rcWPLoge(this.ktag, 'The session cannot be null!');
      throw new Error('Fail to create the media session. session is null or undefined!');
    }
    this.session = session;
    this.onMediaConnectionStateChange = null;
    this.onStateChange = this.onPeerConnectionStateChange.bind(this);
    if (this.session && this.session.sessionDescriptionHandler) {
      this.session.sessionDescriptionHandler.on('iceConnection', this.onStateChange);
      this.session.sessionDescriptionHandler.on('iceConnectionChecking', this.onStateChange);
      this.session.sessionDescriptionHandler.on('iceConnectionConnected', this.onStateChange);
      this.session.sessionDescriptionHandler.on('iceConnectionCompleted', this.onStateChange);
      this.session.sessionDescriptionHandler.on('iceConnectionFailed', this.onStateChange);
      this.session.sessionDescriptionHandler.on('iceConnectionDisconnected', this.onStateChange);
      this.session.sessionDescriptionHandler.on('iceConnectionClosed', this.onStateChange);
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
    this.browsers = {'MSIE':'IE', 'Chrome' : 'Chrome', 'Firefox':'Firefox', 'Safari':'Safari', 'Opera':'Opera'};
    this.isChrome = this.browser() == this.browsers['Chrome'];
    this.isFirefox = this.browser() == this.browsers['Firefox'];
    this.isSafari = this.browser() == this.browsers['Safari'];

    this.preRTT = {'currentRoundTripTime' : 0};

    if (!this.isChrome && !this.isFirefox && !this.isSafari) {
      this.rcWPLoge(this.ktag, `The web browser ${this.browser()} is not in the recommended list [Chrome, Safari, Firefox] !`);
    }

    this.RTPReports = class {
      public outboundRtpReport: any;
      public inboundRtpReport: any;
      public rttMS: any;
      constructor() {
        this.outboundRtpReport = {};
        this.inboundRtpReport = {};
        this.rttMS = {};
      };
    };
  }

  getMediaStats(onMediaStat, interval) {
    if (!interval) {
      interval = 1000;
    }
    if (onMediaStat) {
      this.onRTPStat = onMediaStat;
    }
    if (this.mediaStatsTimer) {
      clearTimeout(this.mediaStatsTimer);
      this.mediaStatsTimer = null;
    }
    this.mediaStatsTimer = setInterval(() => {
      this.mediaStatsTimerCallback();
    }, interval);
  }

  mediaStatsTimerCallback() {
    let pc = this.session.sessionDescriptionHandler.peerConnection;
    if (!pc) {
      this.rcWPLoge(this.ktag, 'the peer connection cannot be null');
      return;
    }
    let connectionState = pc.iceConnectionState;
    if (connectionState !== 'connected' && connectionState !== 'completed') {
      this.preRTT['currentRoundTripTime'] = 0;
      return;
    }
    let rtpStatInSession = this.session.listeners('rtpStat');
    if (!(this.session.onRTPStat) && !(this.onRTPStat) && !(rtpStatInSession.length > 0)) {
      this.rcWPLoge(this.ktag, 'No callback to accept receive media report. usage: session.on("rtpStat") = function(report) or session.onRTPStat = function(report) or set a mediaCallback as a paramter');
      return;
    }
    this.getRTPReport(new this.RTPReports());
  }

  stopMediaStats() {
    if (this.mediaStatsTimer) {
      clearTimeout(this.mediaStatsTimer);
      this.onRTPStat = null;
    }
  }

  get tag() {
    return this.ktag;
  }

  onPeerConnectionStateChange(sessionDescriptionHandler) {
    let eventState = 'unknown';
    if (this.connectionState.hasOwnProperty(sessionDescriptionHandler.peerConnection.iceConnectionState)) {
      eventState = this.connectionState[sessionDescriptionHandler.peerConnection.iceConnectionState];
      if (this.onMediaConnectionStateChange) {
        this.onMediaConnectionStateChange(this.session, eventState);
      } else if (this.session && this.session.onMediaConnectionStateChange) {
        this.session.onMediaConnectionStateChange(this.session, eventState);
      } else {
        this.session.emit('mediaConnectionStateChanged', eventState);
      }
    } else {
      this.rcWPLogd(this.tag,`Unknown peerConnection state: ${sessionDescriptionHandler.peerConnection.iceConnectionState}`);
    }
    this.rcWPLogd(this.tag, `peerConnection State: ${eventState}`);
  }

  reconnectMedia(options) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if (self.session) {
        const RTCOptions = {
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 0,
          iceRestart: true
        };
        let offerOptions = (options && options.RTCOptions) || RTCOptions;
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
        let pc = self.session.sessionDescriptionHandler.peerConnection;
        pc.createOffer(offerOptions).then (offer => {
          self.rcWPLogd(self.tag, offer);
          pc.setLocalDescription(offer).then (() => {
            if (self.validateSDP(pc.localDescription.sdp)) {
              self.rcWPLogd(self.tag, 'reconnecting media');
              resolve('reconnecting media');
            } else {
              self.rcWPLoge(self.tag, 'fail to reconnect media');
              reject(new Error('fail to reconnect media'));
            }
          }, error => {
            self.rcWPLoge(self.tag, error);
            reject(error);
          });
        }, error => {
          self.rcWPLoge(self.tag, error);
          reject(error);
        });
        self.session.reinvite(options);
      } else {
        self.rcWPLoge(self.tag, 'The session cannot be empty');
      }
    });
  }

  validateSDP(sdp) {
    if (!sdp) {
      this.rcWPLoge(this.tag, 'The sdp cannot be null!');
      return false;
    }
    let cIP = this.getIPInSDP(sdp, 'c=');
    let aRtcpIP = this.getIPInSDP(sdp, 'a=rtcp:');
    return cIP && aRtcpIP && cIP !== '0.0.0.0' && aRtcpIP !== '0.0.0.0';
  }

  getIPInSDP(sdp, token) {
    if (sdp) {
        let ips = sdp.split('\r\n').filter(function(line){
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

  getRTPReport(reports) {
    let self = this;
    let pc = self.session.sessionDescriptionHandler.peerConnection;
    pc.getStats().then(stats => {
      stats.forEach(report => {
        switch (report.type) {
          case 'inbound-rtp':
            Object.keys(report).forEach(statName => {
              switch(statName) {
                case 'bytesReceived':
                case 'packetsReceived':
                case 'jitter':
                case 'packetsLost':
                case 'fractionLost':
                case 'mediaType':
                reports.inboundRtpReport[statName] = report[statName];
                break;
                case 'roundTripTime':
                reports.rttMS[statName] = report[statName];
                break;
              }
            });
          break;
          case 'outbound-rtp':
            Object.keys(report).forEach(statName => {
              switch(statName) {
                case 'bytesSent':
                case 'packetsSent':
                case 'mediaType':
                reports.outboundRtpReport[statName] = report[statName];
                break;
              }
            });
          break;
          case 'candidate-pair':
            Object.keys(report).forEach(statName => {
              switch(statName) {
                case 'currentRoundTripTime':
                reports.rttMS[statName] = report[statName];
                break;
              }
            });
          break;
          default:
          break;
        }
      });

      if (!reports.rttMS.hasOwnProperty('currentRoundTripTime')) {
        if (!reports.rttMS.hasOwnProperty('roundTripTime')) {
          reports.rttMS['currentRoundTripTime'] = self.preRTT['currentRoundTripTime'];
        } else {
          reports.rttMS['currentRoundTripTime'] = reports.rttMS['roundTripTime']; // for Firefox
          delete reports.rttMS['roundTripTime'];
        }
      } else {
        reports.rttMS['currentRoundTripTime'] = Math.round(reports.rttMS['currentRoundTripTime'] * 1000);
      }

      if (reports.rttMS.hasOwnProperty('currentRoundTripTime')) {
        self.preRTT['currentRoundTripTime'] = reports.rttMS['currentRoundTripTime'];
      }

      if (self.session) {
        if (self.session.onRTPStat) {
          self.session.onRTPStat(reports, self.session);
        } else if (self.onRTPStat) {
          self.onRTPStat(reports, self.session);
        } else {
          self.session.emit('rtpStat', reports, self.session);
        }
      }

    }).catch(error => {
      this.rcWPLoge(self.ktag, JSON.stringify(error));
    });
  }

  browser() {
    if (navigator.userAgent.search('MSIE') >= 0) {
      return  this.browsers['MSIE'];
    } else if (navigator.userAgent.search("Chrome") >= 0) {
      return this.browsers['Chrome'];
    } else if (navigator.userAgent.search("Firefox") >= 0) {
      return this.browsers['Firefox'];
    } else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      return this.browsers['Safari'];
    } else if (navigator.userAgent.search("Opera") >= 0) {
      return this.browsers['Opera'];
    }
    return 'unknown';
  }

  release() {
    if (this.mediaStatsTimer) {
      clearTimeout(this.mediaStatsTimer);
      this.mediaStatsTimer = null;
    }
    if (this.session) {
      this.session.sessionDescriptionHandler.removeListener('iceConnection', this.onStateChange);
      this.session.sessionDescriptionHandler.removeListener('iceConnectionChecking', this.onStateChange);
      this.session.sessionDescriptionHandler.removeListener('iceConnectionConnected', this.onStateChange);
      this.session.sessionDescriptionHandler.removeListener('iceConnectionCompleted', this.onStateChange);
      this.session.sessionDescriptionHandler.removeListener('iceConnectionFailed', this.onStateChange);
      this.session.sessionDescriptionHandler.removeListener('iceConnectionDisconnected', this.onStateChange);
      this.session.sessionDescriptionHandler.removeListener('iceConnectionClosed', this.onStateChange);
    }
  }

  rcWPLoge(label, msg) {
    if (this.session) {
      this.session.logger.error(`${label} ${msg}`);
    } else {
      console.log(label, msg);
    }
  }

  rcWPLogd(label, msg) {
    if (this.session) {
      this.session.logger.log(`${label} ${msg}`);
    } else {
      console.log(label, msg);
    }
  }

}