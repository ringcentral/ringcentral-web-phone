# webPhone.call()

```ts
const callSession = await webPhone.call(callee, callerId);
```

### Inputs

| Parameter  | Description                                                                          |
|------------|--------------------------------------------------------------------------------------|
| `callee`   | The phone number you want to call. Format is `16506668888`.                          |
| `callerId` | The phone number you want to display on the callee's phone. Format is `16506668888`. |

Don't get your hopes up, you can't use any caller ID that you desire. You are limited to a list of pre-registered caller IDs that you can retrieve from RingCentral using the [list extension phone numbers API](https://developers.ringcentral.com/api-reference/Phone-Numbers/listExtensionPhoneNumbers). You will need to filter the phone numbers returned by that API and only use the ones with the `CallerId` feature.

```js hl_lines="4"
{
  "features": [
     ...,
	 "CallerId", 
	 ...
  ]
}
```
  

