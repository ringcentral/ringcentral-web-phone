import EventEmitter from 'events';
import { faker } from '@faker-js/faker'; // eslint-disable-line import/no-unresolved

import { default as MediaStreams, MediaStreamsImpl, Browsers, WebPhoneRTPReport } from '../src/mediaStreams';
import { Events } from './events';

// #region Mocks
class MockNavigator {
    private _userAgent: string;
    constructor() {
        this._userAgent = 'Chrome/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725';
    }
    get userAgent() {
        return this._userAgent;
    }
}

class MockLogger {
    public log: (message) => any;
    public debug: (message) => any;
    public error: (message) => any;
    public info: (message) => any;
    constructor() {
        this.log = () => null;
        this.debug = () => null;
        this.error = () => null;
        this.info = () => null;
    }
}

class MockSessionDescriptionHandler {
    public peerConnection: MockPeerConnection;
    constructor() {
        this.peerConnection = new MockPeerConnection();
    }
}

class MockUserAgent {
    public logger: MockLogger;
    public defaultHeaders: Object;
    constructor() {
        this.logger = new MockLogger();
        this.defaultHeaders = {};
    }
}

class MockSession {
    public sessionDescriptionHandler: MockSessionDescriptionHandler;
    public userAgent: MockUserAgent;
    public logger: MockLogger;
    private eventEmitter = new EventEmitter();
    public constructor() {
        this.sessionDescriptionHandler = new MockSessionDescriptionHandler();
        this.userAgent = new MockUserAgent();
        this.logger = new MockLogger();
    }
    public emit(event, parameter) {
        this.eventEmitter.emit(event, parameter);
    }
    public on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    public reinvite() { }
}

class MockPeerConnection {
    static iceConnectionStates = {
        new: 'mediaConnectionStateNew',
        checking: 'mediaConnectionStateChecking',
        connected: 'mediaConnectionStateConnected',
        completed: 'mediaConnectionStateCompleted',
        failed: 'mediaConnectionStateFailed',
        disconnected: 'mediaConnectionStateDisconnected',
        closed: 'mediaConnectionStateClosed'
    };
    static defaultStats = [
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
    private eventEmitter = new EventEmitter();
    public connectionState = 'new';
    public set iceConnectionState(state) {
        this.connectionState = state;
    }
    public get iceConnectionState() {
        return this.connectionState;
    }
    public getStats(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(MockPeerConnection.defaultStats);
        });
    }
    public addEventListener(eventName, listener) {
        this.eventEmitter.addListener(eventName, listener);
    }
    public removeEventListener(eventName, listener) {
        this.eventEmitter.removeListener(eventName, listener);
    }
    public emit(eventName, data) {
        this.eventEmitter.emit(eventName, data);
    }
}

class MockRTPStats {
    constructor(type, properties = {}) {
        let result;
        switch (type) {
            case 'inbound-rtp':
                result = {
                    type,
                    bytesReceived: faker.datatype.number(),
                    packetsReceived: faker.datatype.number(),
                    jitter: faker.datatype.number(),
                    packetsLost: faker.datatype.number(),
                    fractionLost: faker.datatype.number(),
                    mediaType: faker.random.word(),
                    roundTripTime: faker.datatype.number()
                };
                break;
            case 'outbound-rtp':
                result = {
                    type,
                    bytesSent: faker.datatype.number(),
                    packetsSent: faker.datatype.number(),
                    mediaType: faker.random.word()
                };
                break;
            case 'candidate-pair':
                result = {
                    type,
                    currentRoundTripTime: faker.datatype.number()
                };
                break;
            case 'local-candidate':
                result = {
                    type,
                    id: faker.datatype.number(),
                    isRemote: faker.datatype.boolean(),
                    ip: faker.internet.ip(),
                    candidateType: faker.random.word(),
                    networkType: faker.random.word(),
                    priority: faker.datatype.number(),
                    port: faker.internet.port()
                };
                break;
            case 'remote-candidate':
                result = {
                    type,
                    id: faker.datatype.number(),
                    isRemote: faker.datatype.boolean(),
                    ip: faker.internet.ip(),
                    candidateType: faker.random.word(),
                    priority: faker.datatype.number(),
                    port: faker.internet.port()
                };
                break;
            case 'media-source':
            case 'track':
                result = {
                    type,
                    audioLevel: faker.datatype.number({ min: 0, max: 100 })
                };
                break;
            case 'transport':
                result = {
                    type,
                    dtlsState: faker.random.word(),
                    packetsSent: faker.datatype.number(),
                    packetsReceived: faker.datatype.number(),
                    selectedCandidatePairChanges: faker.datatype.boolean(),
                    selectedCandidatePairId: faker.datatype.number()
                };
                break;
        }
        return Object.assign({}, result, properties);
    }
}

