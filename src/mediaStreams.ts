/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */

import {SessionDescriptionHandler} from 'sip.js/lib/platform/web';
import {WebPhoneSession} from './session';
import {RTPReport} from './rtpReport';
import {Events} from './events';

enum ConnectionState {
  new = 'mediaConnectionStateNew',
  checking = 'mediaConnectionStateChecking',
  connected = 'mediaConnectionStateConnected',
  completed = 'mediaConnectionStateCompleted',
  failed = 'mediaConnectionStateFailed',
  disconnected = 'mediaConnectionStateDisconnected',
  closed = 'mediaConnectionStateClosed',
}

export enum Browsers {
  MSIE = 'IE',
  Chrome = 'Chrome',
  Firefox = 'Firefox',
  Safari = 'Safari',
  Opera = 'Opera',
}

export class WebPhoneRTPReport implements RTPReport {
  outboundRtpReport = {};
  inboundRtpReport = {};
  rttMs = {};
  localCandidates = [];
  remoteCandidates = [];
  transport = {};
}

/** Media Streams class to monitor media stats */
export default class MediaStreams {
  /**
   * Reference to MediaStreamsImpl object. This Object has all the functions to handle media streams
   *
   * MediaStreams class is a wrapper around MediaStreamsImpl
   */
  public mediaStreamsImpl: MediaStreamsImpl;
  /** Remove iceconnectionstatechange event listeners and stop collecting stats */
  public release: any;
  /**
   * Reconnect media and send reinvite on the existing session.
   *
   * This will also recreate SDP and send it over with the reinvite message
   */
  public reconnectMedia: any;
  /**
   * @param callback function which will be called every time media stats are generated. Will override callback passed to `onRTPStat`
   * @param interval interval for the recurring call to the callback function
   * @returns
   */
  public getMediaStats: (
    callback: (report: RTPReport) => any,
    interval: number
  ) => void;
  /** Stop collecting stats */
  public stopMediaStats: () => void;

  public constructor(session: WebPhoneSession) {
    this.mediaStreamsImpl = new MediaStreamsImpl(session);
    this.release = this.mediaStreamsImpl.release.bind(this.mediaStreamsImpl);
    this.reconnectMedia = this.mediaStreamsImpl.reconnectMedia.bind(
      this.mediaStreamsImpl
    );
    this.getMediaStats = this.mediaStreamsImpl.getMediaStats.bind(
      this.mediaStreamsImpl
    );
    this.stopMediaStats = this.mediaStreamsImpl.stopMediaStats.bind(
      this.mediaStreamsImpl
    );
  }

  /**
   * Set a function to be called when media stats are generated
   * @param callback optionally, you can set a function on MediaStreams object. This will be treated as a default callback when media stats are generated if a callback function is not passed with `getMediaStats` function
   */
  public set onRTPStat(
    callback: (stats: RTPReport, session: WebPhoneSession) => any
  ) {
    this.mediaStreamsImpl.onRTPStat = callback;
  }

  /**
   * Set a function to be called when `peerConnetion` iceconnectionstatechange changes
   * @param callback function to be called when `peerConnetion` iceconnectionstatechange changes
   */
  public set onMediaConnectionStateChange(
    callback: (state: string, session: WebPhoneSession) => any
  ) {
    this.mediaStreamsImpl.onMediaConnectionStateChange = callback;
  }
}

/**
 * MediaStreams Implementation
 */
export class MediaStreamsImpl {
  private ktag = 'MediaStreams';
  private session: WebPhoneSession;
  private isChrome: boolean;
  private isFirefox: boolean;
  private isSafari: boolean;
  private mediaStatsTimer: any;
  public preRTT: any;
  /**
   * Set a function to be called when `peerConnection` iceconnectionstatechange changes
   *
   * @param callback function to be called when `peerConnection` iceconnectionstatechange changes
   */
  public onMediaConnectionStateChange: (
    state: string,
    session: WebPhoneSession
  ) => any;
  /**
   * Set a function to be called when media stats are generated
   * @param callback optionally, you can set a function on MediaStreams object. This will be treated as a default callback when media stats are generated if a callback function is not passed with `getMediaStats` function
   */
  public onRTPStat: (stats: RTPReport, session: WebPhoneSession) => any;

  private get tag() {
    return this.ktag;
  }

