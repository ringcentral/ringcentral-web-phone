/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */

import {default as MediaStreams, MediaStreamsImpl, RTPReport, Browsers} from '../src/mediaStreams';
import EventEmitter from 'events';

const globalEmitter = new EventEmitter();

globalEmitter.setMaxListeners(0);

class Navigator {
    public userAgent: string;
    public constructor() {
        this.userAgent = 'Chrome';
    }
    public get defaultUserAgent() {
        return 'Chrome';
    }
    public get chrome() {
        return this.defaultUserAgent;
    }
    public set chrome(name) {
        this.userAgent = name;
    }
    public get firefox() {
        return 'Firefox';
    }
    public set firefox(name) {
        this.userAgent = name;
    }

    public set opera(name) {
        this.userAgent = name;
    }

    public get opera() {
        return 'Opera';
    }
}

global['navigator'] = new Navigator();

class FadeSessionDescriptionHandler {
    public label;
    public peerConnection = new FadePeerConnection();

    public constructor(label) {
        this.label = label;
    }

    public testEvent(event) {
        globalEmitter.emit(event, this);
    }

    public onPeerConnectionStateChange(event) {
        console.log(event);
    }

    public on(event, func) {
        globalEmitter.on(event, func);
    }

    public removeListener(event, func) {
        globalEmitter.removeListener(event, func);
    }

    public listeners(event) {
        return globalEmitter.listeners(event);
    }
}

class FadeSession {
    public sessionDescriptionHandler;
    public onMediaConnectionStateChange;
    public ua;
    public logger;
    public testState;
    public sessionOptions_;
    public onRTPStat;
    public constructor() {
        this.sessionDescriptionHandler = new FadeSessionDescriptionHandler('sdp1');
        this.ua = {};
        this.ua.defaultHeaders = {};
        this.logger = new (class Logger {
            public constructor() {}
            public log(msg) {
                console.log(msg);
            }
            public error(msg) {
                console.log(msg);
            }
        })();
    }

    public set sessionOptions(options) {
        this.sessionOptions_ = options;
    }

    public get sessionOptions() {
        return this.sessionOptions_;
    }

    public emit(event, parameter) {
        globalEmitter.emit(event, parameter);
    }

    public on(event, parameter) {
        globalEmitter.on(event, parameter);
    }

    public reinvite(options) {
        this.sessionOptions = options;
    }

    public listeners(event) {
        return globalEmitter.listeners(event);
    }
}

class FadeStream {
    public label;
    public constructor(label) {
        this.label = label;
    }
}

class FadePeerConnection {
    public connectionState;
    public iceConnectionStates;
    public localDescription;
    public chromeStats;
    public firefoxStats;
    public localOffer_;
    public constructor() {
        this.connectionState = 'new';
        this.iceConnectionStates = {
            new: 'mediaConnectionStateNew',
            checking: 'mediaConnectionStateChecking',
            connected: 'mediaConnectionStateConnected',
            completed: 'mediaConnectionStateCompleted',
            failed: 'mediaConnectionStateFailed',
            disconnected: 'mediaConnectionStateDisconnected',
            closed: 'mediaConnectionStateClosed'
        };
        this.localDescription = {
            sdp: 'c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n',
            type: 'offer'
        };
        this.chromeStats = [
            {
                type: 'inbound-rtp',
                bytesReceived: 100,
                packetsReceived: 200,
                jitter: 300,
                packetsLost: 400,
                fractionLost: 500,
                mediaType: 'audio'
            },
            {
                type: 'outbound-rtp',
                bytesSent: 100,
                packetsSent: 200,
                mediaType: 'audio'
            },
            {
                type: 'candidate-pair',
                currentRoundTripTime: 1.05
            }
        ];
        this.firefoxStats = [
            {
                type: 'inbound-rtp',
                bytesReceived: 100,
                packetsReceived: 200,
                jitter: 300,
                packetsLost: 400,
                roundTripTime: 1000,
                mediaType: 'audio'
            },
            {
                type: 'outbound-rtp',
                bytesSent: 100,
                packetsSent: 200,
                mediaType: 'audio'
            },
            {
                type: 'candidate-pair',
                whatever: 1.05
            }
        ];
    }
    public set iceConnectionState(state) {
        this.connectionState = state;
    }
    public get iceConnectionState() {
        return this.connectionState;
    }

