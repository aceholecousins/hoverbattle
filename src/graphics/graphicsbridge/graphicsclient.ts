
import {Graphics} from "../graphics"
import {GraphicsObjectConfig} from "../graphicsobject"
import {GraphicsObjectHandle} from "./graphicsobjecthandle"
import {AssetConfig} from "../asset"
import {AssetHandle} from "./assethandle"
import {WorkerBridge, RemoteProc} from "../../worker/workerbridge"
import {UpdateBundler} from "./updatebundler"
import {Kind} from "../../utils"

export class GraphicsClient implements Graphics{
	private modelCounter = 0
	private graphicsObjectCounter = 0

	private _loadAssetOnServer:RemoteProc
	private _addObjectOnServer:RemoteProc
	private _syncObjectsOnServer:RemoteProc
	private _updateBundler:UpdateBundler

	constructor(bridge:WorkerBridge){
		this._loadAssetOnServer = bridge.createCaller("gfx.loadAsset")
		this._addObjectOnServer = bridge.createCaller("gfx.addObject")
		this._syncObjectsOnServer = bridge.createCaller("gfx.syncObjects")
		this._updateBundler = new UpdateBundler()
	}

	loadAsset<K extends Kind>(config:AssetConfig<K>):AssetHandle<K>{
		const index = this.modelCounter++
		this._loadAssetOnServer({index, config:config})
		let result = {kind:config.kind, index, file:config.file}
		return result
	}

	addObject<K extends Kind>(config:GraphicsObjectConfig<K>):GraphicsObjectHandle<K>{
		const index = this.graphicsObjectCounter++
		this._addObjectOnServer({index, config})
		let result = new GraphicsObjectHandle<K>(index, this._updateBundler, config)
		return result
	}
	
	update(){
		this._syncObjectsOnServer(this._updateBundler.popUpdates())
	}
}

