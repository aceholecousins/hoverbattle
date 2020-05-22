//@ts-ignore
self["isWorker"] = typeof (window) === "undefined";
let isWorker = self["isWorker"];
if (!isWorker) {
    self["mainWorker"] = new Worker("worker.js");
}
console.log(self);
self["dynamicImport"] = function (url, onLoad) {
    var req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        let js = this.responseText;
        self["exports"] = undefined;
        eval(js);
        let data = self["exports"];
        self["exports"] = undefined;
        if (typeof (onLoad) !== "undefined") {
            onLoad(data);
        }
    });
    req.open("GET", url);
    req.send();
};
function hash(arg) {
    let s = arg.toString();
    return s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
}
class Dispatcher {
    constructor() {
        this.registry = {};
        let that = this;
        let handler = function (msg) {
            that.registry[msg.data.fnhash](msg.data.arg);
        };
        if (self["isWorker"]) {
            onmessage = handler;
        }
        else {
            self["mainWorker"].onmessage = handler;
        }
    }
    register(fn) {
        this.registry[hash(fn)] = fn;
    }
}
let dispatcher = new Dispatcher();
self["workerFunction"] = function (fn) {
    if (self["isWorker"]) {
        dispatcher.register(fn);
        return fn;
    }
    else {
        return function (arg) {
            self["mainWorker"].postMessage({ fnhash: hash(fn), arg: arg });
        };
    }
};
self["windowFunction"] = function (fn) {
    if (self["isWorker"]) {
        return function (arg) {
            //@ts-ignore
            postMessage({ fnhash: hash(fn), arg: arg });
        };
    }
    else {
        dispatcher.register(fn);
        return fn;
    }
};
