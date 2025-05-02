### Hold/Unhold the call

```ts
await callSession.hold();
await callSession.unhold();
```

If you put the call on hold, the remote peer will hear hold music. Neither you
nor the remote peer can hear each other. If you unhold the call, you and the
remote peer can hear each other again.
