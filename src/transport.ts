import { EventEmitter } from 'events';
import type { Exception, Logger } from 'sip.js/lib/core';
import type { Transport } from 'sip.js/lib/api/transport';
import type { Transport as WebTransport } from 'sip.js/lib/platform/web/transport';
import type { TransportOptions } from 'sip.js/lib/platform/web/transport/transport-options';
import { TransportState } from 'sip.js';

import type { TransportServer, WebPhoneOptions } from './index';
import { Events } from './events';

export interface WebPhoneTransport extends Transport {
  /** @ignore */
  configuration?: TransportOptions;
  /** logger class to log transport related messaged */
  logger?: Logger;
  /**
   * Address of the RingCentral main proxy
   * Is calculated automatically as the first item in the `options.transportServers` array
   */
  mainProxy?: TransportServer;
  /** Max attempts until which transport reconnection will be attempted before moving to the next available `transportServer` */
  maxReconnectionAttempts?: number;
  /** Interval after which the next reconnection attempt will be made */
  nextReconnectInterval?: number;
  /** The current reconnection attempt */
  reconnectionAttempts?: number;
  /** Timeout to be used to calculate when should the next reconnection attempt be made */
  reconnectionTimeout?: number;
  /** @ignore */
  reconnectTimer?: any;
  /** Current server where transport is connected */
  server?: string;
  /** Possible list of servers where transport can connect to */
  servers?: TransportServer[];
  /** List of SIP error codes */
  sipErrorCodes?: string[];
  /** Interval after which switch back to main proxy should be initiated */
  switchBackInterval?: number;
  /** @ignore */
  switchBackToMainProxyTimer?: any;
  /** @ignore */
  __afterWSConnected?: typeof __afterWSConnected;
  /** @ignore */
  __clearSwitchBackToMainProxyTimer?: typeof __clearSwitchBackToMainProxyTimer;
  /** @ignore */
  __computeRandomTimeout?: typeof __computeRandomTimeout;
  /** @ignore */
  __connect?: typeof __connect;
  /** @ignore */
  __isCurrentMainProxy?: typeof __isCurrentMainProxy;
  /** @ignore */
  __onConnectedToBackup?: typeof __onConnectedToBackup;
  /** @ignore */
  __onConnectedToMain?: typeof __onConnectedToMain;
  /** @ignore */
  __resetServersErrorStatus?: typeof __resetServersErrorStatus;
  /** @ignore */
  __scheduleSwitchBackToMainProxy?: typeof __scheduleSwitchBackToMainProxy;
  /** @ignore */
  __setServerIsError?: typeof __setServerIsError;
  /** Register functions to be called when events are fired on the transport object */
  addListener?: typeof EventEmitter.prototype.addListener;
  /** Trigger events on transport object */
  emit?: typeof EventEmitter.prototype.emit;
  /** Get next available server from the list of `transportServers` */
  getNextWsServer?: (force?: boolean) => TransportServer | undefined;
  /** Is the current code part of the SIP error codes registered with the transport object */
  isSipErrorCode?: typeof isSipErrorCode;
  /** Helper function to check if any valid `transportServers` are available to connect to */
  noAvailableServers?: () => boolean;
  /**
   * Unregister functions to be called when events are fired on the transport object
   *
   * alias for removeListener
   */
  off: typeof EventEmitter.prototype.off;
  /** Register functions to be called when events are fired on the transport object
   *
   * alias for addListener
   */
  on: typeof EventEmitter.prototype.on;
  /** Register functions to be called once when events are fired on the transport object */
  once: typeof EventEmitter.prototype.once;
  /** @ignore */
  onSipErrorCode?: typeof onSipErrorCode;
  /** Function to try reconnecting to the transport. Is automatically triggered when transport connection is dropped or `sipErrorCode` is returned from backend server */
  reconnect: typeof WebTransport.prototype.connect;
  /**
   * Unregister functions to be called when events are fired on the transport object
   */
  removeListener?: typeof EventEmitter.prototype.removeListener;
  /**
   * Unregister all functions to be called when events are fired on the transport object
   */
  removeAllListeners?: typeof EventEmitter.prototype.removeAllListeners;
}

