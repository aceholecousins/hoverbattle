import { Controller } from "domain/controller/controller";
import { bridge } from "worker/worker";
import { ControllerBridge } from "./controllerbridge";

/**
 * Wraps a Controller connected to the UI with a layer to communication with a corresponding Client on
 * engine side.
 */
export class ControllerServer {

	private controllerBridge: ControllerBridge

	/**
	 * @param controller The controller to wrap
	 * @param bridgeKey The communication key which has to match the corresponding client
	 */
	constructor(private controller: Controller, bridgeKey: string) {
		this.initProxy(bridgeKey)
	}

	private async initProxy(bridgeKey: string) {
		try {
			this.controllerBridge = await bridge.createProxy(bridgeKey)
		} catch (err) {
			console.error("Failed to create ControllerBridge proxy for key " + bridgeKey + ". Reason: " + err)
		}
	}

	/**
	 * Pushes all values of this Controller to the other bridge side.
	 * Has to be called on a regular basis.
	 */
	update() {
		if (this.controllerBridge !== undefined) {
			this.controllerBridge.setAbsoluteDirection(this.controller.getAbsoluteDirection())
			this.controllerBridge.setTurnRate(this.controller.getTurnRate())
			this.controllerBridge.setThrust(this.controller.getThrust())
			this.controllerBridge.setShooting(this.controller.isShooting())
		}
	}
}
