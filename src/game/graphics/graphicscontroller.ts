
import { vec3 } from "gl-matrix"
import { Skybox } from "./asset";

export interface GraphicsController {
	update(): void
	setEnvironment(env: Skybox): void
	setEnvironmentOrientation(ypr: vec3): void
}
