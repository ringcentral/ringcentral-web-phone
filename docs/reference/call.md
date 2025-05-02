```ts
const callSession = await webPhone.call(callee, callerId);
```

`callee` is the phone number you want to call. Format is like `16506668888`.
`callerId` is the phone number you want to display on the callee's phone. Format
is like `16506668888`.

To get all the `callerId` that you can use, you can call the following API:
https://developers.ringcentral.com/api-reference/Phone-Numbers/listExtensionPhoneNumbers.
Don't forget to filter the phone numbers that have
`"features": [..., "CallerId", ...]`.

