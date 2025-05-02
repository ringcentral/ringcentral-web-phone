### Flip the call

```ts
const result = await callSession.flip(targetNumber);
```

Most popular use case of call flip is for you to switch the current call to your
other devices. Let's say you are talking to someone on your desktop, and you
want to switch to your mobile phone. You can use call flip to achieve this:
`await callSession.flip(mobilePhoneNumber)`.

As soon as the flip starts, the remote peer will be put on hold (I wish the
remote peer will not be put on hold, it would be a more seamless experience) and
your mobile phone will get a call.

Please note that, after you mobile phone answers the call, you need to
**manually** end the call session on your desktop, otherwise you won't be able
to talk/listen on your mobile phone.

Please also note that, this SDK allows you to flip the call to any phone number,
not just your own phone numbers. But if it is not your number, you probably
should transfer the call instead of flipping the call.

A sample result of `flip` is like this:

```json
{
  "code": 0,
  "description": "Succeeded",
  "number": "+16506668888",
  "target": "16506668888"
}
```

I don't think you need to do anything based on the result. It is just for your
information.

Personally I don't think the flip feature is of much value, since it's basically
the same as "cold" transfer. Compare flip to "cold" transfer, there is only one
difference that I can tell:

- after you initiate "cold" transfer, the current call session will auto end
  since SIP server will send a "BYE" message to you.
- after you intiate a flip, the current call will not auto end. And you will
  need to manually end it for the flip to complete.
  - for more details, check the instructions above.

