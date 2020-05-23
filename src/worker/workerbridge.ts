
import{Registry} from "../utils"

// plain old data object that can be transferred using postMessage:
interface PodObject{
	[index:number]:Pod
	[index:string]:Pod
}
export type Pod = number | string | PodObject

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

	makeCaller(name:string){
		if(this.worker === null){
			return function(arg:Pod){
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