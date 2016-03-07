var CallPanel = function(options) {
    if (!options.target) {
        new Error('need specifiy a target for call panel');
    }
    this.sdk = options.sdk;
    this.webPhone = options.webPhone || new RingCentral.WebPhone({ audioHelper: true });

    this.line = null;
    this.state = CallPanel.state.HIDDEN;
    this.targetDOM = document.querySelector(options.target);
    this.bindPhoneListener();
    this.generateDOM();
    this.triggerView();

    this.afterCallStart = options.afterCallStart || function() {};
    this.afterCallEnd = options.afterCallEnd || function() {};
};
CallPanel.state = {
    'HIDDEN': 0,
    'CALLIN': 1,
    'CALLOUT': 2,
    'ONLINE': 3
}

// TODO: replace this method with template engine
CallPanel.prototype.generateDOM = function() {
    this.element = {
        panelTitle: dom('div', {
            className: 'rc-panel-title',
            text: 'Call panel'
        }),
        panel: dom('div', {}, null, {
            callinPanel: dom('div', {
                className: 'rc-panel'
            }, null, {
                callinNumber: dom('div', {
                    className: 'rc-message'
                }),
                answerButton: dom('button', {
                    className: 'rc-button',
                    text: 'Answer'
                }, { click: this.answer.bind(this) }),
                ignoreButton: dom('button', {
                    className: 'rc-button',
                    text: 'Ignore'
                }, { click: this.ignore.bind(this) }),
            }),
            calloutPanel: dom('div', {
                className: 'rc-panel'
            }, null, {
                cancelButton: dom('button', {
                    className: 'rc-button',
                    text: 'Cancel'
                }, { click: this.cancel.bind(this) })
            }),
            onlinePanel: dom('div', {
                className: 'rc-panel'
            }, null, {
                callTime: dom('div', {
                    className: 'rc-message'
                }),
                hangupButton: dom('button', {
                    className: 'rc-button rc-button-important',
                    text: 'Hangup'
                }, { click: this.hangup.bind(this) }),
                recordButton: dom('button', {
                    className: 'rc-button',
                    text: 'Record'
                }, { click: this.record.bind(this) }),
                holdButton: dom('button', {
                    className: 'rc-button',
                    text: 'Hold'
                }, { click: this.hold.bind(this) }),
                muteButton: dom('button', {
                    className: 'rc-button',
                    text: 'Mute'
                }, { click: this.mute.bind(this) }),
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
CallPanel.prototype.bindPhoneListener = function() {
    this.webPhone.ua.on('sipIncomingCall', e => {
        console.log('call incoming');
        this.line = e;
        this.state = CallPanel.state.CALLIN;
        this.triggerView();
    });
    this.webPhone.ua.on('outgoingCall', e => {
        console.log('call outgoing');
        this.line = e;
        this.state = CallPanel.state.CALLOUT;
        this.triggerView();
    });
    this.webPhone.ua.on('callStarted', e => {
        console.log('call start');
        this.state = CallPanel.state.ONLINE;
        this.triggerView();
        this.afterCallStart();
    });
    this.webPhone.ua.on('callRejected', e => {
        console.log('reject');
        this.state = CallPanel.state.HIDDEN;
        this.triggerView();
        this.afterCallEnd();
    });
    this.webPhone.ua.on('callEnded', e => {
        console.log('end');
        this.state = CallPanel.state.HIDDEN;
        this.triggerView();
        this.afterCallEnd();
    });
    this.webPhone.ua.on('callFailed', e => {
        console.log('end');
        this.state = CallPanel.state.HIDDEN;
        this.triggerView();
        this.afterCallEnd();
    });
};
CallPanel.prototype.answer = function() {
    return this.webPhone
        .answer(this.line)
        .then(() => {
            this.state = CallPanel.state.ONLINE;
            this.triggerView();
        })
        .catch(function(e) { console.error(e) });
};
CallPanel.prototype.ignore = function() {
    this.state = CallPanel.state.HIDDEN;
    this.triggerView();
};
CallPanel.prototype.cancel = function() {
    if (!this.line)
        return;
    return this.line
        .cancel()
        .then(() => {
            this.state = CallPanel.state.HIDDEN;
            this.triggerView();
        })
        .catch(err => console.error(err));
};
CallPanel.prototype.hangup = function() {
    if (!this.line)
        return;

    return this.webPhone
        .hangup(this.line)
        .then(() => {
            this.state = CallPanel.state.HIDDEN;
            this.triggerView();
        })
        .catch(err => console.error(err));
};
CallPanel.prototype.record = function() {
    if (this.line.isOnRecord()) {
        return this.line.record(false)
            .then(() => this.element.panel.onlinePanel.recordButton.textContent = 'Record')
            .catch(err => {
                console.err(err);
            });
    } else {
        return this.line.record(true)
            .then(() => this.element.panel.onlinePanel.recordButton.textContent = 'Stop Record')
            .catch(err => {
                console.err(err);
            });
    }
};
CallPanel.prototype.stopRecord = function() {

};
CallPanel.prototype.hold = function() {
    if (this.line.isOnHold()) {
        return this.line.setHold(false)
            .then(() => {
                console.log(this.line.isOnHold());
                this.element.panel.onlinePanel.holdButton.textContent = 'Hold';
            });
    } else {
        return this.line.setHold(true)
            .then(() => {
                console.log(this.line.isOnHold());
                this.element.panel.onlinePanel.holdButton.textContent = 'Unhold';
            });
    }
};
CallPanel.prototype.mute = function() {
    if (this.line.isOnMute()) {
        return this.line.setMute(false, false)
            .then(() => {
                console.log(this.line.isOnMute());
                this.element.panel.onlinePanel.muteButton.textContent = 'Mute';
            });
    } else {
        return this.line.setMute(true, false)
            .then(() => {
                console.log(this.line.isOnMute());
                this.element.panel.onlinePanel.muteButton.textContent = 'Unmute';
            });
    }
};
CallPanel.prototype.answerIncomingCall = function() {
    return webPhone.answer(this.line)
        .then(() => {
            this.state = CallPanel.state.ONLINE;
            this.triggerView();
        })
        .catch(e => console.error(e));
};
CallPanel.prototype.triggerView = function() {
    this.element.panel.style.display = 'block';
    this.element.panelTitle.style.display = 'block';
    this.element.panel.callinPanel.style.display = 'none';
    this.element.panel.calloutPanel.style.display = 'none';
    this.element.panel.onlinePanel.style.display = 'none';
    if (this.callTimeInterval) {
        this.callTimeInterval.cancel();
        this.callTimeInterval = null;
    }
    if (this.state === CallPanel.state.CALLIN) {
        this.element.panel.callinPanel.callinNumber.textContent = this.line.contact.number;
        this.element.panel.callinPanel.style.display = 'block';
    } else if (this.state === CallPanel.state.CALLOUT) {
        this.element.panel.calloutPanel.style.display = 'block';
    } else if (this.state === CallPanel.state.ONLINE) {
        this.element.panel.onlinePanel.style.display = 'block';
        this.callTimeInterval = this.updateCallTime(this.line.timeCallStarted);
    } else if (this.state === CallPanel.state.HIDDEN) {
        this.element.panel.style.display = 'none';
        this.element.panelTitle.style.display = 'none';
    }
};
CallPanel.prototype.loading = function(target, text) {
    if (this.interval)
        return;
    var dotCount = 1;
    this.interval = window.setInterval(() => {
        var dot = '';
        var dotCountTmp = dotCount;
        while (dotCount--)
            dot += '.';
        console.log(this.element.loginButton);
        target.loginButton.textContent = text + dot;
        dotCount = (dotCountTmp + 1) % 4;
    }, 500)
};
CallPanel.prototype.stopLoading = function() {
    if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = null;
    }
};
CallPanel.prototype.updateCallTime = function(startTime) {
    // FIXME: it's not accurate
    if (!startTime)
        return;
    var currentTime = Date.now() - startTime;
    var callPanel = this;
    var callTimeInterval = window.setInterval(() => {
        var sec = currentTime % 60;
        var min = Math.floor(currentTime / 60);
        this.element.panel.onlinePanel.callTime.textContent = min + ":" + sec;
        currentTime ++;
    }, 1000);
    return {
        cancel: function() {
            if (!callTimeInterval)
                return;
            window.clearInterval(callTimeInterval);
            callPanel.element.panel.onlinePanel.callTime.textContent = "0:0";
            callTimeInterval = null;
        }
    }
};
