import {Shape, ShapeConfig} from "domain/physics/shape"
import * as p2 from "p2"
import { vec2 } from "gl-matrix"
import {Kind, Registry} from "utils"

export abstract class P2Shape<K extends Kind> implements Shape<K>{
	kind: K
	
	abstract p2shape: p2.Shape
	
	updateP2(){
		this.p2shape.updateBoundingRadius()
		if(this.p2shape.body !== null){ // when called before the shape was added to the body
			this.p2shape.body.aabbNeedsUpdate = true
			this.p2shape.body.updateBoundingRadius()
		}
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


// factory for distinct shape types
// where shape modules can register their individual factories
type P2ShapeConstructor<K extends Kind> = new(config: ShapeConfig<K>) => P2Shape<K>

class P2ShapeFactory{

    private factories: Registry<P2ShapeConstructor<any>> = {}

    register(kind: string, factory: P2ShapeConstructor<any>): void {
        this.factories[kind] = factory
    }

    createShape<K extends Kind>(config: ShapeConfig<K>): P2Shape<K> {
		if(!this.factories.hasOwnProperty(config.kind)){
			throw new Error("P2ShapeFactory cannot create a " + config.kind)
		}
        return new this.factories[config.kind](config)
    }
}

export const p2shapeFactory = new P2ShapeFactory()
