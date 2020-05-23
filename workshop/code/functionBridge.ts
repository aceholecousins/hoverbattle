
// plain old data object that can be transferred using postMessage:
interface PodObject{
	[index:number]:Pod
	[index:string]:Pod
}
type Pod = number | string | PodObject

// remote procedure that wants a pod argument:
type RemoteProc = (arg: Pod) => void

// stuff that is used by the broker:
type Registry<T> = { [key: string]: T }
type Apply = (target:any, thisArg:any, argumentsList:any) => void
interface Handler{
	apply:Apply
}
let emptyApply: Apply = function (target: any, thisArg: any, argumentsList: any) {
	console.error("unregistered function called")
}

// the broker:
class Broker{
	// registry for library functions that were registered:
	private functions: Registry<RemoteProc> = {}

	// registry for lookups where the function is not yet registered:
	private mockups: Registry<Handler> = {}

	// register a new function
	register(lib: RemoteProc, key: string = lib.name): void{
		if (key in this.register) {
			console.error("attempted redefinition of", key)
			return
		}

		// enter in registry
		this.functions[key] = lib

		// if this function was requested before, now fill it in
		if (key in this.mockups) {
			this.mockups[key].apply = function (target, thisArg, argumentList) {
				lib(argumentList[0])
			}
		}
	}

	// return a registered function or a mockup being a proxy
	// where "apply" is defined as soon as the function is registered
	lookup(key: string): RemoteProc{
		if (key in this.functions) {
			// function is already registered, just return it
			return this.functions[key]
		}
		else if (key in this.mockups) {
			// function not yet registered but was requested before
			// return the same mockup
			return new Proxy(()=>{}, this.mockups[key])
		}
		else {
			// function is not yet registered and was not yet requested
			// create a new mockup handler, store it in lookups and return it
			let handler = {apply: emptyApply}
			this.mockups[key] = handler
			return new Proxy(()=>{}, handler)
		}
	}
}
let broker = new Broker()

// define a function first and then request and use it
function definedFirst(x: any) {
	console.log("x=", x)
}
broker.register(definedFirst)
let useDefinedFirst = broker.lookup("definedFirst")
useDefinedFirst(13) // x= 13

// request a function first, try to call it,
// then define it, then try to call it again
let useRequestedFirst = broker.lookup("requestedFirst")
useRequestedFirst(37) // runtime error
function requestedFirst(y: any) {
	console.log("y=", y)
}
broker.register(requestedFirst)
useRequestedFirst(37) // y= 37