# callSession.sendDtmf()

DTMF stands for Dual-Tone Multi-Frequency. It's the system used for telephone signaling over analog telephone lines in the voice-frequency band. DTMF allows the user to dial numbers and send commands by pressing keys on a telephone keypad.

How It Works:

* Each key on the keypad generates two simultaneous tones—one from a high-frequency group and one from a low-frequency group.
* These combined tones are unique to each key and can be decoded by the telephone system to identify which button was pressed.

`ABCD` are less commonly used but are part of the DTMF standard. They were originally intended for special signaling in military and network control systems.

This method is used to send a DTMF. However, receving DTMF is not supported, as it is not supported by WebRTC.

## Sample

```ts
await callSession.sendDtmf(dtmf);
```

## Inputs

| Parameters | Description |
|------------|-------------|
| `dtmf`     | A string containing only the following characters: `0123456789*#ABCD`. |

## Outputs

None.
