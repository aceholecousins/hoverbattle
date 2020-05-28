
import {Graphics} from "../graphics"
import {GraphicsObjectConfig} from "../graphicsobject"
import {ModelHandle, GraphicsObjectHandle} from "./graphicsobjecthandle"
import {WorkerBridge, RemoteProc} from "../../worker/workerbridge"
import {UpdateBundler} from "./updatebundler"

export class GraphicsClient implements Graphics{
	private modelCounter = 0
	private graphicsObjectCounter = 0

	private _loadModelOnServer:RemoteProc
	private _addObjectOnServer:RemoteProc
	private _syncObjectsOnServer:RemoteProc
	private _updateBundler:UpdateBundler

	constructor(bridge:WorkerBridge){
		this._loadModelOnServer = bridge.createCaller("gfx.loadModel")
		this._addObjectOnServer = bridge.createCaller("gfx.addObject")
		this._syncObjectsOnServer = bridge.createCaller("gfx.syncObjects")
		this._updateBundler = new UpdateBundler()
	}

	loadModel(file:string){
		const index = this.modelCounter++
		this._loadModelOnServer({index, file})
		let result = new ModelHandle(index)
		return result
	}

	addObject(config:GraphicsObjectConfig){
		const index = this.graphicsObjectCounter++
		this._addObjectOnServer({index})
		let result = new GraphicsObjectHandle(index, this._updateBundler, config)
		return result
	}
	
	update(){
		this._syncObjectsOnServer(this._updateBundler.popUpdates())
	}
}

