import { ConnectionListener, ControllerManager } from "domain/controller/controllermanager";
import { Controller } from "domain/controller/controller";
import { Keyboard } from "./keyboard";

export class DefaultControllerManager implements ControllerManager {

	private connectedControllers:Map<string, Controller> = new Map()
	private connectionListeners:Set<ConnectionListener> = new Set()

	constructor() {
		this.initKeyboard()

	}

	addConnectionListener(callback: ConnectionListener): void {
		this.connectionListeners.add(callback)
		for (const controller of this.connectedControllers.values()) {
			callback(controller, true)
		}
	}

	removeConnectionListener(callbackToBeRemoved: ConnectionListener): void {
		this.connectionListeners.delete(callbackToBeRemoved)
	}

	private initKeyboard():void {
		this.addController("keyboard", new Keyboard())
	}

	private addController(key:string, controller:Controller) {
		this.connectedControllers.set(key, controller)
		for (const callback of this.connectionListeners) {
			callback(controller, true)
		}
	}
	
}