    public set localOffer(offer) {
        this.localOffer_ = offer;
    }

    public get localOffer() {
        return this.localOffer_;
    }

    public createOffer(options) {
        var offer = {};
        if (!options.hasOwnProperty('ok')) {
            options.ok = true;
        }

        return new Promise(function(resolve, reject) {
            if (options.ok === true) {
                resolve(options); //offer = options
            } else {
                reject(options); //error = options
            }
        });
    }

    public setLocalDescription(offer) {
        if (!offer.hasOwnProperty('offerok')) {
            offer.offerok = true;
        }
        this.localOffer = offer;
        var self = this;
        return new Promise(function(resolve, reject) {
            if (offer.offerok === true) {
                resolve('true');
            } else {
                self.localOffer.reject = 'yes';
                reject('false');
            }
        });
    }

    public getStats() {
        return new Promise((resolve, reject) => {
            if (global['navigator'].userAgent === 'Chrome') {
                resolve(this.chromeStats);
            } else if (global['navigator'].userAgent === global['navigator'].firefox) {
                resolve(this.firefoxStats);
            } else {
                reject('unknown browser');
            }
        });
    }
}

test('input wrong parameters in MediaStreamsImpl constructor', () => {
    let mediaStreams = null;
    try {
        mediaStreams = new MediaStreamsImpl(null);
    } catch (e) {
        expect(e.message).toBe('Fail to create the media session. session is null or undefined!');
        expect(mediaStreams).toBe(null);
    }
});

test('test media connection - event received in session', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.on('mediaConnectionStateNew', function(parameter) {
        fadeSession.testState = 'new';
    });
    fadeSession.sessionDescriptionHandler.testEvent('iceConnection');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('new');
    const f = mediaStreams.onPeerConnectionStateChange.bind(mediaStreams);
    const r = f === mediaStreams.onPeerConnectionStateChange.bind(mediaStreams);
    mediaStreams.release();
});

test('test media connection - callback in MediaStreamsImpl class', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.onMediaConnectionStateChange = function(session, eventState) {
        fadeSession.testState = 'new';
    };
    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.sessionDescriptionHandler.testEvent('iceConnection');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('new');
    mediaStreams.release();
});

test('test media connection - callback in session', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    fadeSession.onMediaConnectionStateChange = function(session, eventState) {
        fadeSession.testState = 'new';
    };
    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.sessionDescriptionHandler.testEvent('iceConnection');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('new');
    mediaStreams.release();
});

test('test media connection - event - checking ', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.on('mediaConnectionStateChecking', function(parameter) {
        fadeSession.testState = 'checking';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'checking';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionChecking');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('checking');
    mediaStreams.release();
});

test('test media connection - event - connected ', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.on('mediaConnectionStateConnected', function(parameter) {
        fadeSession.testState = 'connected';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'connected';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionConnected');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('connected');
    mediaStreams.release();
});

test('test media connection - event - completed ', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.on('mediaConnectionStateCompleted', function(parameter) {
        fadeSession.testState = 'completed';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'completed';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionCompleted');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('completed');
    mediaStreams.release();
});

test('test media connection - event - failed ', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.on('mediaConnectionStateFailed', function(parameter) {
        fadeSession.testState = 'failed';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'failed';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionFailed');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('failed');
    mediaStreams.release();
});

test('test media connection - event - disconnected ', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.on('mediaConnectionStateDisconnected', function(parameter) {
        fadeSession.testState = 'disconnected';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'disconnected';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionDisconnected');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('disconnected');
    mediaStreams.release();
});

test('test media connection - event - closed ', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
        globalEmitter.on(event, func);
    };
    fadeSession.on('mediaConnectionStateClosed', function(parameter) {
        fadeSession.testState = 'closed';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'closed';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionClosed');

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(fadeSession.testState);
            }, 500);
        })
    ).resolves.toEqual('closed');
    mediaStreams.release();
});