export function createWebPhoneTransport(transport: WebPhoneTransport, options: WebPhoneOptions): WebPhoneTransport {
  transport.reconnectionAttempts = 0;
  transport.sipErrorCodes = options.sipErrorCodes;
  transport.servers = options.transportServers;
  const eventEmitter = new EventEmitter();
  transport.on = eventEmitter.on.bind(eventEmitter);
  transport.off = eventEmitter.off.bind(eventEmitter);
  transport.once = eventEmitter.once.bind(eventEmitter);
  transport.addListener = eventEmitter.addListener.bind(eventEmitter);
  transport.removeListener = eventEmitter.removeListener.bind(eventEmitter);
  transport.removeAllListeners = eventEmitter.removeAllListeners.bind(eventEmitter);
  transport.emit = eventEmitter.emit.bind(eventEmitter);
  transport.mainProxy = options.transportServers![0];
  transport.switchBackInterval = options.switchBackInterval;
  transport.reconnectionTimeout = options.reconnectionTimeout;
  transport.maxReconnectionAttempts = options.maxReconnectionAttempts;
  transport.__afterWSConnected = __afterWSConnected.bind(transport);
  transport.__clearSwitchBackToMainProxyTimer = __clearSwitchBackToMainProxyTimer.bind(transport);
  transport.__computeRandomTimeout = __computeRandomTimeout.bind(transport);
  transport.__connect = transport.connect;
  transport.__isCurrentMainProxy = __isCurrentMainProxy.bind(transport);
  transport.__onConnectedToBackup = __onConnectedToBackup.bind(transport);
  transport.__onConnectedToMain = __onConnectedToMain.bind(transport);
  transport.__resetServersErrorStatus = __resetServersErrorStatus.bind(transport);
  transport.__scheduleSwitchBackToMainProxy = __scheduleSwitchBackToMainProxy.bind(transport);
  transport.__setServerIsError = __setServerIsError.bind(transport);
  transport.connect = __connect.bind(transport);
  transport.getNextWsServer = getNextWsServer.bind(transport);
  transport.isSipErrorCode = isSipErrorCode.bind(transport);
  transport.noAvailableServers = noAvailableServers.bind(transport);
  transport.onSipErrorCode = onSipErrorCode.bind(transport);
  transport.reconnect = reconnect.bind(transport);
  transport.stateChange.addListener((newState) => {
    switch (newState) {
      case TransportState.Connecting: {
        transport.emit!(Events.Transport.Connecting);
        break;
      }
      case TransportState.Connected: {
        transport.emit!(Events.Transport.Connected);
        transport.__afterWSConnected!();
        break;
      }
      case TransportState.Disconnecting: {
        transport.emit!(Events.Transport.Disconnecting);
        break;
      }
      case TransportState.Disconnected: {
        transport.emit!(Events.Transport.Disconnected);
        break;
      }
    }
  });
  return transport;
}

function __connect(this: WebPhoneTransport): Promise<void> {
  return this.__connect!().catch(async (e: Exception) => {
    this.logger!.error(`unable to establish connection to server ${this.server} - ${e.message}`);
    this.emit!(Events.Transport.ConnectionAttemptFailure, e); // Can we move to onTransportDisconnect?
    await this.reconnect!();
  });
}

function __computeRandomTimeout(reconnectionAttempts = 1, randomMinInterval = 0, randomMaxInterval = 0): number {
  if (randomMinInterval < 0 || randomMaxInterval < 0 || reconnectionAttempts < 1) {
    throw new Error('Arguments must be positive numbers');
  }

  const randomInterval =
    Math.floor(Math.random() * Math.abs(randomMaxInterval - randomMinInterval)) + randomMinInterval;
  const retryOffset = ((reconnectionAttempts - 1) * (randomMinInterval + randomMaxInterval)) / 2;

  return randomInterval + retryOffset;
}

function __setServerIsError(this: WebPhoneTransport, uri: string): void {
  this.servers!.forEach((server) => {
    if (server.uri === uri && !server.isError) {
      server.isError = true;
    }
  });
}

function __resetServersErrorStatus(this: WebPhoneTransport): void {
  this.servers!.forEach((server) => {
    server.isError = false;
  });
}

function __isCurrentMainProxy(this: WebPhoneTransport): boolean {
  return this.server === this.servers![0].uri;
}

function __afterWSConnected(this: WebPhoneTransport): void {
  this.__isCurrentMainProxy!() ? this.__onConnectedToMain!() : this.__onConnectedToBackup!();
}

function __onConnectedToMain(this: WebPhoneTransport): void {
  this.__clearSwitchBackToMainProxyTimer!();
}

function __onConnectedToBackup(this: WebPhoneTransport): void {
  if (!this.switchBackToMainProxyTimer) {
    this.__scheduleSwitchBackToMainProxy!();
  }
}

