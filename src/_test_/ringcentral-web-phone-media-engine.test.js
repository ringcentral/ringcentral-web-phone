
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
    }

    emit(event, parameter) {
        globalEmitter.emit(event, parameter);
    }

    on(event, parameter) {
        globalEmitter.on(event, parameter);
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
    }
    set iceConnectionState(state) {
        this.connectionState = state;
    }
    get iceConnectionState() {
        return this.connectionState;
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

