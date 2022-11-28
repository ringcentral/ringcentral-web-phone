# Developer Notes (by Tyler Liu)

## Phone number format

When you use the demo application, make sure that you enter the phone number format as '6501234567', not '(650) 123-4567'.
Otherwise outbound call doesn't work.

When you call a foreign number, it's a good idea to add prefix '+', for example: +61123456789


## Quick start

```
yarn install
yarn serve
```

Visit http://localhost:8080 to test.


## New changes in 0.9.0

event 'accepted' renamed to 'established'

session.ua.xxx renamed to session.userAgent.xxx


## Todo

- Update sip.js
- Replace the demo with React.js
