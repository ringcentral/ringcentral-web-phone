import { v4 } from "uuid";
import md5 from "blueimp-md5";

import type { SipInfo } from "./types.js";

export const uuid = () => v4();
export const branch = () => "z9hG4bK-" + uuid();

const generateResponse = (
  sipInfo: SipInfo,
  endpoint: string,
  nonce: string,
) => {
  const ha1 = md5(
    `${sipInfo.authorizationId}:${sipInfo.domain}:${sipInfo.password}`,
  );
  const ha2 = md5(endpoint);
  const response = md5(`${ha1}:${nonce}:${ha2}`);
  return response;
};

export const generateAuthorization = (
  sipInfo: SipInfo,
  nonce: string,
  method: "REGISTER" | "INVITE",
) => {
  const authObj = {
    "Digest algorithm": "MD5",
    username: sipInfo.authorizationId,
    realm: sipInfo.domain,
    nonce,
    uri: `sip:${sipInfo.domain}`,
    response: generateResponse(
      sipInfo,
      `${method}:sip:${sipInfo.domain}`,
      nonce,
    ),
  };
  return Object.keys(authObj)
    .map((key) => `${key}="${authObj[key]}"`)
    .join(", ");
};

export const withoutTag = (s: string) => s.replace(/;tag=.*$/, "");
export const extractAddress = (s: string) => s.match(/<(sip:.+?)>/)![1];
export const extractNumber = (s: string) => s.match(/<sip:(.+?)@/)![1];
export const extractTag = (peer: string) => {
  const match = peer.match(/;tag=(.*)/);
  return match ? match[1] : "";
};

export const fakeDomain = uuid() + ".invalid";
export const fakeEmail = uuid() + "@" + fakeDomain;
