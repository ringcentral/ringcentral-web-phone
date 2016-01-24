# Migration Guide 1.x to 2.0

Key differences:

- Helpers were moved to separate repository: [RingCentral JS Helpers](https://github.com/ringcentral/ringcentral-js-helpers).
- Root JS name has changed from `RCSDK` to `RingCentral.SDK`
- New naming convention: `getSomething()` methods are now simply `something()`
- `Auth` class inside `Platform`
- `AjaxObserver` functionality been moved to `Client`
- New `ApiResponse` interface that wraps network Requests/Responses:
    - `apiResponse.json()` instead of `ajax.json`
    - `apiResponse.multipart()` instead of `ajax.responses`
    - `apiResponse.request()` and `ajax.response()` to access to DOM Request and DOM Response accordingly
    - `apiResponse.request().headers` and `ajax.response().headers` should be used to access headers
- `Subscription` interface changes