const callControlCommands = {
  // one way messages from server to client
  ChangeMessage: 1,
  ServerFreeResources: 2,
  NewMsg: 3,
  ReLogin: 4,
  ChangePhones: 5,
  // Call control messages from server to client
  IncomingCall: 6,
  AlreadyProcessed: 7,
  ClientMinimize: 8,
  SessionClose: 9,
  // Call control messages from client to server
  ClientForward: 10,
  ClientVoicemail: 11,
  ClientReject: 12,
  ClientStartReply: 13,
  ClientReply: 14,
  ClientNotProcessed: 15,
  ClientClosed: 16,
  ClientReceiveConfirm: 17,
};

export default callControlCommands;
