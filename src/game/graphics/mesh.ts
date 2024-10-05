
import { Color, copyIfPresent } from "utils"
import { SceneNode, SceneNodeConfig } from "./scenenode"
import { Model } from "./asset"

export interface Mesh extends SceneNode<"mesh"> {
	baseColor: Color
	accentColor1: Color
	accentColor2: Color
}

export class MeshConfig extends SceneNodeConfig<"mesh"> {
	kind: "mesh" = "mesh"
	baseColor: Color = { r: 1, g: 1, b: 1 }
	accentColor1: Color = { r: 1, g: 0, b: 0 }
	accentColor2: Color = { r: 0, g: 1, b: 0 }

	constructor(config: Partial<MeshConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["baseColor", "accentColor1", "accentColor2"])
	}
}

export class ModelMeshConfig extends MeshConfig {
	model: Model
	constructor(config: Partial<MeshConfig> & Pick<ModelMeshConfig, "model">) {
		super(config)
		this.model = config.model
	}
}

export interface MeshFactory {
	createFromModel: (config: ModelMeshConfig) => Mesh
}