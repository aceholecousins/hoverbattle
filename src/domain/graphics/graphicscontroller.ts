
import {quat} from "gl-matrix"
import { Skybox } from "./skybox";

export interface GraphicsController{
	update(time:number): void

	/** orient the scene with respect to the environment (background and reflections)*/
	setSceneOrientation(q:quat): void

	setEnvironment(env:Skybox): void
}
