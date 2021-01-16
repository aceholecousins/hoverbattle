
// this class implements the interface of a WorkerBridge
// and is intended to be used when no actual worker is used

export class WorkerBridgeDummy{

	objectRegistry:{[key:string]:Object} = {}

	// proxies that were requested but not yet registered
	pendingProxies:{
		[key: string]: (()=>void)[] // array of promise resolver functions
	} = {}

	constructor(workerFile?:string){}

	sendAll(){}

	register(object:Object, name:string){
		this.objectRegistry[name] = object
		if(name in this.pendingProxies){
			for(let resolve of this.pendingProxies[name]){
				resolve()
			}
			this.pendingProxies[name]
		}
	}

	async createProxy(remoteKey: string){

		if(!isNaN(remoteKey as any)){
			throw new Error("numeric indices are reserved for anonymous objects")
		}
		if(remoteKey in this.objectRegistry){
			return this.objectRegistry[remoteKey]
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
						resolve(this.objectRegistry[remoteKey])
					}
				)
			})
		}
	}
}