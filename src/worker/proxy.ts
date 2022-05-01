import { DBG_LOG, DBG_ME, DBG_OTHER } from "./debug"
import { ID, makeLazyPath, Reference } from "./path"
import { referencifyObject } from "./referencify"
import { WorkerBridge } from "./workerbridge"

// more general proxy creation, also for anonymous objects and child objects
export function _createProxy(bridge: WorkerBridge, ref: Reference):any{
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
				prop, val:referencifyObject(bridge, val)
			})
			return true
		},

		get(target:any, prop:string, receiver:any){
			// if(prop === "then"){
			//  	return // nothing so this proxy cannot act as a promise
			//  }
			if(prop === "__ref__"){
				return resolvePath()
			}
			if(prop === "dispose"){
				return dispose
			}
			if(!(prop in children)){
				children[prop] = _createProxy(bridge, makeLazyPath(ref, prop))
			}
			return children[prop]
		},

		apply(target:any, thisArg:any, args:any[]){
			bridge.enqueueMsg({
				kind:"call",
				id:resolvePath(),
				args:referencifyObject(bridge, args)
			})
			DBG_LOG(
				DBG_ME, "calls", DBG_OTHER, "[", resolvePath(), "]",
				", store result in", DBG_OTHER, "[", bridge.remoteOtherIndexCounter, "]"
			)
			return _createProxy(bridge, bridge.remoteOtherIndexCounter--)
		},

		construct(target:any, args:any){
			bridge.enqueueMsg({
				kind:"new",
				id:resolvePath(),
				args:referencifyObject(bridge, args)
			})
			DBG_LOG(
				DBG_ME, "calls new on", DBG_OTHER, "[", resolvePath(), "]",
				", store object in", DBG_OTHER, "[", bridge.remoteOtherIndexCounter, "]"
			)
			return _createProxy(bridge, bridge.remoteOtherIndexCounter--)
		}
	})
}