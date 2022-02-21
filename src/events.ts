export const Events = {
    /**
     * All WebPhone events related to transport layer
     */
    Transport: {
        /**
         * Fired everytime a transport connection attempt fails.
         */
        ConnectionAttemptFailure: 'wsConnectionError',
        /**
         * Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server.
         */
        ConnectionFailure: 'transportError',
        /**
         * Fired when client should initiate connection back to main proxy.
         */
        SwitchBackToMainProxy: 'switchBackProxy',
        /**
         * Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server.
         */
        Closed: 'closed'
    },
    /**
     * All WebPhone events related to UserAgent
     */
    UserAgent: {
        /**
         * Fired when UserAgent is registered with the registerer.
         */
        Registrerd: 'registrerd',
        /**
         * Fired when UserAgent is unregistered from the registerer.
         */
        Unregistrerd: 'unregistrerd',
        /**
         * Fired when Invite is sent.
         */
        InviteSent: 'inviteSent',
        /**
         * Fired when Invitation is received.
         */
        Invite: 'invite'
    },
    /**
     * All WebPhone events related to Session
     */
    Session: {
        /**
         * Fired when session is muted.
         */
        Muted: 'muted',
        /**
         * Fired when session is unmuted.
         */
        Unmuted: 'unmuted',
        /**
         * Fired when session is established
         */
        Established: 'established',
        /**
         * Fired when session is terminating
         */
        Terminating: 'terminating',
        /**
         * Fired when session is terminated
         */
        Terminated: 'terminated'
    }
};
