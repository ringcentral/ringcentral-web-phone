var BLOCKED_NUMBERS_US_CA = ['211', '311', '411', '511', '611', '711', '811', '911', '933', '\\+?1?6505551212', '\\+?1?3033812041'];

var BLOCKED_NUMBERS_UK = ['101', '118***', '100', '111', '999', '112', '18002', '18000', '123', '116111', '116123', '155', '116***', '(\\+?440?|0)9*********', '(\\+?440?|0)?8001111', '(\\+?440?|0)?8454647'];

var settings = require('./settingsService');

var BLOCKED_NUMBERS_US_CA_REGEX = [];
BLOCKED_NUMBERS_US_CA.forEach(function(el) {
    BLOCKED_NUMBERS_US_CA_REGEX.push(new RegExp('^' + el.replace(/\*/g, '\\d') + '$'));
});

var BLOCKED_NUMBERS_UK_REGEX = [];
BLOCKED_NUMBERS_UK.forEach(function(el) {
    BLOCKED_NUMBERS_UK_REGEX.push(new RegExp('^' + el.replace(/\*/g, '\\d') + '$'));
});

module.exports = {

    DEFAULT_CALL_STATUS: 'NoCall',

    delay: function delay(ms) {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, ms);
        });
    },

    defer: function defer() {
        var deferred = {};
        deferred.promise = new Promise(function(resolve, reject) {
            deferred.resolve = resolve;
            deferred.reject = reject;
        });
        return deferred;
    },

    extend: function extend(dst, src) {
        Object.keys(src).forEach(function(k) {
            dst[k] = src[k];
        });
        return dst;
    },

    copy: function(src){
        return this.extend({}, src);
    },

    uuid: function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    isExtensionNumber: function(number) {
        return ('' + number).length <= 5 ? true : false;
    },
    /**
     * [toDigitsOnly: remove alphabets and special character from number]
     * @param  {[String]} number [string contain contact number]
     * @return {[]} [number]
     */
    toDigitsOnly: function(number, leavePlus) {
        if (leavePlus) {
            number = (number + '').replace(/[^\d+]/g, '');
        } else {
            number = (number + '').replace(/[^\d]/g, '');
        }

        return number;
    },
    /**
     * [filterNumber  : To remove '+' sign and append international prefix if not there to the number]
     * @param  {[String]} number [string contain contact number]
     * @return {[Integer]}        []
     */
    filterNumber: function(number, brand) {
        number = number || "";
        brand = brand || settings.brand;

        number = this.toDigitsOnly(number);

        if (brand === 'RCUS'
            || brand === 'RCCA'
            || brand === 'ATTOAH'
            || brand === 'TELUS'
            || brand === 'TMOB') {

            if (number.substring(0, 1) !== "1" && number.length === 10) {
                number = "1" + number;
            }
        } else if (brand === 'RCUK' || brand === 'BT') {
            if (number.substring(0, 1) === '0' && (number.length === 10 || number.length === 11)) {
                number = '44' + number.substring(1);
            }
            else {
                if (number.substring(0, 2) !== "44" && number.length < 11 && number.length > 5) {
                    number = "44" + number;
                }
            }
        }
        return number;
    },

    lettersToNumbers: function(number) {
        number = ('' + number).toLowerCase();
        var res = '';
        for (var i = 0; i < number.length; i++) {
            switch (number[i]) {
                case 'a':
                case 'b':
                case 'c':
                    res += '2';
                    break;
                case 'd':
                case 'e':
                case 'f':
                    res += '3';
                    break;
                case 'g':
                case 'h':
                case 'i':
                    res += '4';
                    break;
                case 'j':
                case 'k':
                case 'l':
                    res += '5';
                    break;
                case 'm':
                case 'n':
                case 'o':
                    res += '6';
                    break;
                case 'p':
                case 'q':
                case 'r':
                case 's':
                    res += '7';
                    break;
                case 't':
                case 'u':
                case 'v':
                    res += '8';
                    break;
                case 'w':
                case 'x':
                case 'y':
                case 'z':
                    res += '9';
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                    res += number[i];
                    break;
            }
        }
        return res;
    },
    normalizeNumberForParser: function(number) {
        if (!number)return '';

        number = number.toString();

        var starIndex = number.indexOf('*');

        //if number starts with star, we return it as is
        if (starIndex === 0) {
            return number.replace(/[^\d\*\#]/g, '');
        }

        return number.replace(/[^\d\#\*]/g, '');
    },
    normalizeNumber: function(number) {
        if (!number)return '';

        number = '' + number;
        var ext = '';

        var starIndex = number.indexOf('*');


        //if number starts with star, we return it as is
        if (starIndex === 0) {
            return number.replace(/[^\d\*\#]/g, '');
        }

        if (starIndex !== -1) {
            var arr = number.split('*');
            number = arr[0];
            ext = arr[1];
        }

        number = this.toDigitsOnly(number);
        ext = this.toDigitsOnly(ext);

        if (number.length == 0)return '';
        var brand = settings.brand;

        if (brand === 'RCUS'
            || brand === 'RCCA'
            || brand === 'ATTOAH'
            || brand === 'TELUS'
            || brand === 'TMOB') {

            if (number.substring(0, 1) !== "1" && number.length === 10) {
                number = "+1" + number;
            }

            // add plus if the number is not too short
            if (!number.match(/^\+/, number) && number.length > 9) {
                number = "+" + number;
            }
        } else if (brand === 'RCUK' || brand === 'BT') {

            if (number.substring(0, 2) !== "44"
                && ((number.length === 10 && number.substring(0, 1) !== '0') //10 digits, excluded 0123456789
                    || number.length === 9)
            /*|| number.length === 7 && (number.substring(0, 3) === '800' || number.substring(0, 3) === '845')*/) {
                number = "+44" + number;
            }

            // add plus if the number is not too short
            if (!number.match(/^(\+|0)/, number) && number.length > 9) {
                number = "+" + number;
            }
        }

        return number + (ext ? ('*' + ext) : '');
    },
    formatDuration: function(duration) {
        if (isNaN(duration)) {
            return "";
        }

        if (typeof duration !== "number") {
            duration = 0;
        }

        duration = Math.round(duration);

        var seconds = duration % 60;
        var minutes = Math.floor(duration / 60) % 60;
        var hours = Math.floor(duration / 3600) % 24;

        function format(value) {
            return (value < 10) ? '0' + value : value;
        }

        var result = format(minutes) + ':' + format(seconds);

        if (hours > 0) {
            result = format(hours) + ':' + result;
        }

        return result;
    },
    ignoreSdkError: function(e) {
        // TODO figure out with Kirill a better way to separate server errors and this particular error
        return e.message === "No access token in cache";
    },

    convertNumber: function(number, compareLength) {
        if (!number)return '';
        var num = parseInt(compareLength);
        compareLength = isNaN(num) ? 10 : num;
        return number.replace(/[^\d\*#]/g, '').substr(-compareLength);
    },

    isBlockedNumber: function(number, country) {
        var arr = [];
        switch (country.toString().toLowerCase()) {
            case 'us':
            case 'ca':
                arr = BLOCKED_NUMBERS_US_CA_REGEX;
                break;
            case 'gb':
            case 'uk':
                arr = BLOCKED_NUMBERS_UK_REGEX;
                break;
        }

        for (var i = 0; i < arr.length; i++) {
            var regex = arr[i];
            if (regex.test(number)) {
                return true;
            }
        }

        return false;
    },

    pushIntoAnotherArray: function(fromArr, toArr, limit) {
        if (!angular.isArray(toArr) || !angular.isArray(fromArr)) return angular.copy(fromArr);
        if (!limit) limit = fromArr.length;

        var from = toArr.length, to = toArr.length + limit;
        for (var i = from; i < to; i++) {
            if (fromArr.length > i) {
                toArr.push(fromArr[i]);
            }
            else {
                break;
            }
        }

        return toArr;
    }
};