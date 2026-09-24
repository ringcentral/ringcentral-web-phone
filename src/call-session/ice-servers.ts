import type InboundMessage from "../sip-message/inbound.js";

export const sipProvidedIceServers = (
  message: InboundMessage,
): RTCIceServer[] | undefined => {
  const header = message.getHeader("p-rc-ice-servers");
  if (header === undefined) return undefined;

  let servers: unknown;
  try {
    servers = JSON.parse(header);
  } catch (error) {
    throw new Error(
      "Invalid p-rc-ice-servers header: expected a JSON array of ICE servers",
      { cause: error },
    );
  }

  if (
    !Array.isArray(servers) ||
    !servers.every((server) => {
      if (!server || typeof server !== "object") return false;
      const { urls, username, credential } = server as Record<string, unknown>;
      const validUrls =
        (typeof urls === "string" && urls.length > 0) ||
        (Array.isArray(urls) &&
          urls.length > 0 &&
          urls.every((url) => typeof url === "string" && url.length > 0));
      return (
        validUrls &&
        (username === undefined || typeof username === "string") &&
        (credential === undefined || typeof credential === "string")
      );
    })
  ) {
    throw new Error(
      "Invalid p-rc-ice-servers header: expected a JSON array of ICE servers",
    );
  }

  return servers as RTCIceServer[];
};
