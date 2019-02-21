/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */

'use strict';
const $ = require('jquery');
global.scriptOwner = 'Jest Unit Test';

const {MediaStreams, MediaStreamsImpl} = require('../ringcentral-web-phone-media-engine');
const {EventEmitter} = require('../sip-0.11.6');

let globalEmitter = new EventEmitter();

globalEmitter.setMaxListeners(0);

class Navigator {
  constructor() {
    this.userAgent = 'Chrome';
  }
  get defaultUserAgent() {
    return 'Chrome';
  }
  get chrome() {
    return this.defaultUserAgent;
  }
  set chrome(name) {
    this.userAgent = name;
  }
  get firefox() {
    return 'Firefox';
  }
  set firefox(name) {
    this.userAgent = name;
  }

  set opera(name) {
    his.userAgent = name;
  }

  get opera() {
    return 'Opera';
  }

}

global.navigator = new Navigator();

class FadeSessionDescriptionHandler {
    constructor(label) {
        this.label = label;
        this.peerConnection = new FadePeerConnection();
    }

    testEvent(event) {
        globalEmitter.emit(event, this.peerConnection);
    }

    onPeerConnectionStateChange(event) {
        console.log(event);
    }

    on(event, func) {
        globalEmitter.on(event, func);
    }

    removeListener(event, func) {
        globalEmitter.removeListener(event, func);
    }

    listeners(event) {
      return globalEmitter.listeners(event);
    }

} 

class FadeSession {
    constructor() {
        this.sessionDescriptionHandler = new FadeSessionDescriptionHandler('sdp1');
        this.ua = {};
        this.ua.defaultHeaders = {};
        this.logger = new class Logger {
          constructor() {
          }
          log(msg) {
            console.log(msg);
          }
      
          error(msg) {
            console.log(msg);
          }
        };
    }

    set sessionOptions(options) {
      this.sessionOptions_ = options;
    }

    get sessionOptions() {
      return this.sessionOptions_;
    }

    emit(event, parameter) {
        globalEmitter.emit(event, parameter);
    }

    on(event, parameter) {
        globalEmitter.on(event, parameter);
    }

    reinvite(options) {
      this.sessionOptions = options;
    }

    listeners(event) {
      return globalEmitter.listeners(event);
    }
}


class FadeStream {
    constructor(label) {
        this.label = label;
    }
}

class FadePeerConnection {
    constructor() {
        this.connectionState = 'new';
        this.iceConnectionStates = {
            'new': 'mediaConnectionStateNew',
            'checking': 'mediaConnectionStateChecking',
            'connected': 'mediaConnectionStateConnected',
            'completed': 'mediaConnectionStateCompleted',
            'failed': 'mediaConnectionStateFailed',
            'disconnected': 'mediaConnectionStateDisconnected',
            'closed': 'mediaConnectionStateClosed'
        }
        this.localDescription = {
            sdp: 'c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n',
            type: 'offer'
        };
        this.chromeStats = [
            {'type' : 'inbound-rtp',
            'bytesReceived': 100,
            'packetsReceived': 200,
            'jitter': 300,
            'packetsLost': 400, 
            'fractionLost': 500,
            'mediaType': 'audio',
          },
          { 'type': 'outbound-rtp',
            'bytesSent': 100,
            'packetsSent': 200,
            'mediaType': 'audio'
          }, 
          {
            'type': 'candidate-pair',
            'currentRoundTripTime' : 1.05
          }
        ];
        this.firefoxStats = [
          {'type' : 'inbound-rtp',
          'bytesReceived': 100,
          'packetsReceived': 200,
          'jitter': 300,
          'packetsLost': 400, 
          'roundTripTime': 1000,
          'mediaType': 'audio',
        },
        { 'type': 'outbound-rtp',
          'bytesSent': 100,
          'packetsSent': 200,
          'mediaType': 'audio'
        }, 
        {
          'type': 'candidate-pair',
          'whatever' : 1.05
        }
      ];
    }
    set iceConnectionState(state) {
        this.connectionState = state;
    }
    get iceConnectionState() {
        return this.connectionState;
    }

    set localOffer(offer) {
      this.localOffer_ = offer;
    }

    get localOffer() {
      return this.localOffer_;
    }

    createOffer(options) {
      var offer = {};
      if (!options.hasOwnProperty('ok')) {
        options.ok = true;
      }

      let promise = new Promise(function(resolve, reject) {
        if (options.ok === true) {
          resolve(options);//offer = options
        } else {
          reject(options)//error = options
        }
      });
      return promise;
    }

