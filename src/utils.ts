import md5 from "blueimp-md5";

import type { SipInfo } from "./types.js";

let counter = 0;
export const uuid = () => {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  const timePart = Date.now().toString(36);
  const countPart = counter.toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${timePart}${countPart}${randomPart}`;
};

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
  return md5(`${ha1}:${nonce}:${ha2}`);
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
  return Object.entries(authObj)
    .map(([key, value]) => `${key}="${value}"`)
    .join(", ");
};

export const withoutTag = (s: string) => s.replace(/;tag=.*$/, "");
export const extractAddress = (s: string) => s.match(/<(sip:.+?)>/)![1];
export const extractNumber = (s: string) => s.match(/<sip:(.+?)@/)![1];
export const extractTag = (peer: string) => peer.match(/;tag=(.*)/)![1];

export const fakeDomain = uuid() + ".invalid";
export const fakeEmail = uuid() + "@" + fakeDomain;