// #endregion

global.navigator = new MockNavigator() as any;

function generateMockStatAndReport() {
    const inboundRTP: any = new MockRTPStats('inbound-rtp');
    const outboundRTP: any = new MockRTPStats('outbound-rtp');
    const candidatePair: any = new MockRTPStats('candidate-pair');
    const localCandidate: any = new MockRTPStats('local-candidate');
    const remoteCandidate: any = new MockRTPStats('remote-candidate');
    const mediaSource: any = new MockRTPStats('media-source');
    const track: any = new MockRTPStats('track');
    const transport: any = new MockRTPStats('transport');
    const mockStat = [
        inboundRTP,
        outboundRTP,
        candidatePair,
        localCandidate,
        remoteCandidate,
        mediaSource,
        track,
        transport
    ];
    const mockReport = new WebPhoneRTPReport();
    mockReport.outboundRtpReport = {
        bytesSent: outboundRTP.bytesSent,
        packetsSent: outboundRTP.packetsSent,
        mediaType: outboundRTP.mediaType,
        rtpLocalAudioLevel: mediaSource.audioLevel
    };
    mockReport.inboundRtpReport = {
        bytesReceived: inboundRTP.bytesReceived,
        packetsReceived: inboundRTP.packetsReceived,
        jitter: inboundRTP.jitter,
        packetsLost: inboundRTP.packetsLost,
        fractionLost: inboundRTP.fractionLost,
        mediaType: inboundRTP.mediaType
    };
    mockReport.rttMs = {
        roundTripTime: inboundRTP.roundTripTime,
        currentRoundTripTime: candidatePair.currentRoundTripTime * 1000
    };
    mockReport.localCandidates = [
        {
            id: localCandidate.id,
            isRemote: localCandidate.isRemote,
            ip: localCandidate.ip,
            candidateType: localCandidate.candidateType,
            networkType: localCandidate.networkType,
            priority: localCandidate.priority,
            port: localCandidate.port
        }
    ];
    mockReport.remoteCandidates = [
        {
            id: remoteCandidate.id,
            isRemote: remoteCandidate.isRemote,
            ip: remoteCandidate.ip,
            candidateType: remoteCandidate.candidateType,
            priority: remoteCandidate.priority,
            port: remoteCandidate.port
        }
    ];
    mockReport.transport = {
        dtlsState: transport.dtlsState,
        packetsSent: transport.packetsSent,
        packetsReceived: transport.packetsReceived,
        selectedCandidatePairChanges: transport.selectedCandidatePairChanges,
        selectedCandidatePairId: transport.selectedCandidatePairId
    };
    return { mockStat, mockReport };
}

