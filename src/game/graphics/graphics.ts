
import { ModelLoader, SpriteLoader, SkyboxLoader } from "./asset"
import { CameraFactory } from "./camera"
import { LightFactory } from "./light"
import { MeshFactory } from "./mesh"
import { Skybox } from "./asset";
import { Water } from "./water";
import { vec3 } from "gl-matrix"

export interface Graphics {

	loadModel: ModelLoader
	loadSprite: SpriteLoader
	loadSkybox: SkyboxLoader

	camera: CameraFactory
	light: LightFactory
	mesh: MeshFactory

	water: Water

	setEnvironment(env: Skybox): void
	setEnvironmentOrientation(ypr: vec3): void

	update(): void

	drawDebugLine(points: vec3[]): void
}