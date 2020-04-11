class EventChannel {
    constructor() {
        this.handlers = new Set();
    }
    addHandler(handler) {
        this.handlers.add(handler);
    }
    removeHandler(handler) {
        this.handlers.delete(handler);
    }
    fire(event) {
        this.handlers.forEach(function (handler) {
            handler(event);
        });
    }
    fetch(request) {
        let responses = [];
        this.handlers.forEach(function (handler) {
            let response = handler(request);
            if (response !== undefined) {
                responses.push(response);
            }
        });
        return responses;
    }
}
let broker = {};
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