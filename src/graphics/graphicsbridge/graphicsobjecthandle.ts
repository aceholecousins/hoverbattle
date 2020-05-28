
import {vec3, quat} from "gl-matrix"
import {Color} from "../../utils"
import {Model, GraphicsObject, GraphicsObjectConfig, graphicsObjectDefaults} from "../graphicsobject"
import {UpdateBundler} from "./updatebundler"

export class ModelHandle implements Model{
	readonly index:number
	constructor(index:number){
		this.index = index
	}
}

export class GraphicsObjectHandle implements GraphicsObject{
	readonly index:number
	private _updateBundler:UpdateBundler

	constructor(
		index:number,
		updateBundler:UpdateBundler,
		config:GraphicsObjectConfig
	){
		const filledConfig:Required<GraphicsObjectConfig> =
			{...graphicsObjectDefaults, ...config}

		this.index = index
		this._updateBundler = updateBundler
		this._updateBundler.addUpdate(this.index, {addMe:true, ...filledConfig})
	}

	set kind(k:string){
		this._updateBundler.addUpdate(this.index, {kind:k})
	}

	set model(m:Model){
		this._updateBundler.addUpdate(this.index, {model:m})
	}

	set color(c:Color){
		this._updateBundler.addUpdate(this.index, {color:c})
	}

	set position(p:vec3){
		this._updateBundler.addUpdate(this.index, {position:p})
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