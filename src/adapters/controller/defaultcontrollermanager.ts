import { ConnectionCallback, ControllerManager } from "game/controller/controllermanager";
import { Controller } from "game/controller/controller";
import { Keyboard } from "./keyboard";

export class DefaultControllerManager implements ControllerManager {

	private connectedControllers: Set<Controller> = new Set()
	private connectionCallbacks: Set<ConnectionCallback> = new Set()

	constructor() {
		this.initKeyboard()
	}

	addConnectionCallback(callback: ConnectionCallback): void {
		this.connectionCallbacks.add(callback)
		for (const controller of this.connectedControllers) {
			callback(controller)
		}
	}

	removeConnectionCallback(callbackToBeRemoved: ConnectionCallback): void {
		this.connectionCallbacks.delete(callbackToBeRemoved)
	}

	private initKeyboard(): void {
		this.addController(new Keyboard())
		this.addController(new Keyboard({
			up: "ArrowUp",
			down: "ArrowDown",
			right: "ArrowRight",
			left: "ArrowLeft",
			shoot: "ControlRight",
			pause: "Pause",
			switchMode: "ShiftRight",
		}))
	}

	private addController(controller: Controller) {
		this.connectedControllers.add(controller)
		for (const callback of this.connectionCallbacks) {
			callback(controller)
		}
	}

}