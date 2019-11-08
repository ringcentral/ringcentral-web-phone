import {UA, Transport} from 'sip.js';
import {delay} from './utils';

export interface WebPhoneSIPTransport extends Transport {
    computeRandomTimeout: typeof computeRandomTimeout;
    reconnect: typeof reconnect;
    isSipErrorCode: typeof isSipErrorCode;
    scheduleSwitchBackMainProxy: typeof scheduleSwitchBackMainProxy;
    onSipErrorCode: typeof onSipErrorCode;
    reconnectionAttempts?: number;
    logger: typeof UA.prototype.logger;
    switchBackInterval?: number;
    getNextWsServer: any;
    noAvailableServers: any;
    status: number;
    resetServerErrorStatus: any;
    configuration: typeof UA.prototype.configuration.transportOptions;
    nextReconnectInterval: number;
    sipErrorCodes?: string[];
    __isCurrentMainProxy: typeof __isCurrentMainProxy;
    __onConnectedToMain: typeof __onConnectedToMain;
    __onConnectedToBackup: typeof __onConnectedToBackup;
    __clearSwitchBackTimer: typeof __clearSwitchBackTimer;
    __connect: typeof Transport.prototype.connect;
    connect: typeof __connect;
    reconnectTimer: any;
    disposeWs: () => void;
    onError: (e: any) => void;
    mainProxy: any;
}

export const TransportConstructorWrapper = (SipTransportConstructor: any, webPhoneOptions: any): any => {
    return (logger: typeof UA.prototype.logger, options: any): WebPhoneSIPTransport => {
        let transport = new SipTransportConstructor(logger, options);

        transport.nextReconnectInterval = 0;
        transport.sipErrorCodes = webPhoneOptions.sipErrorCodes;
        transport.switchBackInterval = webPhoneOptions.switchBackInterval;
        transport.mainProxy = transport.configuration.wsServers[0];

        transport.computeRandomTimeout = computeRandomTimeout;
        transport.reconnect = reconnect.bind(transport);
        transport.isSipErrorCode = isSipErrorCode.bind(transport);
        transport.scheduleSwitchBackMainProxy = scheduleSwitchBackMainProxy.bind(transport);
        transport.onSipErrorCode = onSipErrorCode.bind(transport);
        transport.__isCurrentMainProxy = __isCurrentMainProxy.bind(transport);
        transport.__afterWSConnected = __afterWSConnected.bind(transport);
        transport.__onConnectedToBackup = __onConnectedToBackup.bind(transport);
        transport.__onConnectedToMain = __onConnectedToMain.bind(transport);
        transport.__clearSwitchBackTimer = __clearSwitchBackTimer.bind(transport);
        transport.__connect = transport.connect;
        transport.connect = __connect.bind(transport);

        transport.on('connected', transport.__afterWSConnected);

        return transport;
    };
};

const C = {
    // Transport status codes
    STATUS_CONNECTING: 0,
    STATUS_OPEN: 1,
    STATUS_CLOSING: 2,
    STATUS_CLOSED: 3
};

var computeRandomTimeout = (
    reconnectionAttempts: number = 1,
    randomMinInterval: number = 0,
    randomMaxInterval: number = 0
): number => {
    if (randomMinInterval < 0 || randomMaxInterval < 0 || reconnectionAttempts < 1) {
        throw new Error('Arguments must be positive numbers');
    }

    const randomInterval =
        Math.floor(Math.random() * Math.abs(randomMaxInterval - randomMinInterval)) + randomMinInterval;
    const retryOffset = ((reconnectionAttempts - 1) * (randomMinInterval + randomMaxInterval)) / 2;

    return randomInterval + retryOffset;
};

async function __connect(this: WebPhoneSIPTransport, options?: any): Promise<void> {
    return await this.__connect(options).catch(async err => {
        this.emit('wsConnectionError', err);
        this.logger.warn('Connection Error occured. Trying to reconnect to websocket...');
        this.onError(err);
        this.disconnect({force: true});
        this.disposeWs();
        await this.reconnect();
    });
}

