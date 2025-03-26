# Installation

```sh
$ git clone https://github.com/ringcentral/ringcentral-web-phone.git
$ yarn install
```

# Tests

## Prerequisites

You need to have a file `.env` with at least two accounts:

```
RC_WP_SERVER=https://platform.ringcentral.com
RC_WP_CLIENT_ID=
RC_WP_CLIENT_SECRET=
RC_WP_CALLER_JWT_TOKEN=
RC_WP_RECEIVER_JWT_TOKEN=
```

Accounts and apps must meet
[requirements](https://github.com/ringcentral/ringcentral-web-phone#configuring-your-ringcentral-app).

You may call from one environment to another.

## Test run

Single test run:

```sh
$ yarn test
```

Keep the browser open to manually refresh tests when needed (useful for debug):

```sh
$ yarn run test:watch
```
