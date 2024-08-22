import { DOMParser } from 'xmldom';

const domParser = new DOMParser();

interface HDR {
  [key: string]: string | undefined;
}
interface BDY {
  [key: string]: string | undefined;
}

class RcMessage {
  public static fromXml(_xmlStr: string) {
    let xmlStr = _xmlStr;
    if (xmlStr.startsWith('P-rc: ')) {
      xmlStr = xmlStr.substring(6);
    }
    const xmlDoc = domParser.parseFromString(xmlStr, 'text/xml');
    const rcMessage = new RcMessage({}, {});
    for (const tag of ['Hdr', 'Bdy']) {
      rcMessage[tag] = {};
      const element = xmlDoc.getElementsByTagName(tag)[0];
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        (rcMessage[tag] as HDR | BDY)[attr.nodeName] = attr.nodeValue as string;
      }
    }
    return rcMessage;
  }

  public Hdr: HDR;
  public Bdy: BDY;

  public constructor(Hdr: HDR, Bdy: BDY) {
    this.Hdr = Hdr;
    this.Bdy = Bdy;
  }

  public toXml() {
    return (
      '<Msg>' +
      ['Hdr', 'Bdy']
        .map(
          (Tag) =>
            `<${Tag} ${Object.keys(this[Tag])
              .map((Attr) => `${Attr}="${(this[Tag] as HDR | BDY)[Attr]}"`)
              .join(' ')}/>`,
        )
        .join('') +
      '</Msg>'
    );
  }
}

export default RcMessage;
