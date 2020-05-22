
//@ts-ignore
self["isWorker"] = typeof(window) === "undefined"
let isWorker = self["isWorker"]

if(!isWorker){
	self["mainWorker"] = new Worker("worker.js");
}

console.log(self)
self["dynamicImport"] = function(url:string, onLoad:(data:any)=>void){
	var req = new XMLHttpRequest();
	req.addEventListener("load", function(){
		let js = this.responseText
		self["exports"] = undefined
		eval(js)
		let data = self["exports"]
		self["exports"] = undefined
		if(typeof(onLoad) !== "undefined"){
			onLoad(data)
		}
	});
	req.open("GET", url);
	req.send();
}

// plain old data
interface PodObject{
	[index:number]:Pod
	[index:string]:Pod
}
type Pod = number | string | PodObject
type RemoteProc = (arg:Pod)=>void
type Registry<T> = { [index: string]: T }

function hash(arg:any){
	let s = arg.toString()
	return s.split('').reduce((a:any,b:any)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
}

class Dispatcher{
	private registry:Registry<RemoteProc> = {}

	constructor(){
		let that = this
		let handler = function(msg:any){
			that.registry[msg.data.fnhash](msg.data.arg)
		}
		if(self["isWorker"]){
			onmessage = handler
		}
		else{
			self["mainWorker"].onmessage = handler
		}
	}

	register(fn:RemoteProc){
		this.registry[hash(fn)] = fn
	}
}
let dispatcher = new Dispatcher()

self["workerFunction"] = function(fn:RemoteProc){
	if(self["isWorker"]){
		dispatcher.register(fn)
		return fn
	}
	else{
		return function(arg:Pod){
			self["mainWorker"].postMessage({fnhash:hash(fn), arg:arg})
		}
	}
}

self["windowFunction"] = function(fn:RemoteProc){
	if(self["isWorker"]){
		return function(arg:Pod){
			//@ts-ignore
			postMessage({fnhash:hash(fn), arg:arg})
		}
	}
	else{
		dispatcher.register(fn)
		return fn
	}
}

