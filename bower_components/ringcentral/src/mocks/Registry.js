import Mock from './Mock';

export default class Registry {

    constructor() {
        this._mocks = [];
    }

    add(mock) {
        this._mocks.push(mock);
        return this;
    }

    clear() {
        this._mocks = [];
        return this;
    }

    find(request) {

        //console.log('Registry is looking for', request);

        var mock = this._mocks.shift();

        if (!mock) throw new Error('No mock in registry for request ' + request.method + ' ' + request.url);

        if (!mock.test(request)) throw new Error('Wrong request ' + request.method + ' ' + request.url +
                                                 ' for expected mock ' + mock.method() + ' ' + mock.path());

        return mock;

    }

    apiCall(method, path, response, status, statusText) {

        this.add(new Mock(method, path, response, status, statusText));

        return this;

    }

    authentication() {

        this.apiCall('POST', '/restapi/oauth/token', {
            'access_token': 'ACCESS_TOKEN',
            'token_type': 'bearer',
            'expires_in': 3600,
            'refresh_token': 'REFRESH_TOKEN',
            'refresh_token_expires_in': 60480,
            'scope': 'SMS RCM Foo Boo',
            'expireTime': new Date().getTime() + 3600000
        });

        return this;

    }

    logout() {

        this.apiCall('POST', '/restapi/oauth/revoke', {});

        return this;

    }

    presenceLoad(id) {

        this.apiCall('GET', '/restapi/v1.0/account/~/extension/' + id + '/presence', {
            "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id + "/presence",
            "extension": {
                "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id,
                "id": id,
                "extensionNumber": "101"
            },
            "activeCalls": [],
            "presenceStatus": "Available",
            "telephonyStatus": "Ringing",
            "userStatus": "Available",
            "dndStatus": "TakeAllCalls",
            "extensionId": id
        });

        return this;

    }

    subscribeGeneric(expiresIn) {

        expiresIn = expiresIn || 15 * 60 * 60;

        var date = new Date();

        this.apiCall('POST', '/restapi/v1.0/subscription', {
            'eventFilters': [
                '/restapi/v1.0/account/~/extension/~/presence'
            ],
            'expirationTime': new Date(date.getTime() + (expiresIn * 1000)).toISOString(),
            'expiresIn': expiresIn,
            'deliveryMode': {
                'transportType': 'PubNub',
                'encryption': false,
                'address': '123_foo',
                'subscriberKey': 'sub-c-foo',
                'secretKey': 'sec-c-bar'
            },
            'id': 'foo-bar-baz',
            'creationTime': date.toISOString(),
            'status': 'Active',
            'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
        });

        return this;

    }

    subscribeOnPresence(id, detailed) {

        id = id || '1';

        var date = new Date();

        this.apiCall('POST', '/restapi/v1.0/subscription', {
            'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
            'expirationTime': new Date(date.getTime() + (15 * 60 * 60 * 1000)).toISOString(),
            'deliveryMode': {
                'transportType': 'PubNub',
                'encryption': true,
                'address': '123_foo',
                'subscriberKey': 'sub-c-foo',
                'secretKey': 'sec-c-bar',
                'encryptionAlgorithm': 'AES',
                'encryptionKey': 'VQwb6EVNcQPBhE/JgFZ2zw=='
            },
            'creationTime': date.toISOString(),
            'id': 'foo-bar-baz',
            'status': 'Active',
            'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
        });

        return this;

    }

    tokenRefresh(failure) {

        if (!failure) {

            this.apiCall('POST', '/restapi/oauth/token', {
                'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                'token_type': 'bearer',
                'expires_in': 3600,
                'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                'refresh_token_expires_in': 60480,
                'scope': 'SMS RCM Foo Boo'
            });

        } else {

            this.apiCall('POST', '/restapi/oauth/token', {
                'message': 'Wrong token',
                'error_description': 'Wrong token',
                'description': 'Wrong token'
            }, 400);

        }

        return this;

    }

}