
import {Color} from "utils"
import {SceneNode, SceneNodeConfig} from "./scenenode"
import {Asset} from "./asset"

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

export class ModelConfig extends MeshConfig{
	asset:Asset<"model">
	constructor(config: Partial<MeshConfig> & Pick<ModelConfig, "asset">){
		super(config)
		this.asset = config.asset
	}
}

export interface MeshFactory{
	createFromModel: (config:ModelConfig) => Mesh
}