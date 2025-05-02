### Park the call

```ts
const result = await callSession.park();
```

After this method call, the call session will be ended for you. And the remote
peer will be put on hold and parked on an extension. You will be able to
retrieve the parked call by dialing `*[parked-extension]`. Sample result:

```json
{
  "code": 0,
  "description": "Succeeded",
  "park extension": "813"
}
```

Take the sample result above as an example, you can retrieve the parked call by
dialing `*813`.

