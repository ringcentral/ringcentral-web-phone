# Migration Guide 0.13 to 0.14

The key differences between versions:
+ Promises/A+
    + Native ECMAScript6 where available (Chrome, FireFox, Safari)
    + RSVP polyfill for older browsers
+ RCSDK is now a constructor
    + Instance has a context, so it is possible to have multiple simultaneous connections to API
+ All other objects are obtained through RCSDK instance's getters instead of static methods of classes

## Initialization

Before:

```js
var platform = RCSDK.core.Platform.getInstance();
platform.apiKey = '...';
```

After:

```js
var rcsdk = new RCSDK(), // save this object, everything else is provided by it
    platform = rcsdk.getPlatform();
    
platform.apiKey = '...';
```

## Promises and API Calls

Basically the Promises concept is about replacing the callbacks:

```js
something({foo: 'bar', success:function(){}, error: function(){})
```

Becomes:

```js
something({foo: 'bar'}).then(...).catch(...)
```

Before:

```js
platform.apiCall({
    url: '...',
    success: function(data){ ... }
    error: function(e){ ... }
});
```

After:

```js
platform.apiCall({url: '...'}).then(function(ajax){
    // do something with ajax.data
}).catch(function(e){ ... });
```

This also applies to any other place that formerly accepted `success` and `error` callbacks.

+ platform.isAuthorized|refresh|authorize|logout
+ subscription.register|subscribe|renew|remove
+ etc.

## AjaxObserver

Before:

```js
RCSDK.core.Ajax.observer.on(...)
```

After:

```js
rcsdk.getAjaxObserver().on(...);
```

## Call Monitoring Object is deprecated

Call Monitoring object is now replaced with a number of Helper objects, which gives developers more control over 
application logic while processing logic is still maintained by SDK.

Take a look on **Call Management Using JavaScript** section of **Usage Manual**, and big **AngularJS Demo** for
implementation examples.