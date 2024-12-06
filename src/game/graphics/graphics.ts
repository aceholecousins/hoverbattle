
import { ModelLoader, SpriteLoader, SkyboxLoader } from "./asset"
import { CameraFactory } from "./camera"
import { LightFactory } from "./light"
import { MeshFactory } from "./mesh"
import { Skybox } from "./asset";
import { Water } from "./water";
import { Vector3, Euler } from "math"
import { Color } from "utils/color";

export interface Graphics {

	loadModel: ModelLoader
	loadSprite: SpriteLoader
	loadSkybox: SkyboxLoader

	camera: CameraFactory
	light: LightFactory
	mesh: MeshFactory

	water: Water

	setEnvironment(env: Skybox): void
	setEnvironmentOrientation(ori: Euler): void

	update(): void

	drawDebugLine(points: Vector3[], color:Color): void
}