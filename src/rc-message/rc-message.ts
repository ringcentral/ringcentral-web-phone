import { XMLBuilder, XMLParser } from "fast-xml-parser";

export interface HDR {
  [key: string]: string | undefined;
}
export interface BDY {
  [key: string]: string | undefined;
}

class RcMessage {
  private static xmlOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
    attributesGroupName: "$",
    format: false,
    suppressEmptyNode: true,
  };

  public static fromXml(_xmlStr: string) {
    let xmlStr = _xmlStr;
    if (xmlStr.startsWith("P-rc: ")) {
      xmlStr = xmlStr.substring(6);
    }
    const parser = new XMLParser(RcMessage.xmlOptions);
    const parsed = parser.parse(xmlStr);
    return new RcMessage(parsed.Msg.Hdr.$, parsed.Msg.Bdy.$);
  }

  public headers: HDR;
  public body: BDY;

  public constructor(headers: HDR, body: BDY) {
    this.headers = headers;
    this.body = body;
  }

  public toXml() {
    const builder = new XMLBuilder(RcMessage.xmlOptions);
    const obj = {
      Msg: {
        Hdr: {
          $: this.headers,
        },
        Bdy: {
          $: this.body,
        },
      },
    };
    return builder.build(obj);
  }
}

export default RcMessage;
