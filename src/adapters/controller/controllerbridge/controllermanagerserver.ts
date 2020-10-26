import { Controller } from "domain/controller/controller";
import { ControllerManager } from "domain/controller/controllermanager";
import { bridge } from "worker/worker";
import { ControllerManagerBridge } from "./controllerbridge";
import { ControllerServer } from "./controllerserver";

/**
 * Wraps the ControllerManager on the UI side with a layer to communication with a corresponding Client on
 * engine side.
 */
export class ControllerManagerServer {

	private newControllerCounter = 0

	private controllerManagerBridge: ControllerManagerBridge

	private controllerMap: Map<string, ControllerServer> = new Map()

	/**
	 * @param controllerManager The ControllerManager to wrap
	 * @param bridgeKey The communication key which has to match the corresponding client
	 */
	constructor(controllerManager: ControllerManager, bridgeKey: string) {
		controllerManager.addConnectionListener(this.controllerAdded.bind(this))
		this.initProxy(bridgeKey)
	}

	private async initProxy(bridgeKey: string) {
		try {
			this.controllerManagerBridge = await bridge.createProxy(bridgeKey)
			this.publishAllControllers()
		} catch (err) {
			console.error("Failed to create ControllerManagerBridge proxy for key " + bridgeKey + ". Reason: " + err)
		}
	}

	private publishAllControllers() {
		for (const bridgeKey of this.controllerMap.keys()) {
			this.controllerManagerBridge.controllerAdded(bridgeKey)
		}
	}

	private controllerAdded(controller: Controller) {
		let bridgeKey = this.createRandomBridgeKey()
		this.controllerMap.set(bridgeKey, new ControllerServer(controller, bridgeKey))
		if (this.controllerManagerBridge !== undefined) {
			this.controllerManagerBridge.controllerAdded(bridgeKey)
		}
	}

	private createRandomBridgeKey() {
		return "controller" + ++this.newControllerCounter;
	}

	/**
	 * Updates all managed ControllerServers.
	 * Has to be called on a regular basis.
	 */
	update() {
		for (const controllerServer of this.controllerMap.values()) {
			controllerServer.update()
		}
	}
}