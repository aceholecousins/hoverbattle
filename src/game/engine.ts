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

let engineInitCallbacks: ((e: Engine) => void)[] = []

export function onEngineReady(cb: (e: Engine) => void) {
	engineInitCallbacks.push(cb)
}

export function setEngine(e: Engine) {
	engine = e
	for (let cb of engineInitCallbacks) {
		cb(e)
	}
}

export function getEngine(): Engine{
	if (engine == null) {
		throw new Error("engine undefined")
	}
	return engine
}
