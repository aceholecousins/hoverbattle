
import * as THREE from "three"
import {SceneNode, SceneNodeConfig} from "game/graphics/scenenode"
import {vec3, quat} from "gl-matrix"
import {Kind, copy} from "utils"

export abstract class ThreeSceneNode<K extends Kind> implements SceneNode<K>{
	kind:K
	threeScene:THREE.Scene
	threeObject:THREE.Object3D
	
	constructor(
		scene:THREE.Scene,
		object:THREE.Object3D,
		config:SceneNodeConfig<K>
	){
		this.threeScene = scene
		this.threeObject = object
		scene.add(object)

		copy(this, config, ["kind", "position", "orientation", "scaling"])
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
