
import { ModelLoader, SpriteLoader, SkyboxLoader } from "./asset"
import { CameraFactory } from "./camera"
import { LightFactory } from "./light"
import { MeshFactory } from "./mesh"
import { GraphicsController } from "./graphicscontroller"
import { FxFactory } from "./fx"

export interface Graphics {

	loadModel: ModelLoader
	loadSprite: SpriteLoader
	loadSkybox: SkyboxLoader

	camera: CameraFactory
	light: LightFactory
	mesh: MeshFactory

	fx: FxFactory

	control: GraphicsController
}