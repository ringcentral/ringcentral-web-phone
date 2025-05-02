---
hide:
  - navigation
---
# Get started with the RingCentral Web Phone SDK

## Installation

```
yarn add ringcentral-web-phone
```

### Without a bundling tool

You can use this library without a bundling tool:

```html
<script src="/path/to/ringcentral-web-phone/dist/esm/index.umd.js"></script>
```

Or you could use a CDN:

```html
<script
  src="https://cdn.jsdelivr.net/npm/ringcentral-web-phone@2.1.5/dist/esm/index.umd.js"
></script>
```

## Obtain a Device ID

This SDK assumes that you have basic knowledge of RingCentral Platform. You have created a RingCentral app and you know how to invoke RingCentral APIs.

This SDK assumes that you know how to invoke [Device SIP Registration](https://developers.ringcentral.com/api-reference/Device-SIP-Registration/createSIPRegistration) to get a `sipInfo` object.

With `@rc-ex/core`, it is done like this:

```ts
import RingCentral from "@rc-ex/core";

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });
  const r = await rc
    .restapi()
    .clientInfo()
    .sipProvision()
    .post({
      sipInfo: [{ transport: "WSS" }],
    });
  const sipInfo = r.sipInfo![0];
  console.log(sipInfo); // this is what we need

  const deviceId = r.device!.id; // Web Phone SDK doesn't need `deviceId`, just for your information.
  await rc.revoke(); // Web Phone SDK doesn't need a long-living Restful API access token, you MAY logout
};
main();
```

Please note that, you may save and re-use `sipInfo` for a long time. You don't need to invoke `Device SIP Registration` every time you start the web phone.

In the sample code above, I also showed you how to get the `deviceId`. Web Phone SDK doesn't need `deviceId`, it is just for your information. Just in case you may need it for [RingCentral Call Control API](https://developers.ringcentral.com/api-reference/Call-Control/createCallOutCallSession).

## Initialize your web phone instance

```ts
import WebPhone from "ringcentral-web-phone";

const webPhone = new WebPhone({ sipInfo });
await webPhone.start();
```


