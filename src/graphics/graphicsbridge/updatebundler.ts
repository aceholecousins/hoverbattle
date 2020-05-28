
import {GraphicsObjectConfig} from "../graphicsobject"

export interface GraphicsObjectUpdate extends GraphicsObjectConfig{
	addMe?:boolean
	removeMe?:boolean
}

export class UpdateBundler{
	private updates:GraphicsObjectUpdate[] = []
	
	addUpdate(index:number, update:GraphicsObjectUpdate):void{
		if(!(index in this.updates)){
			this.updates[index] = update
		}
		else{
			Object.assign(this.updates[index], update)
		}
	}

	popUpdates():GraphicsObjectUpdate[]{
		const result = this.updates
		this.updates = []
		return result
	}
}