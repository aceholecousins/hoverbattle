
import {quat} from "gl-matrix"
import { Arena } from "./arena";
import { Skybox } from "./skybox";

export interface GraphicsController{
	update(time:number): void

	setArena(arena:Arena): void

	/** orient the scene with respect to the environment (background and reflections)*/
	setSceneOrientation(q:quat): void

	setEnvironment(env:Skybox): void
}