test('test change media stream', () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    mediaStreams.localStream = new FadeStream('lStream2');
    mediaStreams.remoteStream = new FadeStream('rStream2');
    expect(mediaStreams.localStream.label).toEqual('lStream2');
    expect(mediaStreams.remoteStream.label).toEqual('rStream2');
    mediaStreams.release();
});

test('test media reconnect with invalid parameters', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.reconnectMedia();
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(pc.localOffer);
            }, 500);
        })
    ).resolves.toBeDefined();
    var offer = pc.localOffer;
    expect(offer.ok).toBe(true);
    mediaStreams.release();
});

test('test media reconnect with the correct customized settings', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    var options: any = {};
    options.RTCOptions = {
        audio: 10,
        video: 100,
        restart: 15,
        ok: true
    };

    mediaStreams.reconnectMedia(options);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;

    await expect(
        new Promise(function(resolve, reject) {
            setTimeout(() => {
                resolve(pc.localOffer);
            }, 500);
        })
    ).resolves.toBeDefined();
    var offer = pc.localOffer;
    expect(offer.audio).toBe(10);
    expect(offer.video).toBe(100);
    expect(offer.restart).toBe(15);
    expect(offer.ok).toBe(true);
    mediaStreams.release();
});

test('test media reconnect - fail to set local offer', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    var options: any = {};
    options.RTCOptions = {
        audio: 100,
        video: 1001,
        restart: 151,
        ok: true,
        offerok: true
    };

    await mediaStreams.reconnectMedia(options);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;

    expect(pc.localOffer).toBeDefined();

    options.RTCOptions = {
        audio: 200,
        video: 2001,
        restart: 251,
        ok: true,
        offerok: false
    };

    await expect(mediaStreams.reconnectMedia(options)).rejects.toBeDefined();
    expect(pc.localOffer.reject).toEqual('yes');
    mediaStreams.release();
});

test.skip('test media reconnect - check validateSDP', () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    var case1 = mediaStreams.validateSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n');
    expect(case1).toBe(true);
    var case2 = mediaStreams.validateSDP('c=IN IP4 0.0.0.0\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n');
    expect(case2).toBe(false);
    var case3 = mediaStreams.validateSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 0.0.0.0\r\n');
    expect(case3).toBe(false);
    var case4 = mediaStreams.validateSDP('c=IN IP4 0.0.0.0\r\na=rtcp:61349 IN IP4 0.0.0.0\r\n');
    expect(case4).toBe(false);
    var case5 = mediaStreams.validateSDP(null);
    expect(case4).toBe(false);
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl- getMediaStats(func, interval)', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    jest.useFakeTimers();
    mediaStreams.getMediaStats(function(report, session) {
        console.log('test');
    }, 1000);
    expect(setInterval).toHaveBeenCalledTimes(1);
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl - getMediaStats(func)', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    jest.useFakeTimers();
    mediaStreams.getMediaStats(function(report, session) {
        console.log('test');
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl - getMediaStats()', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    jest.useFakeTimers();
    mediaStreams.getMediaStats();
    expect(setInterval).toHaveBeenCalledTimes(1);
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl- mediaStatsTimerCallback - no callback', async () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    } as any;
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.preRTT['currentRoundTripTime']).toEqual(0);
    pc.iceConnectionState = 'connected';
    mediaStreams.mediaStatsTimerCallback();
    (function() {
        var prefix = [new Date(), 'WebPhone'];
        var label = '';
        if (label) {
            prefix.push(label);
        }
        var content =
            'MediaStreams No callback to accept receive media report. usage: session.on("rtpStat") = function(report) or session.onRTPStat = function(report) or set a mediaCallback as a paramter';
        //content = prefix.concat(content).join(' | ');
        expect(global.console.log).toHaveBeenCalledWith(content);
    })();
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - listen on the event', () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    const mockCallback = jest.fn(report => {});
    mediaStreams.getRTPReport = jest.fn(reports => {});
    fadeSession.on('rtpStat', mockCallback);
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(1);
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - session.onRTPStat ', () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    mediaStreams.getRTPReport = jest.fn(reports => {});
    fadeSession.onRTPStat = function(report, session) {};
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(1);
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - session.mediaStreams.onRTPStat ', () => {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    } as any;
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    mediaStreams.getRTPReport = jest.fn(reports => {});
    mediaStreams.onRTPStat = function(report, session) {};
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(1);
    mediaStreams.release();
});

