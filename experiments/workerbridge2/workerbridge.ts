
/*
Paradigms:

- the bridge is intended to change and call objects on the remote side,
  you never get any values back, only handles to remote objects
- if you need to get values back, send callbacks and call them there
- don't use new dynamically generated callbacks all the time as they are
  going to persist in the registry and won't get garbage collected
*/

type Pod = any
type Kind = string

type Key = string // for explicitly registered objects
type Index = number // for automatically registered objects
type ID = Key | Index // for all objects
type Path = ID[] // for relating a proxy via its parent (or grandparent etc.)
type LazyPath = ()=>Path // for lazy evaluation

// generic message
interface Msg<K extends Kind>{
	kind:K
}

/**
 * hand shake
 */
interface ReadyMsg extends Msg<"ready">{}

/**
 * {kind:"link", path:["myObj", "a", "b", "c"]} means \
 * registry[indexCounter++] = registry["myObj"].a.b.c \
 * so a proxy that was before only related to its remote target through its parent
 * now gets its own entry in the remote registry
 */
interface LinkMsg extends Msg<"link">{
	path:Path
}

/**
 * registry[id].prop = val \
 * if the value contains any callbacks, they will be registered
 */
interface SetMsg extends Msg<"set">{
	id:ID
	prop:ID
	val:any
}

/**
 * registry[indexCounter++] = registry[id]([...args])
 * if the args contain any callbacks, they will be registered
 */
interface CallMsg extends Msg<"call">{
	id:ID
	args:any[]
}

type BridgeMsg = ReadyMsg | LinkMsg | SetMsg | CallMsg

export class WorkerBridge{
	
	private worker:Worker = undefined
	private onReady:()=>void = undefined

	// locally stored objects
	// (typescript complains about key:Key and about key:(string | number) )
	private objectRegistry:{[key: string]: any, [index: number]: any} = {}
	
	// counter for locally stored anonymous objects
	private localIndexCounter = 0

	// counter for remotely stored anonymous objects
	private remoteIndexCounter = 0
	
	/** leave worker empty when calling from inside a worker
	 * and building a bridge to the window */
	constructor(workerFile?:string, onReady?:()=>void){
		if(typeof(workerFile) !== "undefined"){
			this.worker = new Worker(workerFile)
			this.worker.onmessage = this.receive.bind(this)
		}
		else{
			onmessage = this.receive.bind(this)
			this.bufferMsg({kind:"ready"})
			this.sendAll()
		}
	}

	private msgBuffer: BridgeMsg[] = []
	private bufferMsg(msg:BridgeMsg){
		this.msgBuffer.push(msg)
	}

	sendAll(){
		if(typeof(this.worker) !== "undefined"){
			console.log("window -> worker:")
			for(let msg of this.msgBuffer){
				console.log("-> " + JSON.stringify(msg))
			}
			;(this.worker as Worker).postMessage(this.msgBuffer)
		}
		else{
			console.log("worker -> window:")
			for(let msg of this.msgBuffer){
				console.log("-> " + JSON.stringify(msg))
			}
			//@ts-ignore
			postMessage(this.msgBuffer)			
		}
		this.msgBuffer = []
	}

	receive(event:any){
		for(let i in event.data){
			let msg = event.data[i] as BridgeMsg
			switch(msg.kind){
				case "ready":
					if(typeof(this.onReady) == "function"){
						this.onReady()
					}
					break
				case "link":
					let target:any = this.objectRegistry
					for(let field of (msg as LinkMsg).path){
						target = target[field]
					}
					this.objectRegistry[this.localIndexCounter++] = target
					break
				case "call":
					let result = this.objectRegistry[msg.id](
						...this.proxifyFunctionReferences(msg.args)
					)
					if(typeof(result) === "object"){
						this.objectRegistry[this.localIndexCounter++] = result
					}
					else{
						// the remote side will inc its counter so we also have to
						this.localIndexCounter++
					}
					break
				case "set":
					this.objectRegistry[msg.id][msg.prop] =
						this.proxifyFunctionReferences(msg.val)
					break
			}
		}
	}

