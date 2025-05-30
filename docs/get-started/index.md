# Get started with RingCentral's WebPhone SDK

The WebPhone SDK empowers developers to build their own custom browser-based
phone and CTI. Getting started in quick and easy for those who have a
RingCentral developer account. Let's take you through the process.

## Obtain a client ID and secret

If you have not already, signup for a
[RingCentral Developer account](https://developers.ringcentral.com/pricing).
Then:

1. Login to the
   [Developer Console](https://developers.ringcentral.com/my-account.html)

2. [Register your application](https://developers.ringcentral.com/guide/getting-started/register-app)
   with following settings:
   - Select "JWT auth flow" under **Auth**
   - Select the following **application scopes**:
     - VoIP Calling
     - WebSocket Subscriptions

3. [Generate a JWT credential](https://developers.ringcentral.com/guide/getting-started/create-credential)

Then, make note of your **Client ID** and **Client Secret**, you will need them
later.

## Install the SDK

Download and install the SDK from npmjs:

```
yarn add ringcentral-web-phone
```

#### Alternative methods

You can use this library directly without a bundling tool. Just download a
release, unzip it, and load it via a `<script>` tag.

=== "Locally"

    ```html
    <script src="/path/to/ringcentral-web-phone/dist/esm/index.umd.js"></script>
    ```

=== "CDN"

    ```html
    <script
      src="https://cdn.jsdelivr.net/npm/ringcentral-web-phone@2.1.5/dist/esm/index.umd.js"
    </script>
    ```

## Register your web phone

!!! tip "Are you a new RingCentral developer?" For the purposes of this getting
started exercise, we assume you have basic knowledge of the RingCentral Platform
and how to calls its APIs. If you are new to RingCentral, we recommend going
through the
[getting started](https://developers.ringcentral.com/guide/getting-started)
experience found in our Developer Guide.

To begin, you need to register your "device" associated with the phone you are
about to build. Registration is done by calling the
[SIP registration](https://developers.ringcentral.com/api-reference/Device-SIP-Registration/createSIPRegistration)
API. You will need the `sipInfo` object returned by this API.

#### Sample code

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

!!! tip "Save `sipInfo` for later use" Please note that, you may save and re-use
`sipInfo` for a long time. You don't need to invoke `Device SIP Registration`
every time you start the web phone.

!!! tip "Save `deviceId` for use in the REST API" In the sample code above, you
can see how to access the `deviceId`. The Web Phone SDK doesn't need the
`deviceId`, but it is useful when calling certain REST APIs, like the
[Call Control API](https://developers.ringcentral.com/api-reference/Call-Control/createCallOutCallSession).

## Initialize your WebPhone

With your `sipInfo` in hand, you can initialize an instance of your WebPhone.

```ts
import WebPhone from "ringcentral-web-phone";

const webPhone = new WebPhone({ sipInfo });
await webPhone.start();
```

## Next steps...

Once your WebPhone is initialized, you can then begin building your client. You
can:

- [Subscribe to events](../events/index.md)
- [Place or receive a phone call](sessions.md)
