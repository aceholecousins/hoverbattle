
import * as THREE from "three"
import {GraphicsObject, GraphicsObjectConfig} from "domain/graphics/graphicsobject"
import {vec3, quat} from "gl-matrix"
import {Kind} from "utils"

export abstract class ThreeGraphicsObject<K extends Kind> implements GraphicsObject<K>{
	kind:K
	abstract threeObject:THREE.Object3D
	threeScene:THREE.Scene

	constructor(
		scene:THREE.Scene,
		config:GraphicsObjectConfig<K>
	){
		this.threeScene = scene

		this.kind = config.kind
		this.position = config.position
		this.orientation = config.orientation
		this.scaling = config.scaling
	}

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
