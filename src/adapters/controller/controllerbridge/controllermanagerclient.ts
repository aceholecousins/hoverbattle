import { Controller } from "domain/controller/controller";
import { ConnectionListener, ControllerManager } from "domain/controller/controllermanager";
import { bridge } from "worker/worker";
import { ControllerManagerBridge } from "./controllerbridge";
import { createControllerClient } from "./controllerclient";

export async function createControllerManagerClient(bridgeKey:string):Promise<ControllerManager> {
	let client = new ControllerManagerClient()
	bridge.register(client, bridgeKey)
	return client
}

class ControllerManagerClient implements ControllerManagerBridge, ControllerManager{

	private connectedControllers:Map<string, Controller> = new Map()
	private connectionListeners:Set<ConnectionListener> = new Set()

	addConnectionListener(callback: ConnectionListener): void {
		this.connectionListeners.add(callback)
		for (const controller of this.connectedControllers.values()) {
			callback(controller, true)
		}
	}
	removeConnectionListener(callbackToBeRemoved: ConnectionListener): void {
		this.connectionListeners.delete(callbackToBeRemoved)
	}

	controllerAdded(bridgeKey: string): void {
		const controller = createControllerClient(bridgeKey);
		this.connectedControllers.set(bridgeKey, controller)
		for (const callback of this.connectionListeners) {
			callback(controller, true)
		}
	}
}