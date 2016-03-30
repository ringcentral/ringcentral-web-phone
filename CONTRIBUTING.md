# Tests

## Installation

```sh
$ git clone https://github.com/ringcentral/ringcentral-web-phone.git
$ npm install
```

## Prerequisites

You need to have a file `credentials.js` with at least two accounts and apps:

```js
window.testCredentials = {
    accounts: [
        {
            username: '+1234567890',
            password: 'P@ssw0rd',
            appKey: 'xxx',
            appSecret: 'yyy',
            server: 'https://platform.devtest.ringcentral.com'
        },
        {
            username: '+1234567890',
            password: 'P@ssw0rd',
            appKey: 'xxx',
            appSecret: 'yyy',
            server: 'https://platform.devtest.ringcentral.com'
        }
    ]
};
```

Accounts and apps must meet [requirements](https://github.com/ringcentral/ringcentral-web-phone#configuring-your-ringcentral-app).

You may call from one environment to another.

## Test run

Single test run:

```sh
$ npm test
```

Keep the browser open to manually refresh tests when needed (useful for debug):

```sh
$ npm run test-persist
```