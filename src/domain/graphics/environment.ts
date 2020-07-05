
import {GraphicsObject, GraphicsObjectConfig} from "./graphicsobject"
import {Asset} from "./asset"

export interface Skybox extends GraphicsObject<"skybox">{
	kind:"skybox"
}

export class SkyboxConfig extends GraphicsObjectConfig<"skybox">{
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
