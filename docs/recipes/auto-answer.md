# Auto-answer a call

The Auto-Answer feature enables your application to automatically accept
incoming SIP calls based on specific SIP headers or through custom logic. This
is particularly useful for automated systems, call centers, or integrations
requiring immediate call handling.

!!! note "Use this approach with caution, as it will accept all incoming calls
automatically, which may not be suitable for all applications."

## Enabling Auto-Answer

By default, Auto-Answer is disabled. You can enable it during the instantiation
of the WebPhone instance or afterward:

**Enable during instantiation:**

```js
const webPhone = new WebPhone({
  sipInfo,
  autoAnswer: true,
});
```

Enable after instantiation:

```js
webPhone.autoAnswer = true;
```

## How It Works

When Auto-Answer is enabled, the SDK inspects incoming SIP INVITE messages for
specific headers:

- **Alert-Info Header**: If this header is present with the value Auto Answer,
  the call will be auto-answered.
- **Call-Info Header**: If this header contains Answer-After=<number>, the call
  will be auto-answered after the specified delay in seconds.

## Example SIP Headers:

```sql
Alert-Info: Auto Answer
Call-Info: <224981555_132089748@10.13.116.50>;purpose=info;Answer-After=0
```

In this example, the call will be auto-answered immediately upon receipt.

## Use Cases

Auto-Answer is essential for certain call control APIs, such as the Answer Call
Party API. When this API is invoked, the current call session is canceled, and a
new inbound call with auto-answer headers is sent to the target device. If
Auto-Answer is enabled, the call is automatically accepted.

### Auto-Answer All Calls

If you want to auto-answer all incoming calls, regardless of SIP headers, you
can implement custom logic:

```js
webPhone.on("inboundCall", async (callSession) => {
  await callSession.answer();
});
```
