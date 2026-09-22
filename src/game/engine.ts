import { ActionCam } from "./actioncam";
import { ControllerManager } from "./controller/controllermanager";
import { Graphics } from "./graphics/graphics";
import { Physics } from "./physics/physics";
import { SoundLoader } from "./sound";

export interface Engine {
	graphics: Graphics,
	physics: Physics,
	controllerManager: ControllerManager,
	actionCam: ActionCam,
	loadSound: SoundLoader,
}

let engine: Engine | null = null

export function setEngine(e: Engine) {
	engine = e
}

export function getEngine(): Engine{
	if (engine == null) {
		throw new Error("engine undefined")
	}
	return engine
}
