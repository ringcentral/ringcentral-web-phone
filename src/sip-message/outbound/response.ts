import type InboundMessage from "../inbound.js";
import responseCodes from "../response-codes.js";
import OutboundMessage from "./index.js";

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
    for (const key of ["Via", "From", "To", "Call-Id", "CSeq"]) {
      const entry = Object.entries(inboundMessage.headers).find(
        ([headerKey]) => headerKey.toLowerCase() === key.toLowerCase(),
      );
      if (entry) {
        this.headers[entry[0]] = entry[1];
      }
    }
  }
}

export default ResponseMessage;
