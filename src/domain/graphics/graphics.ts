
import {ModelLoader} from "./model"
import {CameraFactory} from "./camera"
import {LightFactory} from "./light"
import {MeshFactory} from "./mesh"
import {GraphicsController} from "./graphicscontroller"
import { SkyboxLoader } from "./skybox"
import { ArenaLoader } from "./arena"

export interface Graphics{

	model: ModelLoader
	arena: ArenaLoader
	skybox: SkyboxLoader

	camera: CameraFactory
	light: LightFactory
	mesh: MeshFactory

	control: GraphicsController
}