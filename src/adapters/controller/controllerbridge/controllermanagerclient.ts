import { Controller } from "domain/controller/controller";
import { ConnectionCallback, ControllerManager } from "domain/controller/controllermanager";
import { bridge } from "worker/worker";
import { ControllerManagerBridge } from "./controllerbridge";
import { createControllerClient } from "./controllerclient";

/**
 * Creates a client in the engine for the ControllerManager on the UI side.
 * 
* @param bridgeKey Key to identify the ControllerManager. Has to match the ControllerManagerServer on the UI side.
 */
export function createControllerManagerClient(bridgeKey:string):ControllerManager {
	let client = new ControllerManagerClient()
	bridge.register(client, bridgeKey)
	return client
}

class ControllerManagerClient implements ControllerManagerBridge, ControllerManager{

	private connectedControllers:Set<Controller> = new Set()
	private connectionCallbacks:Set<ConnectionCallback> = new Set()

	addConnectionCallback(callback: ConnectionCallback): void {
		this.connectionCallbacks.add(callback)
		for (const controller of this.connectedControllers) {
			callback(controller)
		}
	}
	removeConnectionCallback(callbackToBeRemoved: ConnectionCallback): void {
		this.connectionCallbacks.delete(callbackToBeRemoved)
	}

	controllerAdded(bridgeKey: string): void {
		const controller = createControllerClient(bridgeKey);
		this.connectedControllers.add(controller)
		for (const callback of this.connectionCallbacks) {
			callback(controller)
		}
	}
}