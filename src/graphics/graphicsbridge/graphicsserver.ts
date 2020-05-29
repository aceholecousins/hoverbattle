
import {Graphics} from "../graphics"
import {GraphicsObject, GraphicsObjectConfig} from "../graphicsobject"
import {GraphicsObjectUpdate} from "./updatebundler"
import {Asset, AssetConfig} from "../asset"
import {WorkerBridge} from "../../worker/workerbridge"

export class GraphicsServer{

	private assets:Asset<any>[] = []
	private objects:GraphicsObject<any>[] = []
	private engine:Graphics

	constructor(bridge:WorkerBridge, engine:Graphics){
		this.engine = engine
		bridge.registerProcedure(this.loadModel, "gfx.loadAsset")
		bridge.registerProcedure(this.addObject, "gfx.addObject")
		bridge.registerProcedure(this.syncObjects, "gfx.syncObjects")
	}

	loadModel({index, config}:{index:number, config:AssetConfig<any>}){
		this.assets[index] = this.engine.loadAsset<any>(config)
	}

	addObject({index, config}:{index:number, config:GraphicsObjectConfig<any>}){
		this.objects[index] = this.engine.addObject<any>(config)
	}

	syncObjects(updates:GraphicsObjectUpdate<any>[]){
		for(const i in updates){
			const update = updates[i]
			if(update.removeMe){
				this.objects[i].remove()
				delete(this.objects[i])
			}
			else{
				Object.assign(this.objects[i], update)
			}
		}
	}
}
