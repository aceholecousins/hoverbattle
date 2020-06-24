
import * as THREE from "three"
import {GraphicsObject, GraphicsObjectConfig, graphicsObjectDefaults} from "../../../domain/graphics/graphicsobject"
import {vec3, quat} from "gl-matrix"
import {Kind, Optionals, Color, Registry} from "../../../utils"

export abstract class ThreeGraphicsObject<K extends Kind> implements GraphicsObject<K>{
	kind:K
	abstract threeObject:THREE.Object3D
	threeScene:THREE.Scene

	set position(p:vec3){
		this.threeObject.position.set(p[0], p[1], p[2])
	}

	set orientation(q:quat){
		this.threeObject.quaternion.set(q[0], q[1], q[2], q[3])
	}

	set scaling(s:vec3){
		this.threeObject.scale.set(s[0], s[1], s[2])
	}

	remove(){
		this.threeScene.remove(this.threeObject)
	}
}


type ThreeObjectConstructor<K extends Kind> =
	new(scene:THREE.Scene, config: GraphicsObjectConfig<K>) => ThreeGraphicsObject<K>

class ThreeObjectFactory{

    private factories: Registry<ThreeObjectConstructor<any>> = {}

    register(kind: string, factory: ThreeObjectConstructor<any>): void {
        this.factories[kind] = factory
    }

    createObject<K extends Kind>(
		scene: THREE.Scene,
		config: GraphicsObjectConfig<K>
	): ThreeGraphicsObject<K> {
		if(!this.factories.hasOwnProperty(config.kind)){
			throw new Error("ThreeObjectFactory cannot create a " + config.kind)
		}
        return new this.factories[config.kind](scene, config)
    }
}

export const threeObjectFactory = new ThreeObjectFactory()