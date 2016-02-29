(function() {

}());
var DialPad = function(options) {
    // TODO: choose a template engine
    if (!options.target) {
        throw new Error('need specifiy a target for dial pad');
    }
    this.sdk = options.sdk;
    this.webPhone = options.webPhone || new RingCentral.WebPhone({ audioHelper: true });

    this.targetDOM = document.querySelector(options.target);
    this.generateDOM();

    this.afterCallout = options.afterCallout || function() {};
};

// TODO: replace this method with template engine
DialPad.prototype.generateDOM = function(state) {
    // hard code the dom composition
    this.element = {
        panelTitle: dom('div', {
            className: 'rc-panel-title',
            text: 'Dial pad'
        }),
        panel: dom('div', {
            className: 'rc-panel'
        }, null, {
            number: dom('input', {
                className: 'rc-input',
                placeholder: 'To: Number'
            }),
            wrapper: dom('div', {
                className: 'rc-dial-wrapper'
            }, null, {
                dialButton1: dom('button', {
                    className: 'rc-dial-button',
                    text: '1'
                }, { click: this.dialing.bind(this, '1') }),
                dialButton2: dom('button', {
                    className: 'rc-dial-button',
                    text: '2'
                }, { click: this.dialing.bind(this, '2') }),
                dialButton3: dom('button', {
                    className: 'rc-dial-button',
                    text: '3'
                }, { click: this.dialing.bind(this, '3') }),
                dialButton4: dom('button', {
                    className: 'rc-dial-button',
                    text: '4'
                }, { click: this.dialing.bind(this, '4') }),
                dialButton5: dom('button', {
                    className: 'rc-dial-button',
                    text: '5'
                }, { click: this.dialing.bind(this, '5') }),
                dialButton6: dom('button', {
                    className: 'rc-dial-button',
                    text: '6'
                }, { click: this.dialing.bind(this, '6') }),
                dialButton7: dom('button', {
                    className: 'rc-dial-button',
                    text: '7'
                }, { click: this.dialing.bind(this, '7') }),
                dialButton8: dom('button', {
                    className: 'rc-dial-button',
                    text: '8'
                }, { click: this.dialing.bind(this, '8') }),
                dialButton9: dom('button', {
                    className: 'rc-dial-button',
                    text: '9'
                }, { click: this.dialing.bind(this, '9') }),
                dialButton0: dom('button', {
                    className: 'rc-dial-button',
                    text: '0'
                }, { click: this.dialing.bind(this, '0') }),
            }),
            calloutButton: dom('button', {
                className: 'rc-button',
                text: 'Call'
            }, { click: this.callout.bind(this) }),
            errorMessage: dom('div', {
                className: 'rc-error-message'
            })
        })
    };

    Object.keys(this.element).forEach(index => {
        this.targetDOM.appendChild(this.element[index]);
    });

    function dom(type, attributes, listeners, children) {
        var element = document.createElement(type);
        attributes && Object.keys(attributes).forEach(index => {
            var attr = attributes[index];
            if (index === 'className') {
                element.className = attr;
            } else if (index === 'text') {
                element.textContent = attr;
            } else { // attribute
                element.setAttribute(index, attr);
            }
        })
        listeners && Object.keys(listeners).forEach(index => {
            var listener = listeners[index];
            element.addEventListener(index, listener);
        })
        children && Object.keys(children).forEach(index => {
            var child = children[index];
            element.appendChild(child);
            element[index] = child;
        })
        return element;
    }
};
DialPad.prototype.dialing = function(number) {
    this.element.panel.number.value += number;
};
DialPad.prototype.callout = function() {
    if (!this.sdk) {
        var message = 'you need to login first(via auth panel widget or js sdk)';
        console.error(message);
        this.element.panel.errorMessage.textContent = message;
        return;
    }
    if (!this.element.panel.number.value) {
        var message = 'fill in the number'
        this.element.panel.errorMessage.textContent = message;
        return;
    }
    var toNumber = this.element.panel.number.value;
    var fromNumber = localStorage.getItem('username');

    // TODO: validate toNumber and fromNumber
    this.interval = this.loading(this.element.panel.calloutButton, 'Call');
    this.sdk.platform()
        .get('/restapi/v1.0/account/~/extension/~')
        .then(res => {
            console.log(res);
            var info = res.json();
            if (info && info.regionalSettings && info.regionalSettings.homeCountry) {
                return info.regionalSettings.homeCountry.id;
            }
            return null;
        })
        .then(countryId => {
            console.log('SIP call to', toNumber, 'from', fromNumber + '\n');
            this.webPhone.call(toNumber, fromNumber, countryId);
            if (this.interval) {
                this.interval.cancel('Call');
                this.interval = null;
            }
            this.afterCallout();
        })
        .catch(e => {
            console.error(e);
            this.element.panel.errorMessage.textContent = e.message;
            if (this.interval) {
                this.interval.cancel('Call');
                this.interval = null;
            }
        });
};
DialPad.prototype.loading = function(target, text) {
    var dotCount = 1;
    var interval = window.setInterval(() => {
        var dot = '';
        var dotCountTmp = dotCount;
        while (dotCount--)
            dot += '.';
        target.textContent = text + dot;
        dotCount = (dotCountTmp + 1) % 4;
    }, 500)
    return {
        cancel: function(text) {
            if (interval) {
                window.clearInterval(interval);
                interval = null;
                if (typeof text !== 'undefined')
                    target.textContent = text;
            }
        }
    }
};
