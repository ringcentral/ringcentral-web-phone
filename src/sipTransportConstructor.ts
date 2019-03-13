import { WebPhoneUserAgent } from './userAgent';
import { Timers, Transport } from 'sip.js';


export interface WebPhoneSIPTransport extends Transport {    
    computeRandomTimeout: typeof computeRandomTimeout;
    reconnect: typeof reconnect;
    isSipErrorCode: typeof isSipErrorCode;
    scheduleSwithBackMainProxy: typeof scheduleSwithBackMainProxy;
    onSipErrorCode: typeof onSipErrorCode;
}


export const TransportConstructorWrapper = (SipTransport: any, webPhoneOptions:any): any => {
    
    return function transportConstructor(logger: Function, options:any): WebPhoneSIPTransport {

        let transport = new SipTransport(logger, options);

        transport.nextReconnectInterval = 0;
        transport.sipErrorCodes = webPhoneOptions.sipErrorCodes;
        transport.switchBackInterval = webPhoneOptions.switchBackInterval;

        transport.computeRandomTimeout = computeRandomTimeout.bind(transport);
        transport.reconnect = reconnect.bind(transport);
        transport.isSipErrorCode = isSipErrorCode.bind(transport);
        transport.scheduleSwithBackMainProxy = scheduleSwithBackMainProxy.bind(transport);
        transport.onSipErrorCode = onSipErrorCode.bind(transport);
        transport.__isCurrentMainProxy = __isCurrentMainProxy.bind(transport);
        transport.__afterWSConnected = __afterWSConnected.bind(transport);
        transport.__onConnectedToBackup = __onConnectedToBackup.bind(transport);
        transport.__onConnectedToMain = __onConnectedToMain.bind(transport);

        transport.on('connected', transport.__afterWSConnected);

        return transport;
    }
}

const C = {
                // Transport status codes
                STATUS_CONNECTING: 0,
                STATUS_OPEN: 1,
                STATUS_CLOSING: 2,
                STATUS_CLOSED: 3
    };

function computeRandomTimeout(reconnectionAttempts: number, randomMinInterval: number, randomMaxInterval: number){
            randomMinInterval = randomMinInterval < 0 ? 0 : randomMinInterval;
            randomMaxInterval = randomMaxInterval <= 0 ? 7000 : randomMaxInterval;
            reconnectionAttempts = reconnectionAttempts || 1;

            const randomInterval = Math.floor(Math.random() * (randomMaxInterval - randomMinInterval)) + randomMinInterval;
            const retryOffset = (reconnectionAttempts - 1) * (randomMinInterval + randomMaxInterval) / 2;

            return randomInterval + retryOffset;
};

function reconnect(forceReconnectToMain: boolean) {
    if (this.reconnectionAttempts > 0) {
        this.logger.log('Reconnection attempt ' + this.reconnectionAttempts + ' failed');
    }

    if (forceReconnectToMain) {
        this.logger.log('forcing connect to main WS server');
        this.server = this.getNextWsServer(true);
        this.reconnectionAttempts = 0;
        this.disconnect({ force: true })
            .then(this.connect.bind(this));
        return;
    }

    if (this.noAvailableServers()) {
        this.logger.warn('no available ws servers left - going to closed state');
        this.status = C.STATUS_CLOSED;
        this.resetServerErrorStatus();
        return;
    }

    if (this.isConnected()) {
        this.logger.warn('attempted to reconnect while connected - forcing disconnect');
        this.disconnect({ force: true })
        return;
    }

    const randomMinInterval = (this.configuration.reconnectionTimeout - 2 ) * 1000;
    const randomMaxInterval = (this.configuration.reconnectionTimeout + 2 ) * 1000;

    this.reconnectionAttempts += 1;
    this.nextReconnectInterval = this.computeRandomTimeout(this.reconnectionAttempts, randomMinInterval, randomMaxInterval);                

    if (this.reconnectionAttempts > this.configuration.maxReconnectionAttempts) {
        this.logger.warn('maximum reconnection attempts for WebSocket ' + this.server.ws_uri);
        this.logger.log('transport ' + this.server.ws_uri + ' failed | connection state set to \'error\'');
        this.server.isError = true;
        this.emit('transportError');
        this.server = this.getNextWsServer();
        this.reconnectionAttempts = 0;
        this.reconnect();
    } else {
        this.logger.log('trying to reconnect to WebSocket ' + this.server.ws_uri + ' (reconnection attempt ' + this.reconnectionAttempts + ')');
        this.reconnectTimer = setTimeout(() => {
            this.connect();
            this.reconnectTimer = null;
        }, this.nextReconnectInterval);
        this.logger.warn('next reconnection attempt in:' + Math.round(this.nextReconnectInterval / 1000));
    }
};

function isSipErrorCode(message: string){    

    const statusLine = message.substring(0, message.indexOf('\r\n'));
    const statusCode = statusLine.split(' ')[1];

    return statusCode && 
            this.sipErrorCodes && 
            this.sipErrorCodes.length && 
            this.sipErrorCodes.includes(statusCode);
};

function scheduleSwithBackMainProxy(){
    const randomInterval = 15 * 60 * 1000; //15 min
   
    let switchBackInterval = parseInt(this.switchBackInterval) ? parseInt(this.switchBackInterval) * 1000 : null;
    
    // Add random time to expand clients connections in time;
    if (switchBackInterval) {
        switchBackInterval += this.computeRandomTimeout(1, 0, randomInterval);
        this.logger.warn('Try to switch back to main proxy after ' + Math.round(switchBackInterval/1000/60) + ' min');

        const mainProxy = this.configuration.wsServers[0];

        mainProxy.switchBackTimer = setTimeout(() =>  {
            mainProxy.isError = false;
            mainProxy.switchBackTimer = null;
            this.emit('switchBackProxy');
        }, switchBackInterval);
    } else {
        this.logger.warn('switchBackInterval is not set. Will be switched with next provision update ');
    }
};

function onSipErrorCode() {
    this.logger.warn('Error received from the server. Disconnecting from the proxy');    
    this.server.isError = true;
    this.emit('transportError');
    this.server = this.getNextWsServer();
    this.reconnectionAttempts = 0;
    this.disconnect({ force: true })
        .then(this.connect.bind(this));
};

function __isCurrentMainProxy() {
    return this.server === this.configuration.wsServers[0];
};

function __onConnectedToMain() {
    const mainProxy = this.configuration.wsServers[0];

    if (mainProxy.switchBackTimer) {
        clearTimeout(mainProxy.switchBackTimer);
        mainProxy.switchBackTimer = null;
    }
};

function __onConnectedToBackup(){
    const mainProxy = this.configuration.wsServers[0];

    if (!mainProxy.switchBackTimer) {
       this.scheduleSwithBackMainProxy();
    }
}

function __afterWSConnected() {
   this.__isCurrentMainProxy() ? this.__onConnectedToMain() : this.__onConnectedToBackup();
};
