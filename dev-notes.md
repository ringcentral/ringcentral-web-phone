# Developer Notes (by Tyler Liu)

## Phone number format

When you use the demo application, make sure that you enter the phone number format as '6501234567', not '(650) 123-4567'.
Otherwise outbound call doesn't work.


## Quick start

```
yarn install
yarn start
```

Visit http://localhost:8080 to test.


## Issue 1

According to https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices

`Navigator.mediaDevices` is available only in secure contexts (HTTPS).

You cannot run the demo in local http.

So I published a demo app to https://chuntaoliu.com/rc-web-phone-demo/
Source code is https://github.com/tylerlong/rc-web-phone-demo

Not sure why, but `yarn start` just works now.


## New changes in 0.9.0

event 'accepted' renamed to 'established'

session.ua.xxx renamed to session.userAgent.xxx
