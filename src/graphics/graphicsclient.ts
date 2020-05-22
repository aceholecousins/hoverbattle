
import {vec3, quat} from "gl-matrix"
import {Color} from "../utils"
import {GraphicsObjectUpdate} from "./commongraphics"

class Model{
	static list:Model[] = []
	index:number

	constructor(file:string){
		this.index = Model.list.length
		Model.list.push(this)
		postMessage({ // TODO: Have a beautiful bridge between worker and dom
			kind:"loadmodel",
			source:file
		}, "")
	}
}

export class GraphicsObject{
	static list:GraphicsObject[]
	index:number
	
	private _model:Model
	private _color:Color = {r:1, g:1, b:1}

	private _position:vec3 = vec3.fromValues(0, 0, 0)
	private _orientation:quat = quat.fromValues(0, 0, 0, 1)
	private _scale:vec3 = vec3.fromValues(1, 1, 1)

	private _needsSync = true

	constructor(model:Model){
		this._model = model
		this.index = GraphicsObject.list.length
		GraphicsObject.list.push(this)
	}

	set color(c:Color){
		this._color = c
		this._needsSync = true
	}

	set position(p:vec3){
		vec3.copy(this._position, p)
		this._needsSync = true
	}

	set orientation(q:quat){
		quat.normalize(this._orientation, q)
		this._needsSync = true
	}

	set scale(s:vec3 | number){
		if(typeof(s) === "number"){
			vec3.set(this._scale, s, s, s)
		}
		else{
			vec3.copy(this._scale, s)
		}
		this._needsSync = true
	}

	static syncAllObjects(){
		let message:GraphicsObjectUpdate[] = []
		for(let obj of GraphicsObject.list){
			if(obj._needsSync){
				message.push({
					index:obj.index,
					color:obj._color,
					position:obj._position,
					orientation:obj._orientation,
					scale:obj._scale
				})
				obj._needsSync = false
			}
		}
		postMessage({kind:"syncobjects", data:message}, "")
	}
}