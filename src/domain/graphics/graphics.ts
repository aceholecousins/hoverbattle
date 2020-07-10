
import {AssetLoader} from "./asset"
import {CameraFactory} from "./camera"
import {LightFactory} from "./light"
import {MeshFactory} from "./mesh"
import {EnvironmentFactory} from "./environment"
import {GraphicsController} from "./graphicscontroller"

export interface Graphics{
	asset: AssetLoader
	camera: CameraFactory
	light: LightFactory
	mesh: MeshFactory
	environment: EnvironmentFactory
	control: GraphicsController
}