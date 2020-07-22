
import {vec3, quat} from "gl-matrix"
import {Kind} from "utils"

export interface SceneNode<K extends Kind>{
	kind:K
	position?:vec3
	orientation?:quat
	scaling?:vec3
	remove():void
}

export class SceneNodeConfig<K extends Kind>{
	kind: K
	position = vec3.fromValues(0, 0, 0)
	orientation = quat.fromValues(0, 0, 0, 1)
	scaling = vec3.fromValues(1, 1, 1)

	constructor(config:Partial<SceneNodeConfig<K>> = {}){
		this.kind = config.kind
		if("position" in config){this.position = config.position}
		if("orientation" in config){this.orientation = config.orientation}
		if("scaling" in config){this.scaling = config.scaling}
	}
}