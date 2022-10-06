# Developer Notes (by Tyler Liu)


## What I did

- Update TypeScript and Webpack to latest version
- Replace all appKey/appSecret with clientId/clientSecret
- Replace npm with yarn
- Replace ringcentral with @ringcentral/sdk


## Phone number format

When you use the demo application, make sure that you enter the phone number format as '6501234567', not '(650) 123-4567'.
Otherwise outbound call doesn't work.


## Quick start

```
yarn install
yarn build
```

host the website in `dist/` folder, it should be a fully working version.


## Issue 1

node_modules/sip.js/types/index.d.ts:50:14 - error TS2304: Cannot find name 'Transport'.

Add:

```ts
import { Transport } from "./transport";
```

to node_modules/sip.js/types/index.d.ts
