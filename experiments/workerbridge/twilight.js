//@ts-ignore
let myWorkerFunction = workerFunction((arg) => {
    console.log("myWorkerFunction(" + arg + ") executed in " + (self["isWorker"] ? "worker" : "window"));
});
//@ts-ignore
let myWindowFunction = windowFunction((arg) => {
    console.log("myWindowFunction(" + arg + ") executed in " + (self["isWorker"] ? "worker" : "window"));
});
self["exports"] = {
    myWorkerFunction,
    myWindowFunction
};
