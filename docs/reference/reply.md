# callSession.reply()

!!! info "This is reserved for inbound call sessions only."

When this method is called, the call session is terminated for the callee, but not for the caller. Instead the caller will hear a message, before being prompted to enter a number of their keypad. The content of the message is delivered via text-to-speech, with the source being the value of the `text` input variable. After reading the message to the caller, they will then hear several options:

- press 1 to repeat the message
- press 2 to leave a voicemail
- press 3 to reply with "yes"
- press 4 to reply with "no"
- press 5 to reply with "urgent, please call immediately"
- press 6 to to disconnect

If the caller selects 5, they will then be prompted to enter a call back number. 

## Sample

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

## Inputs

| Parameter | Description                        |
|-----------|------------------------------------|
| `text`    | The message to send to the caller. |

## Outputs

| Parameter              | Description                              |
|------------------------|------------------------------------------|
| `response`             | The response returned by the SIP server. |
| `response.body.Sts`    | If this property is equal to zero, then the caller responded to the prompt. The value they entered is stored in `Resp`. |
| `response.body.Resp`   | The caller's response to the reply `text` prompt. |
| `response.body.ExtNfo` | If the caller pressed "5" indicating that the call is urgent and requests a call back, then this properly will hold the phone number they entered. |

#### Understanding the value of `Resp`

| `Resp` | Meaning                                                                                            |
|--------|----------------------------------------------------------------------------------------------------|
| `1`  | it means that the caller replied with "yes" (they pressed 3)                                       |
| `2`  | it means that the caller replied with "no" (they pressed 4)                                        |
| `3`  | it means that the caller replied with "urgent, please call [number] immediately". (they pressed 5) |

