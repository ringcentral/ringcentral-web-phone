import md5 from "blueimp-md5";

import type { SipInfo } from "./types.js";

// Private counter kept alive in the closure
let counter = 0;
export const uuid = () => {
  // 1. Increment counter safely (reset if it gets dangerously high, though unlikely)
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;

  // 2. Get current time in Base36 (alphanumeric)
  const timePart = Date.now().toString(36);

  // 3. Get the counter in Base36
  const countPart = counter.toString(36);

  // 4. Add a bit of Math.random for good measure (Base36, stripping '0.')
  const randomPart = Math.random().toString(36).substring(2, 8);

  // Combine them. Output example: "lq5z8f9x1a2b3c"
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