describe('MediaStreamsImpl', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('throw error if MediaStreamsImpl is instantiated with no session', () => {
        expect(() => new MediaStreamsImpl(null)).toThrow();
        expect(() => new MediaStreamsImpl(undefined)).toThrow();
    });

    test('browser function should check for correct browser type as per the useragent', () => {
        const mockSession = new MockSession();
        const mediaStreamsImpl = new MediaStreamsImpl(mockSession);
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Firefox/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725'
        );
        expect(mediaStreamsImpl.browser()).toBe(Browsers.Firefox);
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Safari/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725'
        );
        expect(mediaStreamsImpl.browser()).toBe(Browsers.Safari);
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'Opera/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725'
        );
        expect(mediaStreamsImpl.browser()).toBe(Browsers.Opera);
        jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
            'MSIE/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725'
        );
        expect(mediaStreamsImpl.browser()).toBe(Browsers.MSIE);
    });

    test('should emit event on session and trigger onMediaConnectionStateChange on iceconnectionstatechange', () => {
        const mockSession = new MockSession();
        const mediaStreamsImpl = new MediaStreamsImpl(mockSession);
        const mockOnMediaConnectionStateChange = jest.fn();
        mediaStreamsImpl.onMediaConnectionStateChange = mockOnMediaConnectionStateChange;
        const mediaConnectionStateNew = jest.fn();
        const mediaConnectionStateChecking = jest.fn();
        const mediaConnectionStateConnected = jest.fn();
        const mediaConnectionStateCompleted = jest.fn();
        const mediaConnectionStateFailed = jest.fn();
        const mediaConnectionStateDisconnected = jest.fn();
        const mediaConnectionStateClosed = jest.fn();
        mockSession.on('mediaConnectionStateNew', mediaConnectionStateNew);
        mockSession.on('mediaConnectionStateChecking', mediaConnectionStateChecking);
        mockSession.on('mediaConnectionStateConnected', mediaConnectionStateConnected);
        mockSession.on('mediaConnectionStateCompleted', mediaConnectionStateCompleted);
        mockSession.on('mediaConnectionStateFailed', mediaConnectionStateFailed);
        mockSession.on('mediaConnectionStateDisconnected', mediaConnectionStateDisconnected);
        mockSession.on('mediaConnectionStateClosed', mediaConnectionStateClosed);

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'new'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateNew', mockSession);
        expect(mediaConnectionStateNew).toBeCalled();

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'checking'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateChecking', mockSession);
        expect(mediaConnectionStateChecking).toBeCalled();

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'connected'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateConnected', mockSession);
        expect(mediaConnectionStateConnected).toBeCalled();

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'completed'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateCompleted', mockSession);
        expect(mediaConnectionStateCompleted).toBeCalled();

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'failed'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateFailed', mockSession);
        expect(mediaConnectionStateFailed).toBeCalled();

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'disconnected'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateDisconnected', mockSession);
        expect(mediaConnectionStateDisconnected).toBeCalled();

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'closed'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledWith('mediaConnectionStateClosed', mockSession);
        expect(mediaConnectionStateClosed).toBeCalled();
    });

    test('should not emit event on session and trigger onMediaConnectionStateChange on iceconnectionstatechange for unknown events', () => {
        const mockSession = new MockSession();
        const mediaStreamsImpl = new MediaStreamsImpl(mockSession);
        const mockOnMediaConnectionStateChange = jest.fn();
        mediaStreamsImpl.onMediaConnectionStateChange = mockOnMediaConnectionStateChange;
        const sessionEventListener = jest.fn();
        mockSession.on('mediaConnectionStateNew', sessionEventListener);
        mockSession.on('mediaConnectionStateChecking', sessionEventListener);
        mockSession.on('mediaConnectionStateConnected', sessionEventListener);
        mockSession.on('mediaConnectionStateCompleted', sessionEventListener);
        mockSession.on('mediaConnectionStateFailed', sessionEventListener);
        mockSession.on('mediaConnectionStateDisconnected', sessionEventListener);
        mockSession.on('mediaConnectionStateClosed', sessionEventListener);

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'randomEvent'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledTimes(0);
        expect(sessionEventListener).toBeCalledTimes(0);

        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'kylo-ren-event'
        );
        mockSession.sessionDescriptionHandler.peerConnection.emit('iceconnectionstatechange', null);
        expect(mockOnMediaConnectionStateChange).toBeCalledTimes(0);
        expect(sessionEventListener).toBeCalledTimes(0);
    });
});

