
const $ = require('jquery');
global.scriptOwner = 'Jest Unit Test';
/*
  Need to add the code below to the file ringcentral-web-phone-media-engine.js:

  const {setRCWPLoggerCallBack, setRCWPLoggerEnabled, setRCWPLoggerLevel,
  rcWPLoge, rcWPLogw, rcWPLogi, rcWPLogd, 
  rcWPLogemd, rcWPLogwmd, rcWPLogimd, rcWPLogdmd, 
  rcWPLogeme, rcWPLogwme, rcWPLogime, rcWPLogdme} = require("./ringcentral-web-phone-logger");
  
*/
const {setRCWPLoggerCallBack, setRCWPLoggerEnabled, setRCWPLoggerLevel,
    rcWPLoge, rcWPLogw, rcWPLogi, rcWPLogd, 
    rcWPLogemd, rcWPLogwmd, rcWPLogimd, rcWPLogdmd, 
    rcWPLogeme, rcWPLogwme, rcWPLogime, rcWPLogdme} = require("../ringcentral-web-phone-logger");

global.rcWPLogd = rcWPLogd;

const MediaStreams = require('../ringcentral-web-phone-media-engine');
const {SIP, EventEmitter} = require('../sip-0.11.6');

globalEmitter = new EventEmitter();

globalEmitter.setMaxListeners(0);

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

} 

class FadeSession {
    constructor() {
        this.sessionDescriptionHandler = new FadeSessionDescriptionHandler('sdp1');
        this.ua = {};
        this.ua.defaultHeaders = {};
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
            resolve();
          } else {
            self.localOffer.reject = 'yes';
            reject();
          }
        });
        return promise;
    }

}

test('input wrong parameters in mediastream constructor', () => {
  var mediaStreams = new MediaStreams(null, null, null);

  expect(mediaStreams).not.toBe(null);

});


test('test media connection - event received in session', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});

test('test media connection - callback in MediaStreams class', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});

test('test media connection - callback in session', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});

test('test media connection - event - checking ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});


test('test media connection - event - connected ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});


test('test media connection - event - completed ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});


test('test media connection - event - failed ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});

test('test media connection - event - disconnected ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});


test('test media connection - event - closed ', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));

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
});

test('test change media stream', () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));
    mediaStreams.localStream = new FadeStream('lStream2');
    mediaStreams.remoteStream = new FadeStream('rStream2');
    expect(mediaStreams.localStream.label).toEqual('lStream2');
    expect(mediaStreams.remoteStream.label).toEqual('rStream2');
});


test('test media reconnect with invalid parameters', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));
  
    mediaStreams.reconnectMedia();
    var pc = fadeSession.sessionDescriptionHandler.peerConnection; 
  
    await expect(new Promise(function(resolve, reject) {
      setTimeout(() => {
          resolve(pc.localOffer);
        }, 500);
    })).resolves.toBeDefined()
    var offer = pc.localOffer;
    expect(offer.ok).toBe(true);
  });
  
  test('test media reconnect with the correct customized settings', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));
  
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
  
  });

  test('test media reconnect with the empty session', async () => {
    global.console = {
      warn: jest.fn(),
      log: jest.fn()
    }
    var mediaStreams = new MediaStreams(null, new FadeStream('lStream1'), new FadeStream('rStream1'));
  
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
  
  });


  test('test media reconnect - fail to set local offer', async () => {
    

    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1'));
  
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
    })).resolves.toBeDefined()

    options.RTCOptions = {
        audio: 200,
        video: 2001,
        restart: 251,
        ok: true,
        offerok:false
    };


    mediaStreams.reconnectMedia(options, null);

    new Promise(function(resolve, reject) {
        setTimeout(() => {
          resolve(pc.localOffer.reject);
        }, 500);
      }).then (data => {
          expect(data).toBe('yes');
      });

  });

  test('test media reconnect - check validateSDP', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1')); 
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
  });

  test('test media reconnect - check getIPInSDP', async () => {
    let fadeSession = new FadeSession();
    var mediaStreams = new MediaStreams(fadeSession, new FadeStream('lStream1'), new FadeStream('rStream1')); 
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

  });