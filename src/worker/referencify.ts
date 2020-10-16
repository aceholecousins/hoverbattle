// these functions deal with substitution of arguments and callbacks with proxies

import { DBG_LOG, DBG_ME, DBG_OTHER } from "./debug"
import { _createProxy } from "./proxy"
import { WorkerBridge } from "./workerbridge"

type Pod = any
type TaggedCallback = Function & {__cb__?:number}

export function referencifyFunction(bridge:WorkerBridge, fn:TaggedCallback){
	if(fn.__cb__ === undefined){
		// tag this function with a __cb__ index
		// so that it will not be indexed multiple times
		// TODO: if we allow the bridge to be reset, all tagged
		// functions must be untagged
		DBG_LOG(DBG_ME, "[", bridge.localOwnIndexCounter, "] = callback")
		DBG_LOG(fn)

		let newIndex = bridge.localOwnIndexCounter++
		fn.__cb__ = newIndex
		bridge.localRegistry[newIndex] = fn
		return {__cb__:"new"}
	}
	else{
		return {__cb__:fn.__cb__}
	}
}

export function referencifyChildren(bridge:WorkerBridge, obj:any){
	let copy:any = Array.isArray(obj)? [] : {}

	for(let key in obj){

		let wrapped = referencifyObject(bridge, obj[key])

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
export function referencifyObject(bridge:WorkerBridge, value:any):Pod{
	switch(typeof(value)){
		case "number":
		case "string":
		case "boolean":
			return value
		case "object":
			return referencifyChildren(bridge, value)
		case "function":
			if(value.__ref__ === undefined){
				return referencifyFunction(bridge, value)
			}
			else{
				// value is not a function but a proxy object
				// (all bridge proxies wrap functions so operator() works)
				return {__ref__:value.__ref__}
			}
	}

	throw new Error("unsendable type: " + typeof(value))
}

export function resolveReferenceMembers(bridge:WorkerBridge, obj:any){
	if("__cb__" in obj){
		if(typeof(obj["__cb__"]) === "number"){
			// reference to a callback that was already registered before
			// return another proxy to it
			// TODO: are we allowed to hand out multiple proxies to the same object?
			// what if only one of them gets disposed?
			return _createProxy(bridge, obj["__cb__"])
		}
		else if(obj["__cb__"] === "new"){
			DBG_LOG(
				DBG_ME, "expects that",
				DBG_OTHER, "[", bridge.remoteOwnIndexCounter, "] is a callback"
			)
			
			// return a new proxy to a newly registered callback
			return _createProxy(bridge, bridge.remoteOwnIndexCounter++)
		}
		else if(obj["__cb__"] === true){
			// a child or a grandchild etc. is a callback
			for(let field in obj){
				obj[field] = resolveReferences(bridge, obj[field])
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
			return bridge.localRegistry[obj.__ref__]
		}
		else if(obj["__ref__"] === true){
			// a child or a grandchild etc. is a proxy
			for(let field in obj){
				obj[field] = resolveReferences(bridge, obj[field])
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

export function resolveReferences(bridge:WorkerBridge, value:Pod):any{
	switch(typeof(value)){
		case "number":
		case "string":
		case "boolean":
			return value
		case "object":
			return resolveReferenceMembers(bridge, value)
	}
}