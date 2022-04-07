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
        /** Fired everytime a transport connection attempt fails. */
        ConnectionAttemptFailure: string;
        /** Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server. */
        ConnectionFailure: string;
        /** Fired when client should initiate connection back to main proxy. */
        SwitchBackToMainProxy: string;
        /** Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server. */
        Closed: string;
    };
    /**  All WebPhone events related to UserAgen */
    UserAgent: {
        /** Fired when UserAgent is registered with the registerer. */
        Registrerd: string;
        /** Fired when UserAgent is unregistered from the registerer. */
        Unregistrerd: string;
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
        /** Fired when UPDATE request is recieved over socket */
        UpdateReceived: string;
        /** Fired when INFO request is recieved over socket with move to rcv instruction */
        MoveToRcv: string;
        /** Fired when QOS is pulished to the backend server */
        QOSPublished: string;
        /** Fired when RTP Stat Report is generted */
        RTPStat: string;
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
        Closed: 'closed'
    },
    UserAgent: {
        Registrerd: 'registrerd',
        Unregistrerd: 'unregistrerd',
        InviteSent: 'inviteSent',
        Invite: 'invite',
        ProvisionUpdate: 'ProvisionUpdate',
        Started: 'started',
        Stopped: 'stopped'
    },
    Session: {
        Muted: 'muted',
        Unmuted: 'unmuted',
        Establishing: 'establishing',
        Established: 'established',
        Terminating: 'terminating',
        Terminated: 'terminated',
        UpdateReceived: 'updateReceived',
        MoveToRcv: 'moveToRcv',
        QOSPublished: 'qos-published',
        RTPStat: 'rtpStat'
    }
};