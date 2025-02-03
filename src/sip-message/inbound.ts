import SipMessage from "../sip-message/index.js";

class InboundMessage extends SipMessage {
  public static fromString(str: string): InboundMessage {
    const sipMessage = SipMessage.fromString(str);
    sipMessage.direction = "inbound";
    return sipMessage;
  }
}

export default InboundMessage;
