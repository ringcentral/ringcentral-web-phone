### Private parking

RingCentral supports
[park location](https://support.ringcentral.com/article-v2/8355.html?brand=RC_US&product=RingEX&language=en_US)
feature. You may create a park location with a name, and specify who can
park/retrieve calls to/from this location.

To park to a predefined location, you need to get the location's ID. You will
need to login https://service.ringcentral.com and go to "Phone System > Groups >
Park Locations". Click the park location and you will see its ID in browser URL.
Save it as `parkLocationId`.

To park a call to a park location, just do this:

```ts
await callSession.transfer(`prk${parkLocationId}`);
```

Please note that, the call must be answered before it can be private parked. You
cannot park a still ringing call. As I tested, parking an unanswered call will
receive `SIP/2.0 202 Accepted` from server but the call is not parked at all.

#### Retrieve private parked calls

This part requires you to invoke RESTful API and setup subscriptions. It's out
of the scope of this SDK. Here I just provide the information for your
reference:

You will need to subscribe to
`/restapi/v1.0/account/~/extension/{parkLocationId}/presence?detailedTelephonyState=true&sipData=true`
events.

When some one private parks a call, you will be able to get a notification like
this one:

```
"body": {
 "extensionId": <parkLocationId>,
 "telephonyStatus": "ParkedCall",
 "activeCalls": [
   {
     "sipData": {
       "toTag": "gK061ccd05",
       "fromTag": "10.14.22.230-5070-fd226b1e-f8bd-43aa",
     },
     "telephonySessionId": "s-a0e16e61c511cz1935660a889zd0e85b0000"
   }
 ],
 ...
```

You need to write code like this to retrieve it:

```ts
await webPhone.call(`prk${parkLocationId}`, undefined, {
  headers: {
    Replaces:
      `${telephonySessionId};to-tag=${fromTag};from-tag=${toTag};early-only`,
  },
});
```

Please pay attention to `to-tag=${fromTag};from-tag=${toTag}`, it is NOT
`to-tag=${toTag};from-tag=${fromTag}`!

Demo application: https://github.com/tylerlong/rc-web-phone-private-parking-demo
