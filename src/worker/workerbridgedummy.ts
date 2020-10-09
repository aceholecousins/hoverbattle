
// this class implements the interface of a WorkerBridge
// and is intended to be used when no actual worker is used

export class WorkerBridgeDummy{

	objectRegistry:{[key:string]:Object} = {}

	constructor(workerFile?:string){}

	sendAll(){}

	register(object:Object, name:string){
		this.objectRegistry[name] = object
	}

	createProxy(remoteKey: string){
		if(!isNaN(remoteKey as any)){
			throw new Error("numeric indices are reserved for anonymous objects")
		}
		return this.objectRegistry[remoteKey]
	}

}