  /**
   * Function to find what browser is being used depending on the `navigator.userAgent` value
   * @returns Browsers enum value to denote what browser if being used
   */
  public browser() {
    if (navigator.userAgent.search('MSIE') >= 0) {
      return Browsers.MSIE;
    } else if (navigator.userAgent.search('Chrome') >= 0) {
      return Browsers.Chrome;
    } else if (navigator.userAgent.search('Firefox') >= 0) {
      return Browsers.Firefox;
    } else if (
      navigator.userAgent.search('Safari') >= 0 &&
      navigator.userAgent.search('Chrome') < 0
    ) {
      return Browsers.Safari;
    } else if (navigator.userAgent.search('Opera') >= 0) {
      return Browsers.Opera;
    }
    return 'unknown';
  }

  private mediaStatsTimerCallback() {
    const sessionDescriptionHandler = this.session
      .sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    if (!peerConnection) {
      (this.session as any).logger.error(
        `${this.ktag}: The peer connection cannot be null`
      );
      return;
    }
    const connectionState = peerConnection.iceConnectionState;
    if (connectionState !== 'connected' && connectionState !== 'completed') {
      this.preRTT.currentRoundTripTime = 0;
      return;
    }
    this.getRTPReport(new WebPhoneRTPReport());
  }

  private onPeerConnectionStateChange() {
    let eventName = 'unknown';
    const sessionDescriptionHandler = this.session
      .sessionDescriptionHandler as SessionDescriptionHandler;
    const state = sessionDescriptionHandler.peerConnection.iceConnectionState;
    if (ConnectionState.hasOwnProperty(state)) {
      eventName = ConnectionState[state];
      if (this.onMediaConnectionStateChange) {
        this.onMediaConnectionStateChange(eventName, this.session);
      }
      this.session.emit(eventName);
    } else {
      (this.session as any).logger.debug(
        `${this.tag}: Unknown peerConnection state: ${state}`
      );
    }
    (this.session as any).logger.debug(
      `${this.tag}: peerConnection State: ${state}`
    );
  }

  private async getRTPReport(report: RTPReport) {
    const sessionDescriptionHandler = this.session
      .sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    try {
      const stats = await peerConnection.getStats();
      stats.forEach((stat: {[key: string]: any}) => {
        switch (stat.type) {
          case 'inbound-rtp':
            Object.keys(stat).forEach(statName => {
              switch (statName) {
                case 'bytesReceived':
                case 'packetsReceived':
                case 'jitter':
                case 'packetsLost':
                case 'fractionLost':
                case 'mediaType':
                  (report.inboundRtpReport as any)[statName] = stat[statName];
                  break;
                case 'roundTripTime':
                  report.rttMs[statName] = stat[statName];
                  break;
              }
            });
            break;
          case 'outbound-rtp':
            Object.keys(stat).forEach(statName => {
              switch (statName) {
                case 'bytesSent':
                case 'packetsSent':
                case 'mediaType':
                  (report.outboundRtpReport as any)[statName] = stat[statName];
                  break;
              }
            });
            break;
          case 'candidate-pair':
            Object.keys(stat).forEach(statName => {
              switch (statName) {
                case 'currentRoundTripTime':
                  report.rttMs[statName] = stat[statName];
                  break;
              }
            });
            break;
          case 'local-candidate':
            const local_candidate = {};
            Object.keys(stat).forEach(statName => {
              switch (statName) {
                case 'id':
                case 'isRemote':
                case 'ip':
                case 'candidateType':
                case 'networkType':
                case 'priority':
                case 'port':
                  local_candidate[statName] = stat[statName];
                  break;
              }
            });
            report.localCandidates.push(local_candidate);
            break;
          case 'remote-candidate':
            const remote_candidate = {};
            Object.keys(stat).forEach(statName => {
              switch (statName) {
                case 'id':
                case 'isRemote':
                case 'ip':
                case 'priority':
                case 'port':
                case 'candidateType':
                  remote_candidate[statName] = stat[statName];
                  break;
              }
            });
            report.remoteCandidates.push(remote_candidate);
            break;
          case 'media-source':
            report.outboundRtpReport.rtpLocalAudioLevel = stat.audioLevel
              ? stat.audioLevel
              : 0;
            break;
          case 'track':
            if (!stat.remoteSource) {
              break;
            }
            report.inboundRtpReport.rtpRemoteAudioLevel = stat.audioLevel
              ? stat.audioLevel
              : 0;
            break;
          case 'transport':
            Object.keys(stat).forEach(statName => {
              switch (statName) {
                case 'dtlsState':
                case 'packetsSent':
                case 'packetsReceived':
                case 'selectedCandidatePairChanges':
                case 'selectedCandidatePairId':
                  report.transport[statName] = stat[statName];
                  break;
              }
            });
            break;
          default:
            break;
        }
      });

      if (!report.rttMs.hasOwnProperty('currentRoundTripTime')) {
        if (!report.rttMs.hasOwnProperty('roundTripTime')) {
          report.rttMs.currentRoundTripTime = this.preRTT.currentRoundTripTime;
        } else {
          report.rttMs.currentRoundTripTime = report.rttMs.roundTripTime; // for Firefox
          delete report.rttMs.roundTripTime;
        }
      } else {
        report.rttMs.currentRoundTripTime = Math.round(
          report.rttMs.currentRoundTripTime * 1000
        );
      }

      if (report.rttMs.hasOwnProperty('currentRoundTripTime')) {
        this.preRTT.currentRoundTripTime = report.rttMs.currentRoundTripTime;
      }
      this.onRTPStat(report, this.session);
      this.session.emit(Events.Session.RTPStat, report);
    } catch (e) {
      (this.session as any).logger.error(
        `${this.tag}: Unable to get media stats: ${e.message}`
      );
    }
  }

