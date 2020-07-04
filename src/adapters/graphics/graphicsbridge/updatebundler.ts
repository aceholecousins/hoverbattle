
import {Kind} from "utils"
import {GraphicsObject} from "domain/graphics/graphicsobject"

export interface GraphicsObjectUpdate<K extends Kind> extends Partial<GraphicsObject<K>>{
	removeMe?:boolean
}

export class UpdateBundler{
	private updates:GraphicsObjectUpdate<any>[] = []
	
	// copy all fields from whatever kind of GraphicsObject
	addUpdate<K extends Kind>(index:number, update:GraphicsObjectUpdate<K>):void{
		if(!(index in this.updates)){
			this.updates[index] = update
		}
		else{
			Object.assign(this.updates[index], update)
		}
	}

	popUpdates():GraphicsObjectUpdate<any>[]{
		const result = this.updates
		this.updates = []
		return result
	}
}