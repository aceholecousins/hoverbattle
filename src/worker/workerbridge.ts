
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
import {ID, Key, makeLazyPath, Reference} from "./path"
import { BridgeMsg, CallMsg, DisposeMsg, LinkMsg, NewMsg, RegisterMsg, SetMsg } from "./messages"

type Pod = any

type TaggedCallback = Function & {__cb__?:number}

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
			return this._createProxy(remoteKey)
		}
		else{
			let bridge = this
			return new Promise(function(resolve, reject){
				if(!(remoteKey in bridge.pendingProxies))
				{
					bridge.pendingProxies[remoteKey] = []
				}
				bridge.pendingProxies[remoteKey].push(
					function(){
						resolve(bridge._createProxy(remoteKey))
					}
				)
			})
		}
	}

	// more general proxy creation, also for anonymous objects and child objects
	_createProxy(ref: Reference):any{
		// ref defines how this proxy relates to its target on the other side
		// - ID as Key means, the proxied object was explicitly registered
		//   on the remote side with a name
		// - ID as Index means, the proxied object is the result of a get
		//   or a call and it has no name but an index
		// - LazyPath means that this proxy relates to its target by being a field
		//   of its parent proxy

		DBG_LOG(DBG_ME, "creates proxy to", 
			JSON.stringify((typeof(ref) === "function")? ref() : ref))

		// keep track of all the members that were get-ed
		let children:{[key: string]:any}={}
	
		let bridge = this

		// If not yet done, directly link this proxy
		// to the corresponding object on the remote side.
		// It gets an index entry in the remote registry.
		function resolvePath():ID {
			if(typeof(ref) === "function"){
				DBG_LOG(
					DBG_ME, "requests",
					DBG_OTHER, "[", bridge.remoteOtherIndexCounter, "] =", JSON.stringify(ref())
				)

				bridge.enqueueMsg({kind:"link", path:ref()})
				ref = bridge.remoteOtherIndexCounter--
			}
			return ref
		}

		// this will be a special member of the proxy that also
		// deletes the registry entry on the remote side and
		// sets the reference of this proxy to undefined
		// so the GC can do its job
		function dispose(){
			bridge.enqueueMsg({
				kind:"del",
				id:resolvePath()
			})
			ref = undefined // ensure this proxy is not used further
		}

		return new Proxy(Object, {

			set(target:any, prop:string, val:any){
				bridge.enqueueMsg({
					kind:"set",
					id:resolvePath(),
					prop, val:bridge.referencifyObject(val)
				})
				return true
			},

			get(target:any, prop:string, receiver:any){
				if(prop === "then"){
					return // nothing so this proxy cannot act as a promise
				}
				if(prop === "__ref__"){
					return resolvePath()
				}
				if(prop === "dispose"){
					return dispose
				}
				if(!(prop in children)){
					children[prop] = bridge._createProxy(makeLazyPath(ref, prop))
				}
				return children[prop]
			},

			apply(target:any, thisArg:any, args:any[]){
				bridge.enqueueMsg({
					kind:"call",
					id:resolvePath(),
					args:bridge.referencifyObject(args)
				})
				DBG_LOG(
					DBG_ME, "calls", DBG_OTHER, "[", resolvePath(), "]",
					", store result in", DBG_OTHER, "[", bridge.remoteOtherIndexCounter, "]"
				)
				return bridge._createProxy(bridge.remoteOtherIndexCounter--)
			},

			construct(target:any, args:any){
				bridge.enqueueMsg({
					kind:"new",
					id:resolvePath(),
					args:bridge.referencifyObject(args)
				})
				DBG_LOG(
					DBG_ME, "calls new on", DBG_OTHER, "[", resolvePath(), "]",
					", store object in", DBG_OTHER, "[", bridge.remoteOtherIndexCounter, "]"
				)
				return bridge._createProxy(bridge.remoteOtherIndexCounter--)
			}
		})
	}

	referencifyFunction(fn:TaggedCallback){
		if(fn.__cb__ === undefined){
			// tag this function with a __cb__ index
			// so that it will not be indexed multiple times
			// TODO: if we allow the bridge to be reset, all tagged
			// functions must be untagged
			DBG_LOG(DBG_ME, "[", this.localOwnIndexCounter, "] = callback")
			DBG_LOG(fn)

			let newIndex = this.localOwnIndexCounter++
			fn.__cb__ = newIndex
			this.localRegistry[newIndex] = fn
			return {__cb__:"new"}
		}
		else{
			return {__cb__:fn.__cb__}
		}
	}

	referencifyChildren(obj:any){
		let copy:any = Array.isArray(obj)? [] : {}

		for(let key in obj){

			let wrapped = this.referencifyObject(obj[key])

			if(typeof(wrapped) === "object"){
				if("__cb__" in wrapped){
					// this object or a sub object contains callbacks
					copy["__cb__"] = true
				}
				if("__ref__" in wrapped){
					// this object or a sub object contains proxies
					copy["__ref__"] = true
				}
			}

			copy[key] = wrapped
		}
		return copy
	}

	// scan an object for functions, store local references for them
	// and replace the functions with the references
	// this is for sending callbacks through the worker bridge
	referencifyObject(value:any):Pod{
		switch(typeof(value)){
			case "number":
			case "string":
			case "boolean":
				return value
			case "object":
				return this.referencifyChildren(value)
			case "function":
				if(value.__ref__ === undefined){
					return this.referencifyFunction(value)
				}
				else{
					// value is not a function but a proxy object
					// (all bridge proxies wrap functions so operator() works)
					return {__ref__:value.__ref__}
				}
		}

		throw new Error("unsendable type: " + typeof(value))
	}

	resolveReferenceMembers(obj:any){
		if("__cb__" in obj){
			if(typeof(obj["__cb__"]) === "number"){
				// reference to a callback that was already registered before
				// return another proxy to it
				// TODO: are we allowed to hand out multiple proxies to the same object?
				// what if only one of them gets disposed?
				return this._createProxy(obj["__cb__"])
			}
			else if(obj["__cb__"] === "new"){
				DBG_LOG(
					DBG_ME, "expects that",
					DBG_OTHER, "[", this.remoteOwnIndexCounter, "] is a callback"
				)
				
				// return a new proxy to a newly registered callback
				return this._createProxy(this.remoteOwnIndexCounter++)
			}
			else if(obj["__cb__"] === true){
				// a child or a grandchild etc. is a callback
				for(let field in obj){
					obj[field] = this.resolveReferences(obj[field])
				}
				return obj
			}
			else{
				throw new Error("unexpected callback reference type")
			}
		}
		else if("__ref__" in obj){
			if(
				typeof(obj["__ref__"]) === "number" ||
				typeof(obj["__ref__"]) === "string"
			){
				// the remote object is a proxy, return the registry entry
				return this.localRegistry[obj.__ref__]
			}
			else if(obj["__ref__"] === true){
				// a child or a grandchild etc. is a proxy
				for(let field in obj){
					obj[field] = this.resolveReferences(obj[field])
				}
				return obj
			}
			else{
				throw new Error("unexpected reference type")
			}
		}
		else{
			return obj
		}
	}

	resolveReferences(value:Pod):any{
		switch(typeof(value)){
			case "number":
			case "string":
			case "boolean":
				return value
			case "object":
				return this.resolveReferenceMembers(value)
		}
	}
}
