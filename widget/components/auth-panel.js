var AuthPanel = function(options) {
    if (!options.target) {
        throw new Error('need specifiy a target for auth panel');
    }
    this.sdk = options.sdk;
    this.webPhone = options.webPhone ||
        new RingCentral.WebPhone({
            audioHelper: {
                incoming: '../demo/audio/incoming.ogg',
                outgoing: '../demo/audio/outgoing.ogg'
            }
        });

    this.afterLogin = options.afterLogin || function() {};

    this.targetDOM = document.querySelector(options.target);
    this.generateDOM();
};

// TODO: replace this method with template engine
AuthPanel.prototype.generateDOM = function() {
    if (!this.targetDOM) {
        throw new Error('need to have a target, then mount the DOM');
    }
    this.element = {
        panelTitle: dom('div', {
            className: 'rc-panel-title',
            text: 'Auth panel'
        }),
        panel: dom('div', {
            className: 'rc-panel rc-auth-panel'
        }, null, {

            server: dom('input', {
                className: 'rc-input',
                placeholder: 'https://platform.ringcentral.com',
                value: localStorage.getItem('server') || ''
            }),
            key: dom('input', {
                className: 'rc-input',
                placeholder: 'key',
                value: localStorage.getItem('key') || ''
            }),
            secret: dom('input', {
                className: 'rc-input',
                placeholder: 'secret',
                value: localStorage.getItem('secret') || ''
            }),
            username: dom('input', {
                className: 'rc-input',
                placeholder: 'username',
                value: localStorage.getItem('username') || ''
            }),
            extension: dom('input', {
                className: 'rc-input',
                placeholder: 'extension (optional)',
                value: localStorage.getItem('extension') || ''
            }),
            password: dom('input', {
                type: 'password',
                className: 'rc-input',
                placeholder: 'password',
                value: localStorage.getItem('password') || ''
            }),
            loginButton: dom('button', {
                className: 'rc-button',
                text: 'login',
            }, {
                click: this.login.bind(this)
            }),
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
AuthPanel.prototype.login = function() {
    localStorage.setItem('server', this.element.panel.server.value);
    localStorage.setItem('key', this.element.panel.key.value);
    localStorage.setItem('secret', this.element.panel.secret.value);
    localStorage.setItem('username', this.element.panel.username.value);
    localStorage.setItem('extension', this.element.panel.extension.value);
    localStorage.setItem('password', this.element.panel.password.value);
    if (!this.sdk) {
        this.sdk = new RingCentral.SDK({
            appKey: this.element.panel.key.value,
            appSecret: this.element.panel.secret.value,
            server: this.element.panel.server.value || RingCentral.SDK.server.production
        });
    }
    this.element.panel.loginButton.disabled = true;
    this.element.panel.errorMessage.textContent = '';
    this.interval = this.loading(this.element.panel.loginButton, 'login');
    return this.sdk.platform()
        .login({
            username: this.element.panel.username.value,
            extension: this.element.panel.extension.value,
            password: this.element.panel.password.value
        })
        .then(() => this.registerSIP())
        .then(() => {
            this.element.panel.loginButton.disabled = false;
            // stop loading animation
            if (this.interval) {
                this.interval.cancel();
                this.interval = null;
            }
            this.afterLogin();
        })
        .catch(error => {
            this.element.panel.errorMessage.textContent = error;
            this.element.panel.loginButton.disabled = false;
            // stop loading animation
            if (this.interval) {
                this.interval.cancel();
                this.interval = null;
            }
            console.error('login error:' + error)
        });
};
AuthPanel.prototype.registerSIP = function(checkFlags, transport) {
    console.log('sip registering');
    return this.sdk.platform()
        .post('/client-info/sip-provision', {
            sipInfo: [{
                transport: 'WSS'
            }]
        })
        .then(res => {
            var data = res.json();
            console.log("Sip Provisioning Data from RC API: " + JSON.stringify(data));
            console.log(data.sipFlags.outboundCallsEnabled);
            return this.webPhone.register(data, checkFlags)
                .then(function() {
                    console.log('Registered');
                })
                .catch(function(e) {
                    return Promise.reject(err);
                });

        }).catch(e => {
            console.error(e);
            return Promise.reject(e);
        });
};
AuthPanel.prototype.close = function() {
    this.targetDOM.style['display'] = 'none';
};
AuthPanel.prototype.loading = function(target, text) {
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