test('test getMediaStats  in MediaStreamsImpl- mediaStatsTimerCallback -  if (connectionState !== "connected" && connectionState !== "completed") ', () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'new';
    mediaStreams.getRTPReport = jest.fn(reports => {});
    mediaStreams.onRTPStat = function(report, session) {};
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(0);
    mediaStreams.release();
});

test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback -  if (!pc)) ', () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'new';
    mediaStreams.getRTPReport = jest.fn(reports => {});
    mediaStreams.onRTPStat = function(report, session) {};
    pc = null;
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(0);
    mediaStreams.release();
});

test('test getRTPReport in MediaStreamsImpl -- session.mediaStreams.onRTPStat', async () => {
    global['navigator'].userAgent = global['navigator'].chrome;
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    mediaStreams.onRTPStat = jest.fn((report, session) => {});
    await mediaStreams.getRTPReport(new RTPReport());
    expect(mediaStreams.onRTPStat.mock.calls.length).toBe(1);
    mediaStreams.release();
});

test('test getRTPReport in MediaStreamsImpl-- session.onRTPStat', async () => {
    global['navigator'].userAgent = global['navigator'].chrome;
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    fadeSession.onRTPStat = jest.fn((report, session) => {});
    await mediaStreams.getRTPReport(new RTPReport());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
    mediaStreams.release();
});

test('test getRTPReport  in MediaStreamsImpl-- session.on("rtpStat")', async () => {
    global['navigator'].userAgent = global['navigator'].chrome;
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    const onRTPStat = jest.fn(function(report, session) {});
    fadeSession.onRTPStat = null;
    mediaStreams.onRTPStat = null;
    fadeSession.on('rtpStat', onRTPStat);
    await mediaStreams.getRTPReport(new RTPReport());
    expect(onRTPStat.mock.calls.length).toBe(1);
    mediaStreams.release();
});

test('test getRTPReport in MediaStreamsImpl -- verify chrome and safari', async () => {
    global['navigator'].userAgent = global['navigator'].chrome;
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    let reports: any = {};
    fadeSession.onRTPStat = jest.fn((report, session) => {
        reports = report;
    });
    await mediaStreams.getRTPReport(new RTPReport());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
    expect(reports.inboundRtpReport['bytesReceived']).toEqual(100);
    expect(reports.inboundRtpReport['packetsReceived']).toEqual(200);
    expect(reports.inboundRtpReport['jitter']).toEqual(300);
    expect(reports.inboundRtpReport['packetsLost']).toEqual(400);
    expect(reports.inboundRtpReport['fractionLost']).toEqual(500);
    expect(reports.inboundRtpReport['mediaType']).toEqual('audio');
    expect(reports.outboundRtpReport['bytesSent']).toEqual(100);
    expect(reports.outboundRtpReport['packetsSent']).toEqual(200);
    expect(reports.outboundRtpReport['mediaType']).toEqual('audio');
    expect(reports.rttMS['currentRoundTripTime']).toEqual(1.05 * 1000);
    mediaStreams.release();
});

