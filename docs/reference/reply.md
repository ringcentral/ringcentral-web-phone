Optionally, you can tell the server that the user has started replying the call.
The server will give the user more time to edit the reply message before ending
the call or redirecting the call to voicemail.

```ts
await inboundCallSession.startReply();
```

Reply the call with text:

```ts
const response = await inboundCallSession.reply(text);
```

After this method call, the call session will be ended for the callee. But the
call session will not end yet for the caller. And the caller will receive the
replied `text` via text-to-speech. The caller will then have several options:

- press 1 to repeat the message
- press 2 to leave a voicemail
- press 3 to reply with "yes"
- press 4 to reply with "no"
- press 5 to reply with "urgent, please call immediately"
  - the caller will be prompted to specify a callback number
- press 6 to to disconnect

`if (response.body.Sts === '0')`, it means that the caller replied to your
message(he/she pressed 3, 4, 5). Then you need to check `response.body.Resp`:

- if it's `'1'`, it means that the caller replied with "yes" (he/she pressed 3)
- if it's `'2'`, it means that the caller replied with "no" (he/she pressed 4)
- if it's `'3'`, it means that the caller replied with "urgent, please call
  [number] immediately". (he/she pressed 5)
  - in this case, there is also an urgent number provided by the caller which
    can be accessed by `response.body.ExtNfo`.

Below is some code snippet for your reference:

```ts
const response = await session.reply(
  "I am busy now, can I call you back later?",
);
if (response.body.Sts === "0") {
  const message = `${response.body.Phn} ${response.body.Nm}`;
  let description = "";
  switch (response.body.Resp) {
    case "1":
      description = "Yes";
      break;
    case "2":
      description = "No";
      break;
    case "3":
      description = `Urgent, please call ${response.body.ExtNfo} immediately!`;
      break;
    default:
      break;
  }
  globalThis.notifier.info({
    message, // who replied
    description, // what replied
    duration: 0,
  });
}
```

