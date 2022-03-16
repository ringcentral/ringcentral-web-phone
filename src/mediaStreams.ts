/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */

import { SessionDescriptionHandler } from 'sip.js/lib/platform/web';
import { WebPhoneSession } from './session';

enum ConnectionState {
    new = 'mediaConnectionStateNew',
    checking = 'mediaConnectionStateChecking',
    connected = 'mediaConnectionStateConnected',
    completed = 'mediaConnectionStateCompleted',
    failed = 'mediaConnectionStateFailed',
    disconnected = 'mediaConnectionStateDisconnected',
    closed = 'mediaConnectionStateClosed'
}

/** @ignore */
export enum Browsers {
    MSIE = 'IE',
    Chrome = 'Chrome',
    Firefox = 'Firefox',
    Safari = 'Safari',
    Opera = 'Opera'
}

/** Params to create new peer connection offer */
interface RTCOfferOptions {
    iceRestart?: boolean;
    offerToReceiveAudio?: boolean;
    offerToReceiveVideo?: boolean;
}

export class RTPReport {
    public outboundRtpReport: any;
    public inboundRtpReport: any;
    public rttMS: any;
    public localCandidates: any[];
    public remoteCandidates: any[];
    public transport: any;

    public constructor() {
        this.outboundRtpReport = {};
        this.inboundRtpReport = {};
        this.rttMS = {};
        this.localCandidates = [];
        this.remoteCandidates = [];
        this.transport = {};
    }
}

/** Media Streams class to monitor media stats */
export default class MediaStreams {
    public mediaStreamsImpl: MediaStreamsImpl;
    /** Remove iceconnectionstatechange event listeners and stop collecting stats */
    public release: any;
    /** Reconnect media */
    public reconnectMedia: any;
    /** Get media stream stats */
    public getMediaStats: any;
    /** Stop collecting stats */
    public stopMediaStats: any;

    public constructor(session: WebPhoneSession) {
        this.mediaStreamsImpl = new MediaStreamsImpl(session);
        this.release = this.mediaStreamsImpl.release.bind(this.mediaStreamsImpl);
        this.reconnectMedia = this.mediaStreamsImpl.reconnectMedia.bind(this.mediaStreamsImpl);
        this.getMediaStats = this.mediaStreamsImpl.getMediaStats.bind(this.mediaStreamsImpl);
        this.stopMediaStats = this.mediaStreamsImpl.stopMediaStats.bind(this.mediaStreamsImpl);
    }

    /** Set callback function to be called when media stats are generated */
    public set onRTPStat(callback: (stats: RTPReport, session: WebPhoneSession) => any) {
        this.mediaStreamsImpl.onRTPStat = callback;
    }

    /** Set callback function to be called when media state changes */
    public set onMediaConnectionStateChange(callback: (state: string, session: WebPhoneSession) => any) {
        this.mediaStreamsImpl.onMediaConnectionStateChange = callback;
    }
}

/**
 * MediaStreams Implementation
 */
export class MediaStreamsImpl {
    public preRTT: any;
    private ktag = 'MediaStreams';
    private session: WebPhoneSession;
    private isChrome: boolean;
    private isFirefox: boolean;
    private isSafari: boolean;
    private mediaStatsTimer: any;
    public on;
    public localStream;
    public remoteStream;
    public validateSDP;
    /** Callback to be triggered when media state changes */
    // DOCUMENT: order of params has changed
    public onMediaConnectionStateChange: (state: string, session: WebPhoneSession) => any;
    /** Callback to be triggered when starts are generated */
    public onRTPStat: (stats: RTPReport, session: WebPhoneSession) => any;

    private get tag() {
        return this.ktag;
    }

    public browser() {
        if (navigator.userAgent.search('MSIE') >= 0) {
            return Browsers.MSIE;
        } else if (navigator.userAgent.search('Chrome') >= 0) {
            return Browsers.Chrome;
        } else if (navigator.userAgent.search('Firefox') >= 0) {
            return Browsers.Firefox;
        } else if (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0) {
            return Browsers.Safari;
        } else if (navigator.userAgent.search('Opera') >= 0) {
            return Browsers.Opera;
        }
        return 'unknown';
    }

    public mediaStatsTimerCallback() {
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler as SessionDescriptionHandler;
        const peerConnection = sessionDescriptionHandler.peerConnection;
        if (!peerConnection) {
            (this.session as any).logger.error(`${this.ktag}: The peer connection cannot be null`);
            return;
        }
        const connectionState = peerConnection.iceConnectionState;
        if (connectionState !== 'connected' && connectionState !== 'completed') {
            this.preRTT.currentRoundTripTime = 0;
            return;
        }
        this.getRTPReport(new RTPReport());
    }

