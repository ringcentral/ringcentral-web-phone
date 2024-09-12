export interface WebPhoneOptions {
  sipInfo: SipInfo;
  instanceId?: string; // ref: https://docs.oracle.com/cd/E95618_01/html/sbc_scz810_acliconfiguration/GUID-B2A15693-DA4A-4E24-86D4-58B19435F4DA.htm
  debug?: boolean;
}

export interface SipInfo {
  authorizationId: string;
  domain: string;
  outboundProxy: string;
  username: string;
  password: string;
  stunServers: string[];
}
