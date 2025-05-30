## Switch call to this device

Let's say you are having a phone call on your mobile phone app. And you would
like to switch the call to desktop app.

The official RingCentral apps for mobile and desktop already supports it, please
refer to
[this article](https://support.ringcentral.com/article-v2/Switching-a-call-or-meeting-between-desktop-and-mobile-in-the-RingCentral-app.html?brand=RingCentral&product=RingEX&language=en_US&pills-nav=call).

But how do we achieve the same with this SDK?

First of all, you will need the `sipData` of the ongoing call. Especially, the
`telephonySessionId`, the `fromTag` and the `toTag`.

Once you have that, it is easy to switch the call to this device:

```ts
this.webPhone.call("whatever", undefined, {
  headers: {
    Replaces:
      `${telephonySessionId};to-tag=${toTag};from-tag=${fromTag};early-only`,
  },
});
```

The "callee" number we specified above is "whatever". Since we are not making a
new outbound call, we just try to replace an existing call. The callee number
could be fake.

### Where to get sipData?

Where to get the `telephonySessionId`, the `fromTag` and the `toTag`?

If you are using some SDKs, like this SDK, or the softphone SDK, you will be
able to get them via the headers of SIP messages.

Or you could get them by setting up subscriptions. It's a topic out of the scope
of this SDK. You may find more details here:
https://github.com/tylerlong/rc-softphone-call-id-test
