import { WorkerBridge } from "../../src/worker/workerbridge"
import {IN_WORKER, IN_WINDOW, DBG_ME} from "../../src/worker/debug"

console.log("hi from " + DBG_ME)

// this will start this file again as a worker
let bridge = IN_WINDOW? new WorkerBridge("./test.js") : new WorkerBridge()

async function runWorker(){
	let testObject = {
		field:"hi",
		method(){
			console.log("method called")
		}
	}
	
	setTimeout(function(){
		bridge.register(testObject, "testObject")
	}, 300)
}

async function runWindow(){
	let testProxy = await bridge.createProxy("testObject")
	testProxy.method()
}

setInterval(function(){bridge.sendAll()}, 100)
IN_WORKER? runWorker() : runWindow()