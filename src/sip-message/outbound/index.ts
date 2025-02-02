import SipMessage from "..";

class OutboundMessage extends SipMessage {
  public static fromString(str: string): OutboundMessage {
    const sipMessage = SipMessage.fromString(str);
    sipMessage.direction = "outbound";
    return sipMessage;
  }

  public constructor(subject = "", headers = {}, body = "") {
    super(subject, headers, body);
    this.direction = "outbound";
    this.headers["Content-Length"] = this.body.length.toString();
    this.headers["User-Agent"] = "ringcentral-web-phone-2";
    this.headers["Max-Forwards"] = "70";
  }
}

export default OutboundMessage;
