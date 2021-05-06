
import {ModelLoader} from "./model"
import {CameraFactory} from "./camera"
import {LightFactory} from "./light"
import {MeshFactory} from "./mesh"
import {GraphicsController} from "./graphicscontroller"
import { SkyboxLoader } from "./skybox"
import { SpriteLoader } from "./sprite"
import { FxFactory } from "./fx"

export interface Graphics{

	model: ModelLoader
	skybox: SkyboxLoader
	sprite: SpriteLoader

	camera: CameraFactory
	light: LightFactory
	mesh: MeshFactory

	fx: FxFactory

	control: GraphicsController
}