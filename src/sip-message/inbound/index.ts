import { uuid } from '../../utils';
import SipMessage from '../sip-message';

class InboundMessage extends SipMessage {
  public static fromString(str: string) {
    const sipMessage = new SipMessage();
    const [init, ...body] = str.split('\r\n\r\n');
    sipMessage.body = body.join('\r\n\r\n');
    const [subject, ...headers] = init.split('\r\n');
    sipMessage.subject = subject;
    sipMessage.headers = Object.fromEntries(headers.map((line) => line.split(': ')));
    if (sipMessage.headers.To && !sipMessage.headers.To.includes(';tag=')) {
      sipMessage.headers.To += ';tag=' + uuid(); // generate local tag
    }
    return sipMessage;
  }
}

export default InboundMessage;
