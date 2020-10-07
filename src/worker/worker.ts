
//*

import {WorkerBridge} from "./workerbridge"

let bridge:WorkerBridge

if(window.document !== undefined){ // we are the main window and start the worker
	console.log("loading engine")
	bridge = new WorkerBridge("./acechase_engine.js")
}
else{
	// we are inside the worker
	bridge = new WorkerBridge()
}

export {bridge}

/*/

import {WorkerBridgeDummy} from "./workerbridgedummy"
import "engine_main"

export let bridge = new WorkerBridgeDummy()

/**/