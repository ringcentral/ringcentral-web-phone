# Tests

## Prerequisites

You need to have a file `credentials.js` with at least two accounts:

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

## Test run

From console:

```sh
npm test
```

From browser:

Open `tests/test.html`.