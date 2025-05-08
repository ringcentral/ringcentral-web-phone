# webPhone.on('ringing', callback)

This event is triggered when a call is connected and it is ringing. It is an event that has very little utility, because when you make an outbound call, or by the time you receive an inbound call event, by the time the `callSession` object is returned, the phone is already ringing. 

Therefore, these two code samples are functionally equivalent to the `ringing` event:

=== "Placing a call"

    ```js
    const callSession = await webPhone.call(...)
    ```

=== "Receiving a call"

    ```js
    webPhone.on('inboundCall', callSession => {...})
    ```

## Sample

```js
webPhone.on('ringing', callSession => {...})
```
