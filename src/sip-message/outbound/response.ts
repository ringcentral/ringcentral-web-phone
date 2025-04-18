import OutboundMessage from "./index.js";
import responseCodes from "../response-codes.js";
import type InboundMessage from "../inbound.js";

class ResponseMessage extends OutboundMessage {
  public constructor(
    inboundMessage: InboundMessage,
    {
      responseCode,
      headers = {},
      body = "",
    }: {
      responseCode: number;
      headers?: { [key: string]: string };
      body?: string;
    },
  ) {
    super(undefined, { ...headers }, body);
    this.subject = `SIP/2.0 ${responseCode} ${responseCodes[responseCode]}`;
    const keys = ["Via", "From", "To", "Call-Id", "CSeq"];
    for (const key of keys) {
      if (inboundMessage.headers[key]) {
        this.headers[key] = inboundMessage.headers[key];
      }
    }
  }
}

export default ResponseMessage;
