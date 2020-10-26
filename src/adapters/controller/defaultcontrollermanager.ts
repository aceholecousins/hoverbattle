import { ConnectionCallback, ControllerManager } from "domain/controller/controllermanager";
import { Controller } from "domain/controller/controller";
import { Keyboard } from "./keyboard";

export class DefaultControllerManager implements ControllerManager {

	private connectedControllers:Map<string, Controller> = new Map()
	private connectionCallbacks:Set<ConnectionCallback> = new Set()

	constructor() {
		this.initKeyboard()
	}

	addConnectionCallback(callback: ConnectionCallback): void {
		this.connectionCallbacks.add(callback)
		for (const controller of this.connectedControllers.values()) {
			callback(controller)
		}
	}

	removeConnectionCallback(callbackToBeRemoved: ConnectionCallback): void {
		this.connectionCallbacks.delete(callbackToBeRemoved)
	}

	private initKeyboard():void {
		this.addController("keyboard", new Keyboard())
	}

	private addController(key:string, controller:Controller) {
		this.connectedControllers.set(key, controller)
		for (const callback of this.connectionCallbacks) {
			callback(controller)
		}
	}
	
}