  public constructor(session) {
    this.ktag = 'MediaStreams';
    if (!session) {
      throw new Error(
        `${this.ktag}: Cannot initial media stream monitoring. Session is not passed`
      );
    }
    this.session = session;
    this.onMediaConnectionStateChange = null;
    this.onPeerConnectionStateChange =
      this.onPeerConnectionStateChange.bind(this);
    const sessionDescriptionHandler = this.session
      .sessionDescriptionHandler as SessionDescriptionHandler;
    sessionDescriptionHandler.peerConnection.addEventListener(
      'iceconnectionstatechange',
      this.onPeerConnectionStateChange
    );
    this.isChrome = this.browser() === Browsers.Chrome;
    this.isFirefox = this.browser() === Browsers.Firefox;
    this.isSafari = this.browser() === Browsers.Safari;

    this.preRTT = {currentRoundTripTime: 0};

    if (!this.isChrome && !this.isFirefox && !this.isSafari) {
      (this.session as any).logger.error(
        `${
          this.ktag
        } The web browser ${this.browser()} is not in the recommended list [Chrome, Safari, Firefox] !`
      );
    }
  }

  /**
   * @param callback function which will be called every time media stats are generated. Will override callback passed to `onRTPStat`
   * @param interval interval for the recurring call to the callback function
   * @returns
   */
  public getMediaStats(callback = null, interval = 1000) {
    if (!this.onRTPStat && !callback) {
      (this.session as any).logger.debug(
        `${this.ktag}: No event callback provided to call when media starts are generated`
      );
      return;
    }
    if (callback) {
      this.onRTPStat = callback;
    }
    if (this.mediaStatsTimer) {
      clearTimeout(this.mediaStatsTimer);
      this.mediaStatsTimer = null;
    }
    this.mediaStatsTimer = setInterval(() => {
      this.mediaStatsTimerCallback();
    }, interval);
  }

  /**
   * Stop collecting stats. This will stop calling the registered function (either that was registered using `onRTPstat` or using `getMediaStats`)
   */
  public stopMediaStats() {
    if (this.mediaStatsTimer) {
      clearTimeout(this.mediaStatsTimer);
      this.onRTPStat = null;
    }
  }

  /**
   * Reconnect media and send reinvite on the existing session.
   *
   * This will also recreate SDP and send it over with the reinvite message
   */
  public reconnectMedia(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.session
        .reinvite()
        .then(() => resolve())
        .catch(reject);
    });
  }

  /**
   * Remove iceconnectionstatechange event listeners and stop collecting stats
   */
  public release() {
    if (this.mediaStatsTimer) {
      clearTimeout(this.mediaStatsTimer);
      this.mediaStatsTimer = null;
    }
    const sessionDescriptionHandler = this.session
      .sessionDescriptionHandler as SessionDescriptionHandler;
    if (!sessionDescriptionHandler.peerConnection) {
      return;
    }
    sessionDescriptionHandler.peerConnection.removeEventListener(
      'iceconnectionstatechange',
      this.onPeerConnectionStateChange
    );
  }
}

export {MediaStreams};
