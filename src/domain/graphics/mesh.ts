
import {Color} from "utils"
import {SceneNode, SceneNodeConfig} from "./scenenode"
import {Model} from "./model"

export interface Mesh extends SceneNode<"mesh">{
	baseColor: Color
	accentColor: Color
}

export class MeshConfig extends SceneNodeConfig<"mesh">{
	kind: "mesh" = "mesh"
	baseColor: Color
	accentColor: Color

	constructor(config: Partial<MeshConfig> = {}){
		super(config)
		if("baseColor" in config){this.baseColor = config.baseColor}
		if("accentColor" in config){this.accentColor = config.accentColor}
	}
}

export class ModelMeshConfig extends MeshConfig{
	asset:Model
	constructor(config: Partial<MeshConfig> & Pick<ModelMeshConfig, "asset">){
		super(config)
		this.asset = config.asset
	}
}

export interface MeshFactory{
	createFromModel: (config:ModelMeshConfig) => Mesh
}