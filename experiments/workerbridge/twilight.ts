
//@ts-ignore
let myWorkerFunction = workerFunction((arg:any) => {
	console.log("myWorkerFunction(" + arg + ") executed in " + (self["isWorker"]? "worker":"window"))
})

//@ts-ignore
let myWindowFunction = windowFunction((arg:any) => {
	console.log("myWindowFunction(" + arg + ") executed in " + (self["isWorker"]? "worker":"window"))
})

self["exports"] = {
	myWorkerFunction,
	myWindowFunction
}