    setLocalDescription(offer) {
        if (!offer.hasOwnProperty('offerok')) {
          offer.offerok = true;
        }
        this.localOffer = offer;
        var self = this;
        let promise = new Promise(function(resolve, reject) {
          if (offer.offerok === true) {
            resolve('true');
          } else {
            self.localOffer.reject = 'yes';
            reject('false');
          }
        });
        return promise;
    }

    getStats() {
      return new Promise((resolve, reject) => {
        if (global.navigator.userAgent === 'Chrome') {
          resolve(this.chromeStats);
        } else  if (global.navigator.userAgent === global.navigator.firefox) {
          resolve(this.firefoxStats);
        } else {
          reject('unknown browser');
        }
      });
    }

}

test('input wrong parameters in MediaStreamsImpl constructor', () => {
  let  mediaStreams = null;
  try {
    mediaStreams = new MediaStreamsImpl(null);
  } catch(e) {
    expect(e.message).toBe('Fail to create the media session. session is null or undefined!');
    expect(mediaStreams).toBe(null);
  }

});


test('test media connection - event received in session', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.on('mediaConnectionStateNew', function(parameter) {
        fadeSession.testState = 'new';
    });
    fadeSession.sessionDescriptionHandler.testEvent('iceConnection'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('new');
    let f = mediaStreams.onPeerConnectionStateChange.bind(mediaStreams);
    let r = f === mediaStreams.onPeerConnectionStateChange.bind(mediaStreams);
    mediaStreams.release();
});

test('test media connection - callback in MediaStreamsImpl class', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.onMediaConnectionStateChange = function(session, eventState) {
      fadeSession.testState = 'new';
    }
    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.sessionDescriptionHandler.testEvent('iceConnection'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('new');
    mediaStreams.release();
});

test('test media connection - callback in session', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    fadeSession.onMediaConnectionStateChange = function(session, eventState) {
      fadeSession.testState = 'new';
    }
    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.sessionDescriptionHandler.testEvent('iceConnection'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('new');
    mediaStreams.release();
});

test('test media connection - event - checking ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.on('mediaConnectionStateChecking', function(parameter) {
        fadeSession.testState = 'checking';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'checking';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionChecking'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('checking');   
    mediaStreams.release();
});


test('test media connection - event - connected ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.on('mediaConnectionStateConnected', function(parameter) {
        fadeSession.testState = 'connected';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'connected';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionConnected'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('connected');   
      mediaStreams.release();
});


test('test media connection - event - completed ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.on('mediaConnectionStateCompleted', function(parameter) {
        fadeSession.testState = 'completed';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'completed';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionCompleted'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('completed');   
      mediaStreams.release();
});


test('test media connection - event - failed ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.on('mediaConnectionStateFailed', function(parameter) {
        fadeSession.testState = 'failed';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'failed';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionFailed'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('failed');   
      mediaStreams.release();
});

test('test media connection - event - disconnected ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.on('mediaConnectionStateDisconnected', function(parameter) {
        fadeSession.testState = 'disconnected';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'disconnected';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionDisconnected'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('disconnected');   
    mediaStreams.release();
});


test('test media connection - event - closed ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);

    mediaStreams.on = function(event, func) {
       globalEmitter.on(event, func);
    }
    fadeSession.on('mediaConnectionStateClosed', function(parameter) {
        fadeSession.testState = 'closed';
    });
    fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'closed';

    fadeSession.sessionDescriptionHandler.testEvent('iceConnectionClosed'); 
  
    await expect(new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(fadeSession.testState);
          }, 500);
      })).resolves.toEqual('closed');   
    mediaStreams.release();
});

test('test change media stream', () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    mediaStreams.localStream = new FadeStream('lStream2');
    mediaStreams.remoteStream = new FadeStream('rStream2');
    expect(mediaStreams.localStream.label).toEqual('lStream2');
    expect(mediaStreams.remoteStream.label).toEqual('rStream2');
  mediaStreams.release();
});


