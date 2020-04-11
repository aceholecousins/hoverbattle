var EventChannel = /** @class */ (function () {
    function EventChannel() {
        this.handlers = new Set();
    }
    EventChannel.prototype.addHandler = function (handler) {
        this.handlers.add(handler);
    };
    EventChannel.prototype.removeHandler = function (handler) {
        this.handlers["delete"](handler);
    };
    EventChannel.prototype.fire = function (event) {
        this.handlers.forEach(function (handler) {
            handler(event);
        });
    };
    EventChannel.prototype.fetch = function (request) {
        var responses = [];
        this.handlers.forEach(function (handler) {
            var response = handler(request);
            if (response !== undefined) {
                responses.push(response);
            }
        });
        return responses;
    };
    return EventChannel;
}());
var broker = {};
broker.newChannel = function (name) {
    if (broker.hasOwnProperty(name)) {
        throw new Error('channel "' + name + '" already exists');
    }
    else {
        broker[name] = new EventChannel();
    }
};
export { EventChannel, broker };
//# sourceMappingURL=broker.js.map