import { ControllerManager } from "domain/controller/controllermanager";
import { Controller } from "domain/controller/controller";

export class DefaultControllerManager implements ControllerManager {

	private connectedControllers:Map<string, Controller> = new Map()

	constructor(document:Document) {

	}

	getAllConnectedControllers(): Controller[] {
		return Array.from(this.connectedControllers.values())
	}
	addConnectionListener(connectionChanged: (controller: Controller, connected: boolean) => void): void {
		throw new Error("Method not implemented.");
	}
	removeConnectionListener(callbackToBeRemoved: any): void {
		throw new Error("Method not implemented.");
	}
	
}