test('test media reconnect with invalid parameters', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
  
    mediaStreams.reconnectMedia();
    var pc = fadeSession.sessionDescriptionHandler.peerConnection; 
  
    await expect(new Promise(function(resolve, reject) {
      setTimeout(() => {
          resolve(pc.localOffer);
        }, 500);
    })).resolves.toBeDefined();
    var offer = pc.localOffer;
    expect(offer.ok).toBe(true);
    mediaStreams.release();
  });
  
  test('test media reconnect with the correct customized settings', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
  
    var options = {};
    options.RTCOptions = {
      audio: 10,
      video: 100,
      restart: 15,
      ok: true
    };
  
    mediaStreams.reconnectMedia(options, null);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection; 
  
    await expect(new Promise(function(resolve, reject) {
      setTimeout(() => {
          resolve(pc.localOffer);
        }, 500);
    })).resolves.toBeDefined()
    var offer = pc.localOffer;
    expect(offer.audio).toBe(10);
    expect(offer.video).toBe(100);
    expect(offer.restart).toBe(15);
    expect(offer.ok).toBe(true);
    mediaStreams.release();
  });

  test('test media reconnect with the empty session', async () => {
    global.console = {
      warn: jest.fn(),
      log: jest.fn()
    }
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    mediaStreams.fadeSession = null;
    (function(){
      mediaStreams.reconnectMedia(null, null);
  
      var prefix = [new Date(), 'WebPhone'];
      var label = 'MediaStreams';
      if (label) {
        prefix.push(label);
      }
      var content = 'The session cannot be empty';
      content = prefix.concat(content).join(' | ');
    
      expect(global.console.log).toHaveBeenCalledWith(content);    
    });
  
    mediaStreams.reconnectMedia(null);
  
    (function(){
      var prefix = [new Date(), 'WebPhone'];
      var label = 'MediaStreams';
      if (label) {
        prefix.push(label);
      }
      var content = 'The session is null';
      content = prefix.concat(content).join(' | ');
    
      expect(global.console.log).toHaveBeenCalledWith(content);
    });
    mediaStreams.release();
  });


  test('test media reconnect - fail to set local offer', async () => {
    

    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
  
    var options = {};
    options.RTCOptions = {
      audio: 100,
      video: 1001,
      restart: 151,
      ok: true,
      offerok:true
    };
  
    mediaStreams.reconnectMedia(options, null);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection; 
  
    await expect(new Promise(function(resolve, reject) {
      setTimeout(() => {
          resolve(pc.localOffer);
        }, 500);
    })).resolves.toBeDefined();

    options.RTCOptions = {
        audio: 200,
        video: 2001,
        restart: 251,
        ok: true,
        offerok:false
    };


    mediaStreams.reconnectMedia(options);

    await (function () {return new Promise(function(resolve, reject) {
        setTimeout(() => {
          resolve(pc.localOffer.reject);
        }, 500);
      }).then (data => {
          expect(data).toBe('yes');
      })().resolves.toBeDefined()});
    mediaStreams.release();
  });

  test('test media reconnect - check validateSDP', () => {
    let fadeSession = new FadeSession();
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

  test('test media reconnect in MediaStreamsImpl- check getIPInSDP', () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);
    var case1 = mediaStreams.getIPInSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n', 'c=IN');
    expect(case1).toBe('50.237.72.154');
    var case2 = mediaStreams.getIPInSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.155\r\n', 'a=rtcp');
    expect(case2).toBe('50.237.72.155');
    var case3 = mediaStreams.getIPInSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.155\r\n', 'a=rtcpw');
    expect(case3).toBe(null);
    var case4 = mediaStreams.getIPInSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.155\r\n', 'c=IN IP4');
    expect(case4).toBe('50.237.72.154');
    var case5 = mediaStreams.getIPInSDP('c=IN IP4 50.237.72.154 a=rtcp:61349 IN IP4 50.237.72.155\r\n', 'c=IN IP4');
    expect(case5).toBe('50.237.72.154');
    var case6 = mediaStreams.getIPInSDP('c=IN IP4 50.237.72.154 a=rtcp:61349 IN IP4 50.237.72.155', 'c=IN IP4');
    expect(case6).toBe('50.237.72.154');
    var case6 = mediaStreams.getIPInSDP('c=IN IP4 50.237.72.154 a=rtcp:61349 IN IP4 50.237.72.155', 'a=rtcp');
    expect(case6).toBe(null);
    mediaStreams.release();
  });

  test('test getMediaStats in MediaStreamsImpl- getMediaStats(func, interval)', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    jest.useFakeTimers();
    mediaStreams.getMediaStats(function(report, session) {
      console.log('test');
    }, 1000);
    expect(setInterval).toHaveBeenCalledTimes(1);
    mediaStreams.release();
  });

  test('test getMediaStats in MediaStreamsImpl - getMediaStats(func)', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    jest.useFakeTimers();
    mediaStreams.getMediaStats(function(report, session) {
      console.log('test');
    });
    expect(setInterval).toHaveBeenCalledTimes(1);
    mediaStreams.release();
  });

  test('test getMediaStats in MediaStreamsImpl - getMediaStats()', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
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
    }
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.preRTT['currentRoundTripTime']).toEqual(0);
    pc.iceConnectionState = 'connected';
    mediaStreams.mediaStatsTimerCallback();
    (function(){
    var prefix = [new Date(), 'WebPhone'];
    var label = '';
    if (label) {
      prefix.push(label);
    }
    var content = 'MediaStreams No callback to accept receive media report. usage: session.on("rtpStat") = function(report) or session.onRTPStat = function(report) or set a mediaCallback as a paramter';
    //content = prefix.concat(content).join(' | ');
    expect(global.console.log).toHaveBeenCalledWith(content);
   })();
   mediaStreams.release();
  });

  test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - listen on the event', () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    let mockCallback = jest.fn(report => {
    });
    mediaStreams.getRTPReport = jest.fn((reports) => {
    });
    fadeSession.on('rtpStat', mockCallback);
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport.mock.calls.length).toBe(1);
    mediaStreams.release();
  });

  test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - session.onRTPStat ', () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    mediaStreams.getRTPReport = jest.fn((reports) => {
    });
    fadeSession.onRTPStat = function(report, session) {
    };
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport.mock.calls.length).toBe(1);
    mediaStreams.release();
  });


  test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - session.mediaStreams.onRTPStat ', () => {
    global.console = {
      warn: jest.fn(),
      log: jest.fn()
    }
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    mediaStreams.getRTPReport = jest.fn((reports) => {
    });
    mediaStreams.onRTPStat = function(report, session) {
    };
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport.mock.calls.length).toBe(1);
    mediaStreams.release();
  });


  test('test getMediaStats  in MediaStreamsImpl- mediaStatsTimerCallback -  if (connectionState !== "connected" && connectionState !== "completed") ', () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'new';
    mediaStreams.getRTPReport = jest.fn((reports) => {
    });
    mediaStreams.onRTPStat = function(report, session) {
    };
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport.mock.calls.length).toBe(0);
    mediaStreams.release();
  });


  test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback -  if (!pc)) ', () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'new';
    mediaStreams.getRTPReport = jest.fn((reports) => {
    });
    mediaStreams.onRTPStat = function(report, session) {
    };
    pc = null;
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport.mock.calls.length).toBe(0);
    mediaStreams.release();
  });

  test('test getRTPReport in MediaStreamsImpl -- session.mediaStreams.onRTPStat', async () => {
    global.navigator.userAgent = global.navigator.chrome;
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    mediaStreams.onRTPStat = jest.fn((report, session) => { 
    });
    await mediaStreams.getRTPReport(new mediaStreams.RTPReports());
    expect(mediaStreams.onRTPStat.mock.calls.length).toBe(1);
    mediaStreams.release();
  });

  test('test getRTPReport in MediaStreamsImpl-- session.onRTPStat', async () => {
    global.navigator.userAgent = global.navigator.chrome;
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    fadeSession.onRTPStat = jest.fn((report, session) => {
    });
    await mediaStreams.getRTPReport(new mediaStreams.RTPReports());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
    mediaStreams.release();
  });

  test('test getRTPReport  in MediaStreamsImpl-- session.on("rtpStat")', async() => {
    global.navigator.userAgent = global.navigator.chrome;
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    let onRTPStat = jest.fn(function (report, session) {
    });
    fadeSession.onRTPStat = null;
    mediaStreams.onRTPStat = null;
    fadeSession.on("rtpStat", onRTPStat);
    await mediaStreams.getRTPReport(new mediaStreams.RTPReports());
    expect(onRTPStat.mock.calls.length).toBe(1);
    mediaStreams.release();
  });

  test('test getRTPReport in MediaStreamsImpl -- verify chrome and safari', async () => {
    global.navigator.userAgent = global.navigator.chrome;
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    let reports = {};
    fadeSession.onRTPStat = jest.fn((report, session) => {
      reports = report;
    });
    await mediaStreams.getRTPReport(new mediaStreams.RTPReports());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
    expect(reports.inboundRTPReport['bytesReceived']).toEqual(100);
    expect(reports.inboundRTPReport['packetsReceived']).toEqual(200);
    expect(reports.inboundRTPReport['jitter']).toEqual(300);
    expect(reports.inboundRTPReport['packetsLost']).toEqual(400);
    expect(reports.inboundRTPReport['fractionLost']).toEqual(500);
    expect(reports.inboundRTPReport['mediaType']).toEqual('audio');
    expect(reports.outboundRtpReport['bytesSent']).toEqual(100);
    expect(reports.outboundRtpReport['packetsSent']).toEqual(200);
    expect(reports.outboundRtpReport['mediaType']).toEqual('audio');
    expect(reports.rttMS['currentRoundTripTime']).toEqual(1.05*1000);
    mediaStreams.release();

  });

  test('test getRTPReport in MediaStreamsImpl -- verify firefox', async () => {
    global.navigator.userAgent = global.navigator.firefox;
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    let reports = {};
    fadeSession.onRTPStat = jest.fn((report, session) => {
      reports = report;
    });
    await mediaStreams.getRTPReport(new mediaStreams.RTPReports());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
    expect(reports.inboundRTPReport['bytesReceived']).toEqual(100);
    expect(reports.inboundRTPReport['packetsReceived']).toEqual(200);
    expect(reports.inboundRTPReport['jitter']).toEqual(300);
    expect(reports.inboundRTPReport['packetsLost']).toEqual(400);
    expect (typeof reports.inboundRTPReport['fractionLost']).toEqual('undefined');
    expect(reports.inboundRTPReport['mediaType']).toEqual('audio');
    expect(reports.outboundRtpReport['bytesSent']).toEqual(100);
    expect(reports.outboundRtpReport['packetsSent']).toEqual(200);
    expect(reports.outboundRtpReport['mediaType']).toEqual('audio');
    expect(reports.rttMS['currentRoundTripTime']).toEqual(1000);
    mediaStreams.release();
  });


  test('test getRTPReport in MediaStreamsImpl -- unknow browser and fail to get the statistics', async () => {
    global.navigator.userAgent = 'unknow';
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreamsImpl(fadeSession);  
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'connected';
    let reports = {};
    fadeSession.onRTPStat = jest.fn((report, session) => {
      reports = report;
    });
    await mediaStreams.getRTPReport(new mediaStreams.RTPReports());
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(0);
    mediaStreams.release();
  });

  test('test getRTPReport in MediaStreamsImpl -- test web browser() type', async () => {
    let fadeSession = new FadeSession();
    let mediaStreams = new MediaStreamsImpl(fadeSession);  
    for (let i in  mediaStreams.browsers) {
      global.navigator.userAgent = i;
      expect(mediaStreams.browser()).toEqual(mediaStreams.browsers[i]);
    }
    mediaStreams.release();
  });

  test('test MediaStreamsImpl and getMediaStats -- release without timer', async () => {
    let fadeSession = new FadeSession();
    let mediaStreams = new MediaStreamsImpl(fadeSession);  
    let rtpStatInSession = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    expect(rtpStatInSession.length).toEqual(1);
    mediaStreams.release();
    let rtpStatInSession2 = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    expect(rtpStatInSession.length-rtpStatInSession2.length).toEqual(1);
  });

  test('test MediaStreamsImpl and getMediaStats -- release with stopMediaStat', async () => {
    let fadeSession = new FadeSession();
    let mediaStreams = new MediaStreamsImpl(fadeSession);  
    let rtpStatInSession = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    let pc = fadeSession.sessionDescriptionHandler.peerConnection;
    expect(rtpStatInSession.length).toEqual(1);
    pc.iceConnectionState = 'connected';
    fadeSession.onRTPStat = jest.fn((report, session) => {
      reports = report;
    });
    mediaStreams.getMediaStats(fadeSession.onRTPStat, 2000);
    mediaStreams.release();
    let rtpStatInSession2 = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
    expect(rtpStatInSession.length-rtpStatInSession2.length).toEqual(1);
    expect(fadeSession.onRTPStat.mock.calls.length).toBe(0);
  });

  test('test MediaStreamsImpl and getMediaStats -- opera', async () => {
    global.navigator.userAgent = global.navigator.opera;
    let fadeSession = new FadeSession();
    let mediaStreams = new MediaStreamsImpl(fadeSession);  
    expect(mediaStreams.RTPReports).not.toBeNull();   
  });

  test('test property onRTPStat in MediaStreams', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession);
  
    var options = {};
    options.RTCOptions = {
      audio: 10,
      video: 100,
      restart: 15,
      ok: true
    };
    let onRTPStat = jest.fn((report, session) => {
    });
    mediaStreams.onRTPStat = onRTPStat;
    expect(onRTPStat).toEqual(mediaStreams.mediaStreamsImpl.onRTPStat);
    mediaStreams.release();
  });

  test('test property onMediaConnectionStateChange in MediaStreams', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession);
  
    var options = {};
    options.RTCOptions = {
      audio: 10,
      video: 100,
      restart: 15,
      ok: true
    };
    let onMediaConnectionStateChange = jest.fn((state, session) => {
    });
    mediaStreams.onMediaConnectionStateChange = onMediaConnectionStateChange;
    expect(onMediaConnectionStateChange).toEqual(mediaStreams.mediaStreamsImpl.onMediaConnectionStateChange);
    mediaStreams.release();
  });