var CallLog = function(options) {
    // TODO: choose a template engine
    if (!options.target) {
        throw new Error('need specifiy a target for auth panel');
    }
    this.sdk = options.sdk;
    this.webPhone = options.webPhone || new RingCentral.WebPhone({ audioHelper: true });

    this.targetDOM = document.querySelector(options.target);
    this.generateDOM();
    this.getLog(1, 10);
};

CallLog.prototype.generateDOM = function(state) {
    // hard code the dom composition
    this.element = {
        panelTitle: dom('div', {
            className: 'rc-panel-title',
            text: 'Call log'
        }),
        logPanel: dom('div', {
            className: 'rc-panel'
        }, null, {
            message: dom('div', {
                className: 'rc-message'
            })
        })
    }

    this.template = function(call) {
        var temp =
            dom('div', {
                className: 'rc-sub-panel rc-calllog'
            }, null, {
                name: dom('div', {
                    className: 'rc-calllog-name',
                    text: call.from.name || 'anonymous'
                }),
                type: dom('div', {
                    className: 'rc-calllog-type',
                    text: call.direction || 'unknown'
                }),
                time: dom('div', {
                    className: 'rc-calllog-time',
                    text: call.startTime || 'none'
                })
            });
        return temp;

    }

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

CallLog.prototype.getLog = function(page, number) {
    this.interval = this.loading(this.element.logPanel.message, 'Loading call log')
    return this.sdk.platform()
        .get('/account/~/extension/~/call-log', { page: page, perPage: number })
        .then(response => {
            if (this.interval) {
                this.interval.cancel('');
                this.interval = null;
            }
            calls = response.json().records;
            calls.forEach(call => {
                this.element.logPanel.appendChild(this.template(call));
            });
        })
        .catch(function(e) {
            console.error('Recent Calls Error: ' + e.message);
        });
};
CallLog.prototype.loading = function(target, text) {
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
