export interface WebPhoneEvents {
  /**  All WebPhone events related to Transport */
  Transport: {
    /** Fired when Transport is connecting. */
    Connecting: string;
    /** Fired when Transport is connected. */
    Connected: string;
    /** Fired when Transport is disconnecting. */
    Disconnecting: string;
    /** Fired when Transport is disconnected. */
    Disconnected: string;
    /** Fired every time a transport connection attempt fails. */
    ConnectionAttemptFailure: string;
    /** Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server. */
    ConnectionFailure: string;
    /** Fired when client should initiate connection back to main proxy. */
    SwitchBackToMainProxy: string;
    /** Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server. */
    Closed: string;
  };
  /**  All WebPhone events related to UserAgent */
  UserAgent: {
    /** Fired when UserAgent is registered with the registerer. */
    Registered: string;
    /** Fired when UserAgent is unregistered from the registerer. */
    Unregistered: string;
    /** Fired when UserAgent register failed. */
    RegistrationFailed: string;
    /** Fired when Invite is sent. */
    InviteSent: string;
    /** Fired when Invitation is received. */
    Invite: string;
    /** Fired when provisionUpdate notification is received. */
    ProvisionUpdate: string;
    /** Fired when UserAgent is started. */
    Started: string;
    /** Fired when UserAgent is stopped. */
    Stopped: string;
  };
  /** All WebPhone events related to Session */
  Session: {
    /** Fired when Session is accepted. */
    Accepted: string;
    /** Fired when Session is progress. */
    Progress: string;
    /** Fired when session is muted. */
    Muted: string;
    /** Fired when session is unmuted. */
    Unmuted: string;
    /** Fired when session is established */
    Establishing: string;
    /** Fired when session is established */
    Established: string;
    /** Fired when session is terminating */
    Terminating: string;
    /** Fired when session is terminated */
    Terminated: string;
    /** Fired when UPDATE request is received over socket */
    UpdateReceived: string;
    /** Fired when INFO request is received over socket with move to rcv instruction */
    MoveToRcv: string;
    /** Fired when QOS is published to the backend server */
    QOSPublished: string;
    /** Fired when RTP Stat Report is generated */
    RTPStat: string;
    /** Fired when get user media failed */
    UserMediaFailed: string;
  };
}

/** @ignore */
export const Events: WebPhoneEvents = {
  Transport: {
    Connecting: 'connecting',
    Connected: 'connected',
    Disconnecting: 'disconnecting',
    Disconnected: 'disconnected',
    ConnectionAttemptFailure: 'wsConnectionError',
    ConnectionFailure: 'transportError',
    SwitchBackToMainProxy: 'switchBackProxy',
    Closed: 'closed',
  },
  UserAgent: {
    Registered: 'registered',
    Unregistered: 'unregistered',
    RegistrationFailed: 'registrationFailed',
    InviteSent: 'inviteSent',
    Invite: 'invite',
    ProvisionUpdate: 'provisionUpdate',
    Started: 'started',
    Stopped: 'stopped',
  },
  Session: {
    Accepted: 'accepted',
    Progress: 'progress',
    Muted: 'muted',
    Unmuted: 'unmuted',
    Establishing: 'establishing',
    Established: 'established',
    Terminating: 'terminating',
    Terminated: 'terminated',
    UpdateReceived: 'updateReceived',
    MoveToRcv: 'moveToRcv',
    QOSPublished: 'qos-published',
    RTPStat: 'rtpStat',
    UserMediaFailed: 'userMediaFailed',
  },
};
