# Instantiating a WebPhone

In our [getting started guide](index.md) you learned how to register your
WebPhone device and obtain a `sipInfo` object. You will need the `sipInfo`
object below.

## Creating an instance

Use your saved `sipInfo` object to instantiate a WebPhone.

```ts
import WebPhone from "ringcentral-web-phone";

const webPhone = new WebPhone({ sipInfo });
await webPhone.start();
```

## Working with multiple WebPhone instances

When you instantiate a WebPhone an instance ID will be assigned to your
instance. The instance ID defaults to the value of `sipInfo.authorizationId`. If
you plan on instantiating multiple instances of your WebPhone, each instance
will need a unique ID, which can be provided directly:

```ts
const webPhone = new WebPhone({ sipInfo, instanceId });
```

When creating instance IDs, please be aware of the following requirements (see
[RFC5626](https://datatracker.ietf.org/doc/html/rfc5626#section-4.1)):

1. Each instance ID MUST be unique for each device
2. Each instance ID MUST be persistent across power cycles of the device
3. Each instance ID MUST NOT change as the device moves from one network to
   another

If you start two web phone instances with the same `instanceId`, only the second
instance will be able to receive calls, as the RingCentral SIP server will not
route calls to the first instance. Both instances however will be able to place
calls. However, if you use unique instance IDs, then both instances will receive
SIP messages, including incoming calls.

!!! warning "A maximum of **five** instances are allowed" The maximum unique
live instances allowed for an extension is 5. If you try to register more, the
SIP server will reply with "SIP/2.0 603 Too Many Contacts".

    If you keep refreshing a browser page and each refresh generates a unique `instanceId`, then registration will fail upon creating the 6th web phone instance.

!!! tip "Shared workers" If you anticipate working with multiple WebPhone
instance, a practice common when opening multiple tabs in the same browser, then
we recommend you learn more about [shared workers](shared-workers.md) which can
help you create a more scalable solution that is not constrained by the five
instance limit.

## Instance expiry

It takes around one minute for the SIP server to mark an instance as expired (if
client doesn't refresh it any more). So after you receive the "SIP/2.0 603 Too
Many Contacts" error, you must wait one minute before trying again.

## Disposing of an instance

Alternatively, you can invoke [`dispose()`](../reference/dispose.md) to dispose
of a web phone instance before you close/refresh a browser page. That way, the
web phone instance registration is forcibly removed from the SIP server
immediately. This will avoid you having to wait one minute for the instance to
expire naturally.

```ts
await webPhone.dispose();
```

## Turning on debug mode

In debug mode, the SDK will print all SIP messages to the console. It is useful
for debugging.

```ts
const webPhone = new WebPhone({ sipInfo, debug: true });
```
