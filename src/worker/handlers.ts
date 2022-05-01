
// here are the handler methods of the bridge
// the leading underscore is so that you don't accidentally call
// doStuff() instead of bridge.doStuff()

import { BridgeMsg, CallMsg, DisposeMsg, LinkMsg, NewMsg, RegisterMsg, SetMsg } from "./messages"
import {DEBUG, DBG_ME, DBG_OTHER} from "./debug"
import { WorkerBridge } from "./workerbridge"
import { resolveReferences } from "./referencify"

export function handleMessage(bridge:WorkerBridge, msg:BridgeMsg){
	switch(msg.kind){
		case "ready":
			handleReady(bridge)
			break
		case "reg":
			handleRegister(bridge, msg)
			break
		case "link":
			handleLinkage(bridge, msg)
			break
		case "call":
			handleCall(bridge, msg)
			break
		case "new":
			handleNew(bridge, msg)
			break
		case "set":
			handlePropertySet(bridge, msg)
			break
		case "del":
			handleDispose(bridge, msg)
			break
	}
}

function handleReady(bridge:WorkerBridge){
	bridge.connected = true
	if(bridge.sendWhenConnected){
		bridge.sendAll()
	}
}

function handleRegister(bridge:WorkerBridge, msg:RegisterMsg){
	bridge.remoteRegistry.add(msg.id)
	if(msg.id in bridge.pendingProxies){
		for(let resolve of bridge.pendingProxies[msg.id]){
			resolve()
		}
		delete bridge.pendingProxies[msg.id]
	}
}

function handleLinkage(bridge:WorkerBridge, msg:LinkMsg){
	let obj:any = bridge.localRegistry
	for(let field of (msg as LinkMsg).path){
		let child = obj[field]
		if(typeof(child) === "function"){
			child = child.bind(obj) // make sure we keep "bridge"
		}
		obj = child
	}
	if(typeof(obj) !== "object" && typeof(obj) !== "function"){
		console.log(typeof(obj))
		throw new Error("tried to link a field which is not an object or a method: " + msg.path)
	}
	if(DEBUG){
		console.log(DBG_ME, "[", bridge.localOtherIndexCounter, "] =")
		console.log(obj)
	}
	bridge.localRegistry[bridge.localOtherIndexCounter--] = obj
}

function handleCall(bridge:WorkerBridge, msg:CallMsg){
	let result = bridge.localRegistry[msg.id](
		...resolveReferences(bridge, msg.args)
	)
	if(
		typeof(result) === "object" ||
		typeof(result) === "function"
	){
		if(DEBUG){
			console.log(DBG_ME, "[", bridge.localOtherIndexCounter, "] is result", result)
		}
		bridge.localRegistry[bridge.localOtherIndexCounter--] = result
	}
	else{
		if(result !== undefined){
			console.warn("result of remotely called function will be ignored")
		}
		// the remote side will inc its counter so we also have to
		if(DEBUG){
			console.log(
				DBG_ME, "discards result", result,
				"and skips index", bridge.localOtherIndexCounter
			)
		}
		bridge.localOtherIndexCounter--
	}
}

function handleNew(bridge:WorkerBridge, msg:NewMsg){
	let result = new bridge.localRegistry[msg.id](
		...resolveReferences(bridge, msg.args)
	)
	if(DEBUG){
		console.log(DBG_ME, "[", bridge.localOtherIndexCounter, "] is the new", result)
	}
	bridge.localRegistry[bridge.localOtherIndexCounter--] = result
}

function handlePropertySet(bridge:WorkerBridge, msg:SetMsg){
	bridge.localRegistry[msg.id][msg.prop] =
		resolveReferences(bridge, msg.val)
}

function handleDispose(bridge:WorkerBridge, msg: DisposeMsg){
	if(bridge.localRegistry[msg.id].dispose !== undefined){
		bridge.localRegistry[msg.id].dispose()
	}
	delete bridge.localRegistry[msg.id]
}