function __scheduleSwitchBackToMainProxy(this: WebPhoneTransport): void {
  const randomInterval = 15 * 60 * 1000; // 15 min

  let switchBackInterval = this.switchBackInterval ? this.switchBackInterval * 1000 : null;

  // Add random time to expand clients connections in time;
  if (switchBackInterval) {
    switchBackInterval += this.__computeRandomTimeout!(1, 0, randomInterval);
    this.logger!.warn('Try to switch back to main proxy after ' + Math.round(switchBackInterval / 1000 / 60) + ' min');

    this.switchBackToMainProxyTimer = setTimeout(() => {
      this.switchBackToMainProxyTimer = null;
      this.logger!.warn('switchBack initiated');
      this.emit!(Events.Transport.SwitchBackToMainProxy);
      // FIXME: Why is force reconnect not called here and the client is made to do that?
    }, switchBackInterval);
  } else {
    this.logger!.warn('switchBackInterval is not set. Will be switched with next provision update ');
  }
}

function __clearSwitchBackToMainProxyTimer(this: WebPhoneTransport): void {
  if (this.switchBackToMainProxyTimer) {
    clearTimeout(this.switchBackToMainProxyTimer);
    this.switchBackToMainProxyTimer = null;
  }
}

async function reconnect(this: WebPhoneTransport, forceReconnectToMain?: boolean): Promise<void> {
  if (this.reconnectionAttempts! > 0) {
    this.logger!.warn(`Reconnection attempt ${this.reconnectionAttempts} failed`);
  }

  if (this.reconnectTimer) {
    this.logger!.warn('already trying to reconnect');
    return;
  }

  if (forceReconnectToMain) {
    this.logger!.warn('forcing connect to main WS server');
    await this.disconnect();
    this.server = this.getNextWsServer!(true)!.uri;
    this.reconnectionAttempts = 0;
    await this.connect();
    return;
  }

  if (this.isConnected()) {
    this.logger!.warn('attempted to reconnect while connected - forcing disconnect');
    await this.disconnect();
    await this.reconnect!();
    return;
  }

  if (this.noAvailableServers!()) {
    this.logger!.warn('no available WebSocket servers left');
    this.emit!(Events.Transport.Closed);
    this.__resetServersErrorStatus!();
    this.server = this.getNextWsServer!(true)!.uri;
    this.__clearSwitchBackToMainProxyTimer!();
    return;
  }

  this.reconnectionAttempts! += 1;

  if (this.reconnectionAttempts! > this.maxReconnectionAttempts!) {
    this.logger!.warn(`maximum reconnection attempts for WebSocket ${this.server}`);
    this.logger!.warn(`transport ${this.server} failed`);
    this.__setServerIsError!(this.server!);
    this.emit!(Events.Transport.ConnectionFailure);
    const nextServer = this.getNextWsServer!();
    if (!nextServer) {
      // No more servers available to try connecting to
      this.logger!.error('unable to connect to any transport');
      return;
    }
    this.configuration!.server = nextServer.uri;
    this.reconnectionAttempts = 0;
    await this.connect();
  } else {
    const randomMinInterval = (this.reconnectionTimeout! - 2) * 1000;
    const randomMaxInterval = (this.reconnectionTimeout! + 2) * 1000;
    this.nextReconnectInterval = this.__computeRandomTimeout!(
      this.reconnectionAttempts,
      randomMinInterval,
      randomMaxInterval,
    );
    this.logger!.warn(
      `trying to reconnect to WebSocket ${this.server} (reconnection attempt: ${this.reconnectionAttempts})`,
    );
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connect().then(() => {
        this.reconnectionAttempts = 0;
      });
    }, this.nextReconnectInterval);
    this.logger!.warn(`next reconnection attempt in: ${Math.round(this.nextReconnectInterval / 1000)} seconds.`);
  }
}

function getNextWsServer(this: WebPhoneTransport, force = false): TransportServer | undefined {
  // Adding the force check because otherwise it will not bypass error check
  if (!force && this.noAvailableServers!()) {
    this.logger!.warn('attempted to get next ws server but there are no available ws servers left');
    return;
  }
  const candidates = force ? this.servers : this.servers!.filter(({ isError }) => !isError);
  return candidates![0];
}

function noAvailableServers(this: WebPhoneTransport): boolean {
  return this.servers!.every(({ isError }) => isError);
}

function isSipErrorCode(this: WebPhoneTransport, statusCode: number | undefined): boolean {
  if (!statusCode) {
    return false;
  }
  if (!this.sipErrorCodes) {
    return false;
  }
  return this.sipErrorCodes.indexOf(statusCode.toString()) !== -1;
}

async function onSipErrorCode(this: WebPhoneTransport): Promise<void> {
  this.logger!.warn('Error received from the server. Disconnecting from the proxy');
  this.__setServerIsError!(this.server!);
  this.emit!(Events.Transport.ConnectionFailure);
  this.reconnectionAttempts = 0;
  return this.reconnect!();
}
