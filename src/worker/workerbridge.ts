
import{Registry} from "utils"

// plain old data object that can be transferred using postMessage:
/* TODO
type PodArray = Pod[]
type PodObject = Partial<{ [index:string]:Pod }>
export type Pod = number | string | PodArray | PodObject
///////////////
type PodObject<T> = { [K in keyof T]:Pod<T[K]> }
type Pod<T> = T extends boolean | number | string? T:
    T extends Function? never:
    T extends Object? PodObject<T>:
	never
*/
type Pod = any

// remote procedure that wants a pod argument:
export type RemoteProc = (arg: Pod) => void

export class WorkerBridge{
	private dispatchRegistry:Registry<RemoteProc> = {}
	private worker:Worker = null

	// leave empty if we are inside a worker
	// and want a bridge to the window
	constructor(worker?:Worker){
		if(typeof(worker) !== "undefined"){
			this.worker = worker
			this.worker.onmessage = this.dispatch
		}
		else{
			onmessage = this.dispatch
		}
	}

	createCaller(name:string){
		if(this.worker === null){
			return function(arg:Pod){
				// postMessage has different syntax on window and worker
				// so the call below throws a typescript error
				//@ts-ignore
				postMessage({fn:name, arg:arg})
			}
		}
		else{
			return function(arg:Pod){
				this.worker.postMessage({fn:name, arg:arg})
			}
		}
	}

	registerProcedure(proc:RemoteProc, name:string = proc.name){
		if(this.dispatchRegistry.hasOwnProperty(name)){
			console.error("overwriting procedure " + name)
		}
		this.dispatchRegistry[name] = proc
	}

	dispatch(event:any){
		let fn:string = event.data.fn
		let arg:Pod = event.data.arg
		if(this.dispatchRegistry.hasOwnProperty(fn)){
			this.dispatchRegistry[fn](arg)
		}
		else{
			console.error(fn + " was called on worker bridge but is not registered")
		}
	}
}