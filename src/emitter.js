var EventEmitter = function() {
    this.handlers = {};
};

/*--------------------------------------------------------------------------------------------------------------------*/

EventEmitter.prototype.emit = function(name /*, args */) {
    var self = this, args = Array.prototype.slice.call(arguments, 1);
    if (name in this.handlers) {
        var list = this.handlers[name];
        for (var i = 0; i < list.length; i++) {
            setTimeout(executeListener(list[i]), 0);
        }
    }
    function executeListener(listener) {
        return function() {
            listener.apply(self, args);
        }
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

EventEmitter.prototype.on = function(name, listener) {
    if (!Array.isArray(name)) name = [name];
    for (var i = 0; i < name.length; i++) {
        this.handlers[name[i]] = this.handlers[name[i]] || [];
        var list = this.handlers[name[i]];
        list.push(listener);
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

EventEmitter.prototype.off = function(name, listener) {
    this.handlers[name] = this.handlers[name] || [];
    var index = this.handlers[name].indexOf(listener);
    if (index !== -1) {
        this.handlers[name].splice(index, 1);
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/
EventEmitter.prototype.once = function(name, listener) {
    var self = this;

    function listenOnce() {
        listener.apply(this, arguments);
        self.off(name, listenOnce);
    }

    self.on(name, listenOnce);
};

/*--------------------------------------------------------------------------------------------------------------------*/

module.exports = EventEmitter;