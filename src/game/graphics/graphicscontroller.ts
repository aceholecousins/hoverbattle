
import { quat } from "gl-matrix"
import { Skybox } from "./asset";

export interface GraphicsController {
	update(time: number): void

	/** orient the scene with respect to the environment (background and reflections)*/
	setSceneOrientation(q: quat): void

	setEnvironment(env: Skybox): void
}
