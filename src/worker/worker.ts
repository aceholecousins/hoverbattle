import {WorkerBridge} from "./workerbridge"
import {WorkerBridgeDummy} from "./workerbridgedummy"

let bridge:WorkerBridge|WorkerBridgeDummy

if(window.document !== undefined){ // we are the main window and start the worker
	if((window as any).useBridge) {
		console.log("loading engine")
		bridge = new WorkerBridge("./acechase_engine.js")
	} else {
		console.log("creating dummy worker")
		bridge = new WorkerBridgeDummy()
	}
} else {
	// we are inside the worker
	console.log("connecting to ui")
	bridge = new WorkerBridge()
}

export {bridge}