async function reconnect(this: WebPhoneSIPTransport, forceReconnectToMain?: boolean): Promise<void> {
    if (this.reconnectionAttempts > 0) {
        this.logger.warn('Reconnection attempt ' + this.reconnectionAttempts + ' failed');
    }

    if (forceReconnectToMain) {
        this.logger.warn('forcing connect to main WS server');
        await this.disconnect({force: true});
        this.server = this.getNextWsServer(true);
        this.reconnectionAttempts = 0;
        await this.connect();
        return;
    }

    if (this.noAvailableServers()) {
        this.logger.warn('no available ws servers left - going to closed state');
        this.status = C.STATUS_CLOSED;
        this.emit('closed');
        this.resetServerErrorStatus();
        this.server = this.getNextWsServer(true);
        this.__clearSwitchBackTimer();
        return;
    }

    if (this.isConnected()) {
        this.logger.warn('attempted to reconnect while connected - forcing disconnect');
        await this.disconnect({force: true});
        await this.reconnect();
        return;
    }

    const randomMinInterval = (this.configuration.reconnectionTimeout - 2) * 1000;
    const randomMaxInterval = (this.configuration.reconnectionTimeout + 2) * 1000;

    this.reconnectionAttempts += 1;
    this.nextReconnectInterval = this.computeRandomTimeout(
        this.reconnectionAttempts,
        randomMinInterval,
        randomMaxInterval
    );

    if (this.reconnectionAttempts > this.configuration.maxReconnectionAttempts) {
        this.logger.warn('maximum reconnection attempts for WebSocket ' + this.server.wsUri);
        this.logger.warn('transport ' + this.server.wsUri + " failed | connection state set to 'error'");
        this.server.isError = true;
        this.emit('transportError');
        this.server = this.getNextWsServer();
        this.reconnectionAttempts = 0;
        await this.reconnect();
    } else {
        this.logger.warn(
            'trying to reconnect to WebSocket ' +
                this.server.wsUri +
                ' (reconnection attempt ' +
                this.reconnectionAttempts +
                ')'
        );
        this.reconnectTimer = setTimeout(() => {
            this.connect();
            this.reconnectTimer = undefined;
        }, this.nextReconnectInterval);
        this.logger.warn('next reconnection attempt in:' + Math.round(this.nextReconnectInterval / 1000) + ' seconds.');
    }
}

function isSipErrorCode(this: WebPhoneSIPTransport, message: string): boolean {
    const statusLine = message.substring(0, message.indexOf('\r\n'));
    const statusCode = statusLine.split(' ')[1];

    return statusCode && this.sipErrorCodes && this.sipErrorCodes.length && this.sipErrorCodes.includes(statusCode);
}

function scheduleSwitchBackMainProxy(this: WebPhoneSIPTransport): void {
    const randomInterval = 15 * 60 * 1000; //15 min

    let switchBackInterval = this.switchBackInterval ? this.switchBackInterval * 1000 : null;

    // Add random time to expand clients connections in time;
    if (switchBackInterval) {
        switchBackInterval += this.computeRandomTimeout(1, 0, randomInterval);
        this.logger.warn(
            'Try to switch back to main proxy after ' + Math.round(switchBackInterval / 1000 / 60) + ' min'
        );

        this.mainProxy.switchBackTimer = setTimeout(() => {
            this.mainProxy.isError = false;
            this.mainProxy.switchBackTimer = null;
            this.logger.warn('switchBack initiated');
            this.emit('switchBackProxy');
        }, switchBackInterval);
    } else {
        this.logger.warn('switchBackInterval is not set. Will be switched with next provision update ');
    }
}

async function onSipErrorCode(this: WebPhoneSIPTransport): Promise<any> {
    this.logger.warn('Error received from the server. Disconnecting from the proxy');
    this.server.isError = true;
    this.emit('transportError');
    await this.disconnect({force: true});
    this.server = this.getNextWsServer();
    this.reconnectionAttempts = 0;
    return this.reconnect();
}

function __isCurrentMainProxy(this: WebPhoneSIPTransport): boolean {
    return this.server === this.configuration.wsServers[0];
}

function __clearSwitchBackTimer(this: WebPhoneSIPTransport): void {
    if (this.mainProxy.switchBackTimer) {
        clearTimeout(this.mainProxy.switchBackTimer);
        this.mainProxy.switchBackTimer = null;
    }
}

function __onConnectedToMain(this: WebPhoneSIPTransport): void {
    this.__clearSwitchBackTimer();
}

function __onConnectedToBackup(this: WebPhoneSIPTransport): void {
    if (!this.mainProxy.switchBackTimer) {
        this.scheduleSwitchBackMainProxy();
    }
}

function __afterWSConnected(this: WebPhoneSIPTransport): void {
    this.__isCurrentMainProxy() ? this.__onConnectedToMain() : this.__onConnectedToBackup();
}
