module.exports = {
    'message': 'message',
    'sipConnecting': 'sipConnecting',
    'sipConnected': 'sipConnected',
    'sipDisconnected': 'sipDisconnected',
    'sipRegistered': 'sipRegistered',
    'sipUnRegistered': 'sipUnregistered',
    'sipRegistrationFailed': 'sipRegistrationFailed',
    'incomingCall': 'incomingCall',                     //when incoming call is received
    'sipIncomingCall': 'sipIncomingCall',               //same as incomingCall
    'outgoingCall': 'outgoingCall',                     //when the outbound call is initiated
    'callConnecting': 'callConnecting',                 //when ICE gathering is started
    'callProgress': 'callProgress',                     //when 1xx provisional message is received (outbound only) or call is accepted, but ACK is still not sent (inbound only)
    'callStarted': 'callStarted',                       //when ACK is sent
    'callRejected': 'callRejected',                     //when the call is rejected by its party
    'callEnded': 'callEnded',                           //when the call had ended without errors (BYE)
    'callTerminated': 'callTerminated',                 //when the media is terminated, UNSTABLE in SIP.js 0.6.x
    'callFailed': 'callFailed',                         //when the call is failed because of many different reasons (connection issues, 4xx errors, etc.)
    'callHold': 'callHold',                             //when the call is put on hold
    'callUnhold': 'callUnhold',                         //when the call is unholded
    'callMute': 'callMute',                             //when the call is muted
    'callUnmute': 'callUnmute',                         //when the call is unmuted
    'callReplaced': 'callReplaced',                     //when the call has been replaced by an incoming invite
    'sipRTCSession': 'sipRTCSession',
    'sipConnectionFailed': 'sipConnectionFailed',
    'ICEConnected': 'ICEConnected',
    'ICECompleted': 'ICECompleted',
    'ICEFailed': 'ICEFailed',
    'ICEChecking': 'ICEChecking',
    'ICEClosed': 'ICEClosed',
    'ICEDisconnected': 'ICEDisconnected',
    'callReinviteSucceeded': 'callReinviteSucceeded',
    'callReinviteFailed': 'callReinviteFailed'
};