    public onPeerConnectionStateChange() {
        let eventName = 'unknown';
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler as SessionDescriptionHandler;
        const state = sessionDescriptionHandler.peerConnection.iceConnectionState;
        if (ConnectionState.hasOwnProperty(state)) {
            eventName = ConnectionState[state];
            if (this.onMediaConnectionStateChange) {
                this.onMediaConnectionStateChange(eventName, this.session);
            }
            this.session.emit(eventName);
        } else {
            (this.session as any).logger.debug(`${this.tag}: Unknown peerConnection state: ${state}`);
        }
        (this.session as any).logger.debug(`${this.tag}: peerConnection State: ${state}`);
    }

    public async getRTPReport(report) {
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler as SessionDescriptionHandler;
        const peerConnection = sessionDescriptionHandler.peerConnection;
        try {
            const stats = await peerConnection.getStats();
            stats.forEach((stat) => {
                switch (stat.type) {
                    case 'inbound-rtp':
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'bytesReceived':
                                case 'packetsReceived':
                                case 'jitter':
                                case 'packetsLost':
                                case 'fractionLost':
                                case 'mediaType':
                                    report.inboundRtpReport[statName] = stat[statName];
                                    break;
                                case 'roundTripTime':
                                    report.rttMS[statName] = stat[statName];
                                    break;
                            }
                        });
                        break;
                    case 'outbound-rtp':
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'bytesSent':
                                case 'packetsSent':
                                case 'mediaType':
                                    report.outboundRtpReport[statName] = stat[statName];
                                    break;
                            }
                        });
                        break;
                    case 'candidate-pair':
                        Object.keys(stat).forEach((statName) => {
                            switch (statName) {
                                case 'currentRoundTripTime':
                                    report.rttMS[statName] = stat[statName];
                                    break;
                            }
                        });
                        break;
                    case 'local-candidate':
                        const local_candidate = {};
                        Object.keys(stat).forEach((statName) => {
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
                        Object.keys(stat).forEach((statName) => {
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
                        report.outboundRtpReport.rtpLocalAudioLevel = stat.audioLevel ? stat.audioLevel : 0;
                        break;
                    case 'track':
                        if (!stat.remoteSource) {
                            break;
                        }
                        report.inboundRtpReport.rtpRemoteAudioLevel = stat.audioLevel ? stat.audioLevel : 0;
                        break;
                    case 'transport':
                        Object.keys(stat).forEach((statName) => {
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

            if (!report.rttMS.hasOwnProperty('currentRoundTripTime')) {
                if (!report.rttMS.hasOwnProperty('roundTripTime')) {
                    report.rttMS.currentRoundTripTime = this.preRTT.currentRoundTripTime;
                } else {
                    report.rttMS.currentRoundTripTime = report.rttMS.roundTripTime; // for Firefox
                    delete report.rttMS.roundTripTime;
                }
            } else {
                report.rttMS.currentRoundTripTime = Math.round(report.rttMS.currentRoundTripTime * 1000);
            }

            if (report.rttMS.hasOwnProperty('currentRoundTripTime')) {
                this.preRTT.currentRoundTripTime = report.rttMS.currentRoundTripTime;
            }

            this.onRTPStat(report, this.session);
            this.session.emit('rtpStat', report);
        } catch (e) {
            (this.session as any).logger.error(`${this.tag}: Unable to get media stats: ${e.message}`);
        }
    }

    public constructor(session) {
        this.ktag = 'MediaStreams';
        if (!session) {
            (this.session as any).logger.error(
                `${this.ktag}: Cannot initial media stream monitoring. The session cannot be null`
            );
            return;
        }
        this.session = session;
        this.onMediaConnectionStateChange = null;
        this.onPeerConnectionStateChange = this.onPeerConnectionStateChange.bind(this);
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler as SessionDescriptionHandler;
        sessionDescriptionHandler.peerConnection.addEventListener(
            'iceconnectionstatechange',
            this.onPeerConnectionStateChange
        );
        this.isChrome = this.browser() === Browsers.Chrome;
        this.isFirefox = this.browser() === Browsers.Firefox;
        this.isSafari = this.browser() === Browsers.Safari;

        this.preRTT = { currentRoundTripTime: 0 };

        if (!this.isChrome && !this.isFirefox && !this.isSafari) {
            (this.session as any).logger.error(
                `${
                    this.ktag
                } The web browser ${this.browser()} is not in the recommended list [Chrome, Safari, Firefox] !`
            );
        }
    }

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

    public stopMediaStats() {
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.onRTPStat = null;
        }
    }

    public reconnectMedia(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.session
                .reinvite()
                .then(() => resolve())
                .catch(reject);
        });
    }

    public release() {
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.mediaStatsTimer = null;
        }
        const sessionDescriptionHandler = this.session.sessionDescriptionHandler as SessionDescriptionHandler;
        if (!sessionDescriptionHandler.peerConnection) {
            return;
        }
        sessionDescriptionHandler.peerConnection.removeEventListener(
            'iceconnectionstatechange',
            this.onPeerConnectionStateChange
        );
    }
}

export { MediaStreams };
