# Table of contents

- [Key Benefits](#key-benefits)
- [Installation](#installation)
- [Migration from previous releases](#migration-from-previous-releases)
- [Getting Started](#getting-started)
- [API Calls](#api-calls)
- [Server-side Subscriptions](#server-side-subscriptions)
- [Making telephony calls](#making-telephony-calls)
- [Call management using JavaScript](#call-management-using-javascript)
- [SMS](#sms)
- [Fax](#fax)
- [Page visibility](#page-visibility)
- [Tracking network Requests And Responses](#tracking-network-requests-and-responses)

***

# Key Benefits

- Automatically handles token lifecycle procedures in multi-tab environment
- Re-issues non-authorized requests
- Decrypts PUBNUB notification messages
- Parses multipart API responses
- Restores subscriptions from cache
- Automatically re-subscribes in case of subscription renewal errors
- Compatible with latest WhatWG `fetch()` spec (DOM Requests and Responses)

***

# Installation

SDK can be used in 3 environments:

1. [Browser](#set-things-up-in-browser)
2. [NodeJS](#set-things-up-in-nodejs)
3. [Browserify or Webpack](#set-things-up-for-browserify-or-webpack)

## Set things up in Browser

### Get the code

Pick the option that works best for you:

- **Preferred way to install SDK is to use Bower**, all dependencies will be downloaded to `bower_components` directory:

    ```sh
    bower install ringcentral --save
    ```
    
- Donwload everything manually *(not recommended)*:
    - [ZIP file with source code](https://github.com/ringcentral/ringcentral-js/archive/master.zip)
    - [Fetch](https://github.com/github/fetch), direct download: [fetch.js](https://raw.githubusercontent.com/github/fetch/master/fetch.js)
    - [ES6 Promise](https://github.com/jakearchibald/es6-promise), direct download: [es6-promise.js](https://raw.githubusercontent.com/jakearchibald/es6-promise/master/dist/es6-promise.js)
    - [PUBNUB](https://github.com/pubnub/javascript), direct download: [pubnub.js](https://raw.githubusercontent.com/pubnub/javascript/master/web/pubnub.js)

### Add scripts to HTML page (if you are not using any module loaders)

Add the following to your HTML:

```html
<script type="text/javascript" src="path-to-scripts/es6-promise/promise.js"></script>
<script type="text/javascript" src="path-to-scripts/fetch/fetch.js"></script>
<script type="text/javascript" src="path-to-scripts/pubnub/web/pubnub.js"></script>
<script type="text/javascript" src="path-to-scripts/ringcentral/build/ringcentral.js"></script><!-- or ringcentral.min.js -->
<script type="text/javascript">

    var sdk = new RingCentral.SDK(...);

</script>
```

**Not recommended!** You also can use bundle version with all dependencies:

```html
<script type="text/javascript" src="path-to-scripts/ringcentral/build/ringcentral-bundle.js"></script><!-- or ringcentral-bundle.min.js -->
<script type="text/javascript">

    var sdk = new RingCentral.SDK(...);

</script>
```

Keep in mind that this is for quick start only and for production you should add each dependency separately to have
full control over the process.

### If you use RequireJS in your project

```js
// Add this to your RequireJS configuration file
require.config({
    paths: {
        'es6-promise': 'path-to-scripts/es6-promise-polyfill/promise',
        'fetch': 'path-to-scripts/fetch/fetch',
        'pubnub': 'path-to-scripts/pubnub/web/pubnub'
        'ringcentral': 'path-to-scripts/ringcentral/build/ringcentral', // or ringcentral.min
    }
});

// Then you can use the SDK like any other AMD component
require(['ringcentral', 'es6-promise', 'fetch'], function(SDK, Promise) {
    
    Promise.polyfill();
    var sdk = new SDK(...);
    
});
```

Make sure that polyfills are loaded before or together with SDK.

## Set things up in NodeJS

1. Install the NPM package:

    ```sh
    npm install ringcentral --save
    ```

2. Require the SDK:

    ```js
    var SDK = require('ringcentral');
    var sdk = new SDK(...);
    ```

## Set things up for Browserify or Webpack

**!!! This is experimental !!!**

1. Follow installation steps for NodeJS
2. Add the following to your `webpack.config.js`, path should be relative to Webpack configuration file:
    
    ```js
    {
        resolve: {
            alias: {
                'node-fetch': path.resolve('./bower_components/fetch/fetch.js'),
                'es6-promise': path.resolve('./bower_components/es6-promise/promise.js'),
                'pubnub': path.resolve('./bower_components/pubnub/web/pubnub.js')
            }
        }
    }
    ```

To reduce the size of your Webpack bundle it's better to use browser version of dependencies (instead of the ones that
are installed via NPM along with the SDK). You can get them via Bower or directly download the the source.
More information can be found in [installation for browser](#1-set-things-up-in-browser).

## Polyfills for old browsers

You can use any of your favourite `fetch()` and `Promise` polyfills. SDK tries to get them from global scope every
time new instance is created.

In rare case when SDK will not detect globals automatically you can set them as follows:

```js
window.Promise = whatever;
window.fetch = whatever;
window.Headers = whatever;
window.Request = whatever;
window.Response = whatever;
```

Also you can manually define SDK internal variables:

```js
RingCentral.SDK.core.Externals.Promise = whatever;
RingCentral.SDK.core.Externals.fetch = whatever;
RingCentral.SDK.core.Externals.Headers = whatever;
RingCentral.SDK.core.Externals.Request = whatever;
RingCentral.SDK.core.Externals.Response = whatever;
```

But taking into account the nature of polyfills, it's better to keep them global as described before.

***

# Migration from previous releases

**!!! Attention !!!**

**In SDK version 2.0 Helpers were moved to separate repository: [ringcentral-js-helpers](https://github.com/ringcentral/ringcentral-js-helpers).**

A lot of code improvements were implemented in order to make SDK compatible with WhatWG Fetch, DOM Requests & DOM Responses.

Full list of migration instructions:

- [0.13 to 0.14](docs/migration-0.13-0.14.md)
- [1.1 to 1.2](docs/migration-1.1-1.2.md)
- [1.x to 2.0](docs/migration-1.x-2.0.md)

***

# Getting Started

## Instantiate the RingCentral object

The SDK is represented by the global RingCentral constructor. Your application must create an instance of this object:

In order to bootstrap the RingCentral JavaScript SDK, you have to first get a reference to the Platform singleton and
then configure it. Before you can do anything using the Platform singleton, you need to configure it with the server URL 
(this tells the SDK which server to connect to) and your unique API key (this is provided by RingCentral's developer 
relations team).

```js
var rcsdk = new RingCentral.SDK({
    server: 'https://platform.devtest.ringcentral.com', // SANDBOX
    //server: 'https://platform.ringcentral.com', // PRODUCTION
    appKey: 'yourAppKey',
    appSecret: 'yourAppSecret'
});
```

This instance will be used later on to perform calls to API.

## Get the Platform singleton

```js
var platform = rcsdk.platform();
```

Now that you have your platform singleton and SDK has been configured with the correct server URL and API key, your
application can log in so that it can access the features of the API.

## Login

Login is accomplished by calling the `platform.login()` method of the Platform singleton with username, extension
(optional), and password as parameters. A `Promise` instance is returned, resolved with an AJAX `Response` object.

```js
rcsdk.platform()
    .login({
        username: '18001234567', // phone number in full format
        extension: '', // leave blank if direct number is used
        password: 'yourpassword'
    })
    .then(function(response) {
          // your code here
    })
    .catch(function(e) {
        alert(e.message  || 'Server cannot authorize user');
    });
```

## Handling login success

Because the login process is asynchronous, you need to call the promise's `then` method and pass your success handler as
the continuation function.

This function will be called once login has succeeded, which allows the application to then perform updates to
the user interface, and then perform the next actions using the API to load account details for the user's account
and such.

## Handling login failure

Login can, of course, fail - a user can enter the incorrect password or mistype their user name.

To handle cases where login fails, you can provide an error handler function in a call to the Promise's `catch` method.
To keep this example simple, a simple JavaScript alert is being used. In a real application, you will want to provide
a good UX in your login form UI.

## Checking login state

To check in your Application if the user is authenticated, you can call the `loggedIn` method of the platform
singleton:

```js
rcsdk.platform().loggedIn().then(function(status){ ... });
```

The SDK takes care of the token lifecycle. It will refresh tokens for you automatically. It will also automatically
pause and queue all new API requests while the token is being refreshed in order to prevent data loss or inconsistency
between SDK instances in different tabs. Paused / queued API requests will then be automatically processed once the
token has been refreshed. All apropriate events will be emitted during this process.

If you just need to check whether the user has a valid token, you can call the `accessTokenValid` method:

```js
rcsdk.platform().auth().accessTokenValid(); // returns boolean
```

## Logout

Logging the user out is trivial - just call the `logout` method on the platform singleton:

```js
rcsdk.platform().logout().then(...).catch(...);
```

## Events

The platform provides the following events:

- `loginSuccess`
- `loginError`
- `logoutSuccess`
- `logoutError`
- `refreshSuccess`
- `refreshError` &mdash; application may listen to this error and show login page

To listen on platform events, you should call the `on` method of the platform singleton:

```js
var platform = rcsdk.platform();

platform.on(platform.events.refreshError, function(e){
    // do something
});
```

The `on` method accepts an event type as its first argument and a handler function as its second argument.

## Cache

In the NodeJS it might be useful to replace simple built-in storage with something persistent:

```js
RingCentral.SDK.core.Externals.localStorage = Anything;
```

# API calls

To perform an authenticated API call, you should use the one of the methods of the platform singleton:

```js
rcsdk.platform()
    .send({
        method: 'PUT',
        url: '/account/~/extension/~',
        query: {...},
        headers: {...},
        body: {...}
    })
    .then(function(apiResponse){
    
        alert(apiResponse.json().name);
        
    })
    .catch(function(e){
    
        alert(e.message);
        
        // please note that ajax property may not be accessible if error occurred before AJAX send
        if (e.apiResponse && e.apiResponse()) {
        
            var request = e.apiResponse().request();
            
            alert('Ajax error ' + e.message + ' for URL' + request.url + ' ' + e.apiResponse().error());
            
        }
        
    });

// Shorthand methods

rcsdk.platform().get('/account/~/extension/~', {...query}).then(...);
rcsdk.platform().post('/account/~/extension/~', {...body}, {...query}).then(...);
rcsdk.platform().put('/account/~/extension/~', {...body}, {...query}).then(...);
rcsdk.platform().delete('/account/~/extension/~', {...query}).then(function(...);
```

If your `Promise` library supports global error handler it might be useful to log Requests and Responses there.

# Server-side Subscriptions

Subscriptions are a convenient way to receive updates on server-side events, such as new messages or presence changes.

Subscriptions are created by calling the `getSubscription` method of the RingCentral instance created earlier on.

```js
var subscription = rcsdk.createSubscription();

subscription.on(subscription.events.notification, function(msg) {
    console.log(msg, msg.body);
});

subscription
    .setEventFilters(['/account/~/extension/~/presence']) // a list of server-side events
    .register()
    .then(...);
```

## Removing Subscriptions from server

Once a subscription has been created, the SDK takes care of renewing it automatically. To cancel a subscription, you can
call the subscription instance's `remove()` method:

```js
subscription.remove().then(...);
```

## Updating Subsctiptions

You can add more or replace event filters in the existing subscription at any time, by calling the subscription methods
and then calling the `register()` method to update it on the server:

```js
subscription.setEventFilters(['/account/~/extension/111/presence']).register();
subscription.addEventFilters(['/account/~/extension/222/presence']).register();
```

## Subscription reset

To revert subscription instance to it's prestine state you can use its `reset()` and `off()` methods, this will close
PUBNUB channel, remove all timers, subscription data and all bindings:

```js
subscription.reset().off();
```

## Subscriptions lifecycle

The number of active subscriptions is limited per account (about 20). This means that the application should dispose
unused subscriptions in the following situations:

- Application should `reset()` subscriptions (on the server they are dead already):
    - the `Platform` instance emits `logoutSuccess` or `accessViolation` events so the app should `reset()` all subscriptions
- Application should `remove()` subscriptions or remove no longer needed event filters from them:
    - the user navigates away from the page or particular view
    - a subscription becomes unused by the application, based upon the application's business logic

One of very useful techniques to limit the number of active subscriptions is to store subscription data in cache and
share this data across Subscription instances in multiple tabs:

```js
var cacheKey = 'some-custom-key';
var subscription = rcsdk.createSubscription();
var cachedSubscriptionData = rcsdk.cache().getItem(cacheKey);

if (cachedSubscriptionData) {
    try { // if subscription is already expired an error will be thrown so we need to capture it
        subscription.setSubscription(cachedSubscriptionData); // use the cache
    } catch (e) {
        console.error('Cannot set subscription data', e);
    }
} else {
    subscription.setEventFilters(['/account/~/extension/~/presence']); // explicitly set required events
}

subscription.on([subscription.events.subscribeSuccess, subscription.events.renewSuccess], function() {
    rcsdk.cache().setItem(cacheKey, subscription.subscription());
});

subscription.register();
```

With this technique subscription remove request on window/tab closing is no longer needed.
 
In any case if application logic dictates that subscription is not used anymore by any of it's instances, subscription
can be removed from the server to make sure application stays within limits.

## Stale Subscriptions

There is a known bug when user awakes the computer: subscription tries to renew itself but fails because the
expiration time has passed (JS was halted while computer was sleeping).

Recommendation is to listen to `subscription.events.renewError` event and when it occurs reset and re-subscribe:

```js
subscription.on(subscription.events.renewError, function() {
    subscription
        .reset()
        .setEventFilters('...')
        .register();
});
```

This has to be done in all tabs, application must handle potential race conditions.

## Multiple event filters in one Subscription

The best practice is to have only one subscription object with multiple event filters of different types (messages,
presence, etc.) instead of having separate subscription for each individual event filter.

In the notification event handler application may have a bunch of if's that will execute appropriate action based on
`event` property of the incoming message:

```js
subscription.on(subscription.events.notification, function(msg) {
    if (msg.event.indexOf('/presence') > -1) { ... }
    else if (msg.event.indexOf('/message-store') > -1) { ... }
    else { ... }
});
```

## Shorthand

The above mentioned things are put together into `CachedSubscription` class and its `restore(cacheKey)` method:

```js
var subscription = rcsdk.createCachedSubscription('cache-key').restore(['/account/~/extension/~/presence']);
                        
// use it as usual
subscription.register();
```

`CachedSubscription` class has 4 extra events which you can use for more granular control:

- `queuedRenewSuccess`
- `queuedRenewError`
- `queuedResubscribeSuccess`
- `queuedResubscribeError`

***

# Making telephony calls

In RingCentral terminology making telephony calls is named as RingOut.

This example demonstrates a way to create a flexible RingOut tracking procedure. This is the most complex example with
maximum fine-tuning - it could be simplified to suit the business requirements.

The sequence of RingOut is as follows:

1. Perform a POST with the RingOut data
2. Poll the RingOut status (GET requests) every second or so

Please refer to the following example:

```js
var platform = rcsdk.platform(),
    timeout = null, // reference to timeout object
    ringout = {}; // this is the status object (lowercase)

/**
 * @param {Error} e
 */
function handleError(e) {

    console.error(e);
    alert(e.message);

}

function create(unsavedRingout) {

    platform
        .post('/account/~/extension/~/ringout', unsavedRingout)
        .then(function(response) {
    
            ringout = response.json();
            console.info('First status:', ringout.status.callStatus);
            update();
            
        })
        .catch(handleError);

}

/**
 * @param {function(number?)} next - callback that will be used to continue polling
 * @param {number} delay - last used delay
 */
function update() {

    clearTimeout(timeout);

    setTimeout(function() {
    
        if (ringout.status && ringout.status.callStatus !== 'InProgress') return;
    
        platform
            .get(ringout.uri)
            .then(function(response) {
        
                ringout = response.json();
                console.info('Current status:', ringout.status.callStatus);
                update();
        
            })
            .catch(handleError);
            
    }, 500);

}

/**
 * To stop polling, call this at any time
 */
function hangUp() {

    clearTimeout(timeout);

    if (ringout.status && ringout.status.callStatus !== 'InProgress') {

        platform
            .delete(ringout.uri)
            .catch(handleError);

    }
    
    // Clean
    ringout = {
        from: {phoneNumber: ''},
        to: {phoneNumber: ''},
        callerId: {phoneNumber: ''}, // optional,
        playPrompt: true // optional
    };

}

/**
 * Start the ringout procedure (may be called multiple times with different settings)
 */
create({
    from: {phoneNumber: '16501111111'},
    to: {phoneNumber: '18882222222'},
    callerId: {phoneNumber: '18882222222'}, // optional,
    playPrompt: true // optional
});
```

***

# Call management using JavaScript

If you are integrating with a CRM or ERP system, use of the JavaScript SDK is highly recommended. Following is an
example of a call management integration that includes monitoring of incoming calls and performing of RingOuts. 

A call management integration usually consists of the following tasks:

1. Track the telephony status
2. View the list of active calls
3. View the recent calls

## Track the telephony status

First, you need to load the initial Presence status (you can use Underscore or Lodash to simplify things):

```js
var accountPresence = {};

rcsdk.platform()
    .get('/account/~/extension/~/presence?detailedTelephonyState=true').then(function(response) {
        _.extend(accountPresence, response.json());
    })
    .catch(function(e) {
        alert('Load Presence Error: ' + e.message);
    });
```

In the meantime, you can also set up Subscriptions (you can use Underscore or Lodash to simplify things):

```js
var subscription = rcsdk.createSubscription().addEvents(['/account/~/extension/~/presence?detailedTelephonyState=true']);

subscription.on(subscription.events.notification, function(msg) {
    _.extend(accountPresence, msg);
});

subscription.register().then(function(response) {
    alert('Success: Subscription is listening');
}).catch(function(e) {
    alert('Subscription Error: ' + e.message);
});

return subscription;
```

## View the list of active calls

```js
rcsdk.platform()
    .get('/account/~/extension/~/active-calls', {query: {page: 1, perPage: 10}})
    .then(function(response) {
        activeCalls = response.json().records;
    })
    .catch(function(e) {
        alert('Active Calls Error: ' + e.message);
    });
```

## View the list of recent calls

```js
rcsdk.platform()
    .get('/account/~/extension/~/call-log', {query: {page: 1, perPage: 10}})
    .then(function(response) {
        calls = response.json().records;
    })
    .catch(function(e) {
        alert('Recent Calls Error: ' + e.message);
    });
```
    
By default, the load request returns calls that were made during the last week. To alter the time frame, provide custom
`query.dateTo` and `query.dateFrom` properties.

# SMS

In order to send an SMS using the API, simply make a POST request to `/account/~/extension/~/sms`:

```js
rcsdk.platform()
    .post('/account/~/extension/~/sms', {
        from: {phoneNumber:'+12223334444'}, // Your sms-enabled phone number
        to: [
            {phoneNumber:'+15556667777'} // Second party's phone number
        ],
        text: 'Message content'
    })
    .then(function(response) {
        alert('Success: ' + response.json().id);
    })
    .catch(function(e) {
        alert('Error: ' + e.message);
    });
```

# Fax

Fax endpoint understands `multipart/form-data` requests. First part must always be JSON-encoded information about the
fax. Other parts should have `filename` defined in order to be correctly presented in Service Web.

## Browser

Modern browsers have `FormData` class which could be used for sending faxes.

```js
var body = {
        to: {phoneNumber: '123'}, // see all available options on Developer Portal 
        faxResolution: 'High'
    }, 
    formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new File([JSON.stringify(body)]), 'request.json', {type: 'application/json'});

// Find the input[type=file] field on the page
var fileField = document.getElementById('input-type-file-field');

// Iterate through all currently selected files
for (var i = 0, file; file = fileField.files[i]; ++i) {
    formData.append('attachment', file); // you can also use file.name instead of 'attachment'
}

// To send a plain text
formData.append('attachment', new File(['some plain text']), 'text.txt', {type: 'application/octet-stream'});

// Send the fax
rcsdk.platform().post('/account/~/extension/~/fax', formData);
```

Further reading:

- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [File](https://developer.mozilla.org/en-US/docs/Web/API/File)

## NodeJS

SDK is capable of sending `FormData` objects created by [form-data](https://github.com/form-data/form-data) module.

First, you will need to install it:

```sh
npm install form-data
```

Then you can build your fax, but keep in mind that FormData API in NodeJS is slightly different from the browser:

```js
var FormData = require('form-data'),
    body = {
        to: {phoneNumber: '123'}, // see all available options on Developer Portal 
        faxResolution: 'High'
    }, 
    formData = new FormData();

// This is the mandatory part, the name and type should always be as follows
formData.append('json', new Buffer(JSON.stringify(body)), {filename: 'request.json', contentType: 'application/json'});

// To send a plain text
formData.append('attachment', new Buffer('some plain text'), 'text.txt', {type: 'application/octet-stream'});

// To send a file from file system
formData.append('attachment', require('fs').createReadStream('/foo/bar.jpg'));

// Send the fax
rcsdk.platform().post('/account/~/extension/~/fax', formData);
```

Further reading:

- [form-data](https://github.com/form-data/form-data#usage)

***

# Page visibility

You can use any of the libraties that work with the [Page Visibility API](http://www.w3.org/TR/page-visibility/),
such as [visibility.js](https://github.com/ai/visibilityjs).

This allows tracking the visibility of the page/tab/window/frame so that the application can react accordingly.
Following are some actions that the application may wish to take whenever it becomes visible:
    
- Check authentication
- Reload/resync time-sensitinve information from the server
- Send heartbeats to the server

Another usage is to reduce the number of Call Log or Messages reloads when the application is not visible. The SDK does
not require that any such optimizations be implemented in the application, but it is considered good practice.

***

# Tracking network Requests And Responses

You can set up tracking for all network requests (for instance, to log them somewhere) by obtaining a `Client` object
and registering observers on its various events:

```js
var client = rcsdk.platform().client();
client.on(client.events.beforeRequest, function(apiResponse) {}); // apiResponse does not have response at this point
client.on(client.events.requestSuccess, function(apiResponse) {});
client.on(client.events.requestError, function(apiError) {});
```
