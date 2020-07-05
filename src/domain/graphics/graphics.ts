
import {AssetLoader} from "./asset"
import {CameraFactory} from "./camera"
import {LightFactory} from "./light"
import {ModelFactory} from "./model"
import {EnvironmentFactory} from "./environment"
import {GraphicsController} from "./graphicscontroller"

export interface Graphics{
	asset: AssetLoader
	camera: CameraFactory
	light: LightFactory
	model: ModelFactory
	environment: EnvironmentFactory
	control: GraphicsController
}