describe('MediaStreams', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    test('should send reinvite when reconnecting media', async () => {
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreamsImpl(mockSession as any);
        const mockReinvite = jest.fn().mockReturnValue(Promise.resolve(null));
        mockSession.reinvite = mockReinvite;
        await mediaStreams.reconnectMedia();
        expect(mockReinvite).toBeCalled();
    });

    test('should cleanup on release', (done) => {
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession as any);
        mediaStreams.mediaStreamsImpl['mediaStatsTimer'] = 123;
        const mockRemoveEventListener = (event, fn) => {
            expect(fn).toBe(mediaStreams.mediaStreamsImpl['onPeerConnectionStateChange']);
            expect(mediaStreams.mediaStreamsImpl['mediaStatsTimer']).toBe(null);
            done();
        };
        mockSession.sessionDescriptionHandler.peerConnection.removeEventListener = mockRemoveEventListener;
        mediaStreams.release();
    });

    test('getMediaStats should be called and rtpStat event should be emitted continuously as per the interval', async () => {
        jest.useFakeTimers();
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession as any);
        const getStatsCallback = jest.fn();
        const rtpStatCallback = jest.fn();
        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'connected'
        );
        mockSession.on(Events.Session.RTPStat, rtpStatCallback);
        mediaStreams.getMediaStats(getStatsCallback, 100);
        jest.advanceTimersByTime(400);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        expect(getStatsCallback).toBeCalledTimes(4);
        expect(rtpStatCallback).toBeCalledTimes(4);
        await mediaStreams.release();
        getStatsCallback.mockClear();
        rtpStatCallback.mockClear();
        mediaStreams.getMediaStats(getStatsCallback, 50);
        jest.advanceTimersByTime(400);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        expect(getStatsCallback).toBeCalledTimes(8);
        expect(rtpStatCallback).toBeCalledTimes(8);
        mediaStreams.release();
    });

    test('should stop sending stats when stopMediaStats is called', async () => {
        jest.useFakeTimers();
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession as any);
        const getStatsCallback = jest.fn();
        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'connected'
        );
        mediaStreams.getMediaStats(getStatsCallback, 100);
        jest.advanceTimersByTime(400);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        jest.advanceTimersByTime(400);
        mediaStreams.stopMediaStats();
        jest.advanceTimersByTime(400);
        expect(getStatsCallback).toBeCalledTimes(4);
        await mediaStreams.release();
    });

    test('should send media stats', async () => {
        jest.useFakeTimers();
        const mockSession = new MockSession();
        const mediaStreams = new MediaStreams(mockSession as any);
        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'iceConnectionState', 'get').mockReturnValue(
            'connected'
        );
        const { mockStat: firstStat, mockReport: firstReport } = generateMockStatAndReport();
        const { mockStat: secondStat, mockReport: secondReport } = generateMockStatAndReport();
        jest.spyOn(mockSession.sessionDescriptionHandler.peerConnection, 'getStats')
            .mockReturnValueOnce(Promise.resolve(firstStat))
            .mockReturnValueOnce(Promise.resolve(secondStat));
        const getStatsCallback = jest.fn();
        mediaStreams.getMediaStats(getStatsCallback, 100);
        jest.advanceTimersByTime(200);
        // Added promise resolve since fake timer + promise work differently
        await Promise.resolve();
        expect(getStatsCallback).toHaveBeenNthCalledWith(1, firstReport, mockSession);
        expect(getStatsCallback).toHaveBeenNthCalledWith(2, secondReport, mockSession);
        await mediaStreams.release();
    });
});
