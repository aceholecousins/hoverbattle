
import {vec3, quat} from "gl-matrix"
import {Kind} from "../utils"
import {GraphicsObject, GraphicsObjectConfig} from "../domain/graphics/graphicsobject"
import {UpdateBundler} from "./updatebundler"

export class GraphicsObjectHandle<K extends Kind> implements GraphicsObject<K>{
	kind:K
	index:number
	private _updateBundler:UpdateBundler

	constructor(
		index:number,
		updateBundler:UpdateBundler,
		config:GraphicsObjectConfig<K>
	){
		this.kind = config.kind
		this.index = index
		this._updateBundler = updateBundler
	}

	set position(p:vec3){
		this._updateBundler.addUpdate<K>(this.index, {position:p})
	}

	set orientation(q:quat){
		this._updateBundler.addUpdate(this.index, {orientation:q})
	}

	set scaling(s:vec3){
		this._updateBundler.addUpdate(this.index, {scaling:s})
	}

	remove(){
		this._updateBundler.addUpdate(this.index, {removeMe:true})
	}
}