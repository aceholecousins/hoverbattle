
/*
Paradigms:

- the bridge is intended to change and call objects on the remote side,
  you never get any values back, only handles to remote objects
- if you need to get values back, send callbacks and call them there
- don't use new dynamically generated callbacks all the time as they are
  going to persist in the registry and won't get garbage collected
*/

import { DBG_LOG, DBG_ME, DBG_OTHER } from "./debug"
import { handleMessage } from "./handlers"
import { Key } from "./path"
import { BridgeMsg } from "./messages"
import { _createProxy } from "./proxy"


export class WorkerBridge{
	
	worker:Worker = undefined
	connected = false
	sendWhenConnected = false

	// locally stored objects
	// (typescript complains about key:Key and about key:(string | number) )
	localRegistry:{
		[key: string]: any,
		[index: number]: any
	} = {}

	// remotely manually registered objects
	remoteRegistry = new Set<string>()

	// proxies that were requested but we don't know yet if the other side has registered them yet
	// they will hang in promise limbo until we get the respective "reg" message
	pendingProxies:{
		[key: string]: (()=>void)[] // array of promise resolver functions
	} = {}
	
	// counter for locally stored anonymous objects
	// whose creation was caused by this side, counts positive
	localOwnIndexCounter = 1
	// counter for locally stored anonymous objects
	// whose creation was caused by the other side, counts negative
	localOtherIndexCounter = -1

	// counter for remotely stored anonymous objects
	// whose creation was caused by the remote side itself, counts positive
	remoteOwnIndexCounter = 1
	// counter for remotely stored anonymous objects
	// whose creation was caused by this side, counts negative
	remoteOtherIndexCounter = -1

	/** leave worker empty when calling from inside a worker
	 * and building a bridge to the window */
	constructor(workerFile?:string){
		if(workerFile !== undefined){
			this.worker = new Worker(workerFile)
			this.worker.onmessage = this.receive.bind(this)
		}
		else{
			onmessage = this.receive.bind(this)
			this.enqueueMsg({kind:"ready"})
			this.sendAll()
			this.connected = true
		}
	}

	msgQueue: BridgeMsg[] = []

	enqueueMsg(msg:BridgeMsg){
		this.msgQueue.push(msg)
	}

	sendAll(){
		if(this.msgQueue.length == 0){
			return
		}

		DBG_LOG(DBG_ME, "->", DBG_OTHER, ":")
		for(let msg of this.msgQueue){
			DBG_LOG("-> " + JSON.stringify(msg))
		}

		if(this.worker !== undefined){
			if(this.connected){
				this.worker.postMessage(this.msgQueue)
				this.msgQueue = []
			}
			else{
				this.sendWhenConnected = true
			}
		}
		else{
			// TypeScript does not know we mean postMessage from inside a worker
			//@ts-ignore
			postMessage(this.msgQueue)
			this.msgQueue = []
		}
	}

	receive(event:MessageEvent){
		for(let i in event.data){
			let msg = event.data[i] as BridgeMsg
			DBG_LOG(DBG_ME, "handles")
			DBG_LOG(msg)
			handleMessage(this, msg)
		}
	}

	/** register an object for being accessible by the remote side */
	register(object:Object, name:string){
		DBG_LOG(DBG_ME, "[", name, "] =", object)
		this.localRegistry[name] = object
		this.enqueueMsg({kind:"reg", id:name})
	}

	/** create a proxy for an object on the remote side */
	async createProxy(remoteKey: Key){
		// this function is an interface to the outside, it only allows reference
		// to targets that were explicitly registered on the remote side
		if(!isNaN(remoteKey as any)){
			throw new Error("numeric indices are reserved for anonymous objects")
		}
		if(remoteKey in this.remoteRegistry){
			return _createProxy(this, remoteKey)
		}
		else{
			let bridge = this
			return new Promise(function(resolve){
				if(!(remoteKey in bridge.pendingProxies))
				{
					bridge.pendingProxies[remoteKey] = []
				}
				bridge.pendingProxies[remoteKey].push(
					function(){
						resolve(_createProxy(bridge, remoteKey))
					}
				)
			})
		}
	}
}