test('test getRTPReport in MediaStreamsImpl -- verify firefox', async () => {
    global['navigator'].userAgent = global['navigator'].firefox;
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    let reports: any = {};
    fadeSession.onRTPStat = jest.fn((report, session) => {
        reports = report;
    });
    await mediaStreams.getRTPReport(new RTPReport());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
    expect(reports.inboundRtpReport['bytesReceived']).toEqual(100);
    expect(reports.inboundRtpReport['packetsReceived']).toEqual(200);
    expect(reports.inboundRtpReport['jitter']).toEqual(300);
    expect(reports.inboundRtpReport['packetsLost']).toEqual(400);
    expect(typeof reports.inboundRtpReport['fractionLost']).toEqual('undefined');
    expect(reports.inboundRtpReport['mediaType']).toEqual('audio');
    expect(reports.outboundRtpReport['bytesSent']).toEqual(100);
    expect(reports.outboundRtpReport['packetsSent']).toEqual(200);
    expect(reports.outboundRtpReport['mediaType']).toEqual('audio');
    expect(reports.rttMS['currentRoundTripTime']).toEqual(1000);
    mediaStreams.release();
});

test('test getRTPReport in MediaStreamsImpl -- unknow browser and fail to get the statistics', async () => {
    global['navigator'].userAgent = 'unknow';
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    let reports = {};
    fadeSession.onRTPStat = jest.fn((report, session) => {
        reports = report;
    });
    await mediaStreams.getRTPReport(new RTPReport());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(0);
    mediaStreams.release();
});

test('test getRTPReport in MediaStreamsImpl -- test web browser() type', async () => {
    const fadeSession = new FadeSession();
    const mediaStreams = new MediaStreamsImpl(fadeSession);
    for (const i in Browsers) {
        global['navigator'].userAgent = i;
        expect(mediaStreams.browser()).toEqual(Browsers[i]);
    }
    mediaStreams.release();
});

test('test MediaStreamsImpl and getMediaStats -- release without timer', async () => {
    const fadeSession = new FadeSession();
    const mediaStreams = new MediaStreamsImpl(fadeSession);
    const rtpStatInSession = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    expect(rtpStatInSession.length).toEqual(1);
    mediaStreams.release();
    const rtpStatInSession2 = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    expect(rtpStatInSession.length - rtpStatInSession2.length).toEqual(1);
});

test('test MediaStreamsImpl and getMediaStats -- release with stopMediaStat', async () => {
    const fadeSession = new FadeSession();
    const mediaStreams = new MediaStreamsImpl(fadeSession);
    const rtpStatInSession = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    const pc = fadeSession.sessionDescriptionHandler.peerConnection;
    let reports;
    expect(rtpStatInSession.length).toEqual(1);
    pc.iceConnectionState = 'connected';
    fadeSession.onRTPStat = jest.fn((report, session) => {
        reports = report;
    });
    mediaStreams.getMediaStats(fadeSession.onRTPStat, 2000);
    mediaStreams.release();
    const rtpStatInSession2 = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    expect(rtpStatInSession.length - rtpStatInSession2.length).toEqual(1);
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(0);
});

test('test MediaStreamsImpl and getMediaStats -- opera', async () => {
    global['navigator'].userAgent = global['navigator'].opera;
    const fadeSession = new FadeSession();
    const mediaStreams = new MediaStreamsImpl(fadeSession);
    expect(RTPReport).not.toBeNull();
});

test('test property onRTPStat in MediaStreams', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession);

    var options: any = {};
    options.RTCOptions = {
        audio: 10,
        video: 100,
        restart: 15,
        ok: true
    };
    const onRTPStat = jest.fn((report, session) => {});
    mediaStreams.onRTPStat = onRTPStat;
    expect(onRTPStat).toEqual(mediaStreams.mediaStreamsImpl.onRTPStat);
    mediaStreams.release();
});

test('test property onMediaConnectionStateChange in MediaStreams', async () => {
    const fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession);

    var options: any = {};
    options.RTCOptions = {
        audio: 10,
        video: 100,
        restart: 15,
        ok: true
    };
    const onMediaConnectionStateChange = jest.fn((state, session) => {});
    mediaStreams.onMediaConnectionStateChange = onMediaConnectionStateChange;
    expect(onMediaConnectionStateChange).toEqual(mediaStreams.mediaStreamsImpl.onMediaConnectionStateChange);
    mediaStreams.release();
});
