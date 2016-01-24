export default class Auth {

    static refreshHandicapMs = 60 * 1000; // 1 minute
    static forcedTokenType = 'forced';

    constructor(cache, cacheId) {

        /** @type {Cache} */
        this._cache = cache;
        this._cacheId = cacheId;

    }

    accessToken() {
        return this.data().access_token;
    }

    refreshToken() {
        return this.data().refresh_token;
    }

    tokenType() {
        return this.data().token_type;
    }

    /**
     * @return {{token_type: string, access_token: string, expires_in: number, refresh_token: string, refresh_token_expires_in: number}}
     */
    data() {

        return this._cache.getItem(this._cacheId) || {
                token_type: '',
                access_token: '',
                expires_in: 0,
                refresh_token: '',
                refresh_token_expires_in: 0
            };

    }

    /**
     * @param {object} newData
     * @return {Auth}
     */
    setData(newData) {

        newData = newData || {};

        var data = this.data();

        Object.keys(newData).forEach((key) => {
            data[key] = newData[key];
        });

        data.expire_time = Date.now() + (data.expires_in * 1000);
        data.refresh_token_expire_time = Date.now() + (data.refresh_token_expires_in * 1000);

        this._cache.setItem(this._cacheId, data);

        return this;

    }

    /**
     * Check if there is a valid (not expired) access token
     * @return {boolean}
     */
    accessTokenValid() {

        var authData = this.data();
        return (authData.token_type === Auth.forcedTokenType || (authData.expire_time - Auth.refreshHandicapMs > Date.now()));

    }

    /**
     * Check if there is a valid (not expired) access token
     * @return {boolean}
     */
    refreshTokenValid() {

        return (this.data().refresh_token_expire_time > Date.now());

    }

    /**
     * @return {Auth}
     */
    cancelAccessToken() {

        return this.setData({
            access_token: '',
            expires_in: 0
        });

    }

    /**
     * This method sets a special authentication mode used in Service Web
     * @return {Auth}
     */
    forceAuthentication() {

        this.setData({
            token_type: Auth.forcedTokenType,
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        });

        return this;

    }

    /**
     * @param remember
     * @return {Auth}
     */
    setRemember(remember) {

        return this.setData({remember: remember});

    }

    /**
     * @return {boolean}
     */
    remember() {

        return !!this.data().remember;

    }

}

//export interface IAuthData {
//    remember?:boolean;
//    token_type?:string;
//    access_token?:string;
//    expires_in?:number; // actually it's string
//    expire_time?:number;
//    refresh_token?:string;
//    refresh_token_expires_in?:number; // actually it's string
//    refresh_token_expire_time?:number;
//    scope?:string;
//}
