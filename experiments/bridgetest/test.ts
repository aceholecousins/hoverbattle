import { WorkerBridge } from "../../src/worker/workerbridge"
import {IN_WORKER, IN_WINDOW, DBG_ME} from "../../src/worker/debug"

console.log("hi from " + DBG_ME)

// this will start this file again as a worker
let bridge = IN_WINDOW? new WorkerBridge("./test.js") : new WorkerBridge()

async function runWorker(){
	let testObject = {
		field:"hi",
		method():Promise<string>{
			console.log("method called")
			return Promise.resolve("I am a promise")
		}
	}

	//let promise = testObject.method() as Promise<string>
	//promise.then(v => console.log(v))
	
	setTimeout(function(){
		bridge.register(testObject, "testObject")
	}, 300)
}

async function runWindow(){
	bridge.createProxy("testObject").then( testProxy => {
		let promise = testProxy.method() as Promise<string>
		console.log(promise.then)
		promise.then(v => console.log(v))
	})	
}

setInterval(function(){bridge.sendAll()}, 100)
IN_WORKER? runWorker() : runWindow()