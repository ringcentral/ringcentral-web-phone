# callSession.park()

Upon calling this method, the call session will be ended for you, and the remote peer will be put on hold and parked on an extension. You will be able to retrieve the parked call by dialing `*<parked extension>`. The extension the user is parked is returned in the response returned by the method. 

**Sample response**

```json
{
  "code": 0,
  "description": "Succeeded",
  "park extension": "813"
}
```

Take the sample result above as an example, you can retrieve the parked call by dialing `*813`.

## Sample

```ts
const result = await callSession.park();
```

## Inputs

None.

## Outputs

| Parameters              | Description                                       |
|-------------------------|---------------------------------------------------|
| `result`                | The response received from parking the call.      |
| `result.code`           | The response code. A zero indicates success.      |
| `result.description`    | A string describing the result, e.g. "succeeded". |
| `result.park extension` | The extension the user was parked at.             |

