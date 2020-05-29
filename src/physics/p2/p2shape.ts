import {Shape, ShapeConfig, shapeDefaults} from "../shape"
import * as p2 from "p2"
import { vec2 } from "gl-matrix"
import {Kind} from "../../utils"

export abstract class P2Shape<K extends Kind> implements Shape<K>{
	kind: K
	
	abstract p2shape: p2.Shape

	constructor(config: ShapeConfig<K>){
		const filledConfig:Required<ShapeConfig<K>> =
			{...shapeDefaults, ...config}

		Object.assign(this, filledConfig)
	}
	
	updateP2(){
		this.p2shape.updateBoundingRadius()
		this.p2shape.body.aabbNeedsUpdate = true
		this.p2shape.body.updateBoundingRadius()
	}

	set offset(p: vec2){
		vec2.copy(this.p2shape.position, p)
	}
	get offset(){
		return vec2.clone(this.p2shape.position)
	}

	set offsetAngle(phi: number){
		this.p2shape.angle = phi
	}
	get offsetAngle(){
		return this.p2shape.angle
	}

	abstract boundingRadius: number
}