	/** register an object for being accessible by the remote side */
	register(object:Object, name:string){
		this.objectRegistry[name] = object
	}

	/** create a proxy for an object on the remote side */
	createProxy(remoteKey: Key){
		// this function is an interface to the outside, it only allows reference
		// to targets that were explicitly registered on the remote side
		if(!isNaN(remoteKey as any)){
			throw "numeric indices are reserved for anonymous objects"
		}
		return this._createProxy(remoteKey)
	}

	// more general proxy creation, also for anonymous objects and child objects
	private _createProxy(ref: ID | LazyPath):any{
		// ref defines how this proxy relates to its target on the other side
		// - ID as Key means, the proxied object was explicitly registered
		//   on the remote side with a name
		// - ID as Index means, the proxied object is the result of a get
		//   or a call and it has no name but an index
		// - LazyPath means that this proxy relates to its target by being a field
		//   of its parent proxy

		// keep track of all the members that were get-ed
		let children:{[key: string]:any}={}
	
		let bridge = this

		// If not yet done, directly link this proxy
		// to the corresponding object on the remote side.
		// It gets an index entry in the remote registry.
		function link(){
			if(typeof(ref) === "function"){
				bridge.bufferMsg({kind:"link", path:ref()})
				ref = bridge.remoteIndexCounter++
			}
		}

		return new Proxy(()=>{}, {

			set: function(target:any, prop:string, val:any){
				link()
				bridge.bufferMsg({
					kind:"set",
					id:ref as ID,
					prop, val:bridge.referencifyFunctions(val)
				})
				return true
			},

			get: function(target:any, prop:string, receiver:any){
				if(!(prop in children)){
					children[prop] = bridge._createProxy(function(){
						if(typeof(ref) === "function"){
							return [...ref(), prop]
						}
						else{
							return [ref, prop]
						}
					})
				}
				return children[prop]
			},

			apply: function(target:any, thisArg:any, args:any[]){
				link()
				bridge.bufferMsg({
					kind:"call",
					id:ref as ID,
					args:bridge.referencifyFunctions(args)
				})
				return bridge._createProxy(bridge.remoteIndexCounter++)
			}
		})
	}

	// scan an object for functions, store local references for them
	// and replace the functions with the references
	// this is for sending callbacks through the worker bridge
	referencifyFunctions(value:any):Pod{
		switch(typeof(value)){
			case "number":
			case "string":
			case "boolean":
				return value
			case "object":
				let copy:any = Array.isArray(value)? [] : {}
				for(let key in value){
					let wrapped = this.referencifyFunctions(value[key])
					if(typeof(wrapped) === "object" && "__cb__" in wrapped){
						copy["__cb__"] = true // this object or a sub object contains callbacks
					}
					copy[key] = wrapped
				}
				return copy
			case "function":
				if(value.__cb__ === undefined){
					// tag this function with a __cb__ index
					// so that it will not be indexed multiple times
					// TODO: if we allow the bridge to be reset, all tagged
					// functions must be untagged
					let newIndex = this.localIndexCounter++
					value.__cb__ = newIndex
					this.objectRegistry[newIndex] = value
					return {__cb__:"new"}
				}
				else{
					return {__cb__:value.__cb__}
				}
		}
	}

	proxifyFunctionReferences(value:Pod):any{
		switch(typeof(value)){
			case "number":
			case "string":
			case "boolean":
				return value
			case "object":
				if("__cb__" in value){
					if(typeof(value["__cb__"]) === "number"){
						return this._createProxy(value["__cb__"])
					}
					else if(value["__cb__"] === "new"){
						return this._createProxy(this.remoteIndexCounter++)
					}
					else{
						for(let field in value){
							value[field] = this.proxifyFunctionReferences(value[field])
						}
						return value
					}
				}
				else{
					return value
				}
		}
	}
}
