
import {ModelLoader} from "./model"
import {CameraFactory} from "./camera"
import {LightFactory} from "./light"
import {MeshFactory} from "./mesh"
import {EnvironmentFactory} from "./environment"
import {GraphicsController} from "./graphicscontroller"

export interface Graphics{

	model: ModelLoader

	camera: CameraFactory
	light: LightFactory
	mesh: MeshFactory
	//environment: EnvironmentFactory

	control: GraphicsController
}