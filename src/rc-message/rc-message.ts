import xml2js from 'xml2js';

const parser = new xml2js.Parser({
  explicitArray: false,
});

const builder = new xml2js.Builder({
  renderOpts: {
    pretty: false,
  },
  headless: true,
});

interface HDR {
  [key: string]: string | undefined;
}
interface BDY {
  [key: string]: string | undefined;
}

class RcMessage {
  public static async fromXml(_xmlStr: string) {
    let xmlStr = _xmlStr;
    if (xmlStr.startsWith('P-rc: ')) {
      xmlStr = xmlStr.substring(6);
    }
    const parsed = await parser.parseStringPromise(xmlStr);
    return new RcMessage(parsed.Msg.Hdr.$, parsed.Msg.Bdy.$);
  }

  public headers: HDR;
  public body: BDY;

  public constructor(Hdr: HDR, Bdy: BDY) {
    this.headers = Hdr;
    this.body = Bdy;
  }

  public toXml() {
    const xml = builder.buildObject({
      Msg: {
        Hdr: {
          $: this.headers,
        },
        Bdy: {
          $: this.body,
        },
      },
    });
    return xml;
  }
}

export default RcMessage;
