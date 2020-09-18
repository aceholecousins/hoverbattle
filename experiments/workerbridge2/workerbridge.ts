
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
type Reference = ID | LazyPath

function makeLazyPath(parent: Reference, prop: string){
	// a lazy path is a function that returns a path when it's called
	return function(){
		if(typeof(parent) === "function"){ // the parent is itself a lazy path
			return [...parent(), prop]
		}
		else{ // the parent is already a directly linked reference
			return [parent, prop]
		}
	}
}

type TaggedCallback = Function & {__cb__?:number}

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
	private objectRegistry:{
		[key: string]: any,
		[index: number]: any
	} = {}
	
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
			this.onReady = onReady
		}
		else{
			onmessage = this.receive.bind(this)
			this.enqueueMsg({kind:"ready"})
			this.sendAll()
		}
	}

	private msgQueue: BridgeMsg[] = []
	private enqueueMsg(msg:BridgeMsg){
		this.msgQueue.push(msg)
	}

	sendAll(){
		if(typeof(this.worker) !== "undefined"){
			console.log("window -> worker:")
			for(let msg of this.msgQueue){
				console.log("-> " + JSON.stringify(msg))
			}
			this.worker.postMessage(this.msgQueue)
		}
		else{
			console.log("worker -> window:")
			for(let msg of this.msgQueue){
				console.log("-> " + JSON.stringify(msg))
			}
			//@ts-ignore
			postMessage(this.msgQueue)
		}
		this.msgQueue = []
	}

	private handleLinkage(msg: LinkMsg){
		let target:any = this.objectRegistry
		for(let field of (msg as LinkMsg).path){
			target = target[field]
		}
		if(typeof(target) !== "object" && typeof(target) !== "function"){
			throw new Error("tried to link a field which is not an object or a method: " + msg.path)
		}
		this.objectRegistry[this.localIndexCounter++] = target
	}

	private handleCall(msg: CallMsg){
		let result = this.objectRegistry[msg.id](
			...this.resolveReferences(msg.args)
		)
		if(typeof(result) === "object"){
			this.objectRegistry[this.localIndexCounter++] = result
		}
		else{
			if(result !== undefined){
				console.warn("result of remotely called function will be ignored")
			}
			// the remote side will inc its counter so we also have to
			this.localIndexCounter++
		}
	}

	private handlePropertySet(msg: SetMsg){
		this.objectRegistry[msg.id][msg.prop] =
			this.resolveReferences(msg.val)
	}

	private receive(event:MessageEvent){
		for(let i in event.data){
			let msg = event.data[i] as BridgeMsg
			switch(msg.kind){
				case "ready":
					if(this.onReady !== undefined){
						this.onReady()
					}
					break
				case "link":
					this.handleLinkage(msg)
					break
				case "call":
					this.handleCall(msg)
					break
				case "set":
					this.handlePropertySet(msg)
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
			throw new Error("numeric indices are reserved for anonymous objects")
		}
		return this._createProxy(remoteKey)
	}

	// more general proxy creation, also for anonymous objects and child objects
	private _createProxy(ref: Reference):any{
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
				bridge.enqueueMsg({kind:"link", path:ref()})
				ref = bridge.remoteIndexCounter++
			}
		}

		return new Proxy(()=>{}, {

			set(target:any, prop:string, val:any){
				link()
				bridge.enqueueMsg({
					kind:"set",
					id:ref as ID,
					prop, val:bridge.referencifyObject(val)
				})
				return true
			},

			get(target:any, prop:string, receiver:any){
				if(prop === "__ref__"){
					return ref
				}
				if(!(prop in children)){
					children[prop] = bridge._createProxy(makeLazyPath(ref, prop))
				}
				return children[prop]
			},

			apply(target:any, thisArg:any, args:any[]){
				link()
				bridge.enqueueMsg({
					kind:"call",
					id:ref as ID,
					args:bridge.referencifyObject(args)
				})
				return bridge._createProxy(bridge.remoteIndexCounter++)
			}
		})
	}

	private referencifyFunction(fn:TaggedCallback){
		if(fn.__cb__ === undefined){
			// tag this function with a __cb__ index
			// so that it will not be indexed multiple times
			// TODO: if we allow the bridge to be reset, all tagged
			// functions must be untagged
			let newIndex = this.localIndexCounter++
			fn.__cb__ = newIndex
			this.objectRegistry[newIndex] = fn
			return {__cb__:"new"}
		}
		else{
			return {__cb__:fn.__cb__}
		}
	}

	private referencifyChildren(obj:any){
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
	private referencifyObject(value:any):Pod{
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
					return {__ref__:value.__ref__}
				}
		}

		throw new Error("unsendable type: " + typeof(value))
	}

	private resolveReferenceMembers(obj:any){
		if("__cb__" in obj){
			if(typeof(obj["__cb__"]) === "number"){
				// reference to a callback that was already registered before
				// return another proxy to it
				// TODO: are we allowed to hand out multiple proxies to the same object?
				// what if only one of them gets disposed?
				return this._createProxy(obj["__cb__"])
			}
			else if(obj["__cb__"] === "new"){
				// return a new proxy to a newly registered callback
				return this._createProxy(this.remoteIndexCounter++)
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
				return this.objectRegistry[obj.__ref__]
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

	private resolveReferences(value:Pod):any{
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
