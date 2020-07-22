
import {SceneNode, SceneNodeConfig} from "./scenenode"
import {Asset} from "./asset"

export interface Skybox extends SceneNode<"skybox">{
	kind:"skybox"
}

export class SkyboxConfig extends SceneNodeConfig<"skybox">{
	kind:"skybox" = "skybox"
	asset: Asset<"cubetexture">

	constructor(config: Partial<SkyboxConfig> & Pick<SkyboxConfig, "asset">){
		super(config)
		this.asset = config.asset
	}
}

export interface EnvironmentFactory{
	create: (config: SkyboxConfig) => Skybox
}
