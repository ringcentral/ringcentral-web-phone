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

  public Hdr: HDR;
  public Bdy: BDY;

  public constructor(Hdr: HDR, Bdy: BDY) {
    this.Hdr = Hdr;
    this.Bdy = Bdy;
  }

  public toXml() {
    const xml = builder.buildObject({
      Msg: {
        Hdr: {
          $: this.Hdr,
        },
        Bdy: {
          $: this.Bdy,
        },
      },
    });
    return xml;
  }
}

export default RcMessage;
