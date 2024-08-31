import SipMessage from '../sip-message';

class InboundMessage extends SipMessage {
  public static fromString(str: string): InboundMessage {
    const sipMessage = SipMessage.fromString(str);
    sipMessage.direction = 'inbound';
    if (sipMessage.headers['Call-Id']) {
      sipMessage.headers['Call-ID'] = sipMessage.headers['Call-Id'];
      delete sipMessage.headers['Call-Id'];
    }
    return sipMessage;
  }
}

export default InboundMessage;
