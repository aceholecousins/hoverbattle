import { Controller } from "domain/controller/controller";
import { bridge } from "worker/worker";
import { ControllerBridge } from "./controllerbridge";

export class ControllerServer {

	private controllerBridge: ControllerBridge

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

	update() {
		if (this.controllerBridge !== undefined) {
			this.controllerBridge.setAbsoluteDirection(this.controller.getAbsoluteDirection())
			this.controllerBridge.setTurnRate(this.controller.getTurnRate())
			this.controllerBridge.setThrust(this.controller.getThrust())
			this.controllerBridge.setShooting(this.controller.isShooting())
		}
	}
}
