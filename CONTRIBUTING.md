# Installation

```sh
$ git clone https://github.com/ringcentral/ringcentral-web-phone.git
$ npm install
```

# Tests

## Prerequisites

You need to have a file `.env` with at least two accounts and apps:

```
RC_WP_CALLER_USERNAME=+12223334455
RC_WP_CALLER_PASSWORD=xxx
RC_WP_CALLER_APPKEY=xxx
RC_WP_CALLER_APPSECRET=xxx
RC_WP_CALLER_SERVER=https://platform.devtest.ringcentral.com
RC_WP_RECEIVER_USERNAME=+12223334455
RC_WP_RECEIVER_PASSWORD=xxx
RC_WP_RECEIVER_APPKEY=xxx
RC_WP_RECEIVER_APPSECRET=xxx
RC_WP_RECEIVER_SERVER=https://platform.devtest.ringcentral.com
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
$ npm run test:watch
```

# Releasing

Make sure version in `src/ringcentral-web-phone.js` is bumped.