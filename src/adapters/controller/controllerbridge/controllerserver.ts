import { Controller } from "domain/controller/controller";
import { ControllerManager } from "domain/controller/controllermanager";
import { bridge } from "worker/worker";
import { ControllerBridge } from "./controllerbridge";

export function createControllerManagerServer(controllerManager:ControllerManager) {
	bridge.register(controllerManager, "controllerManager")
}

export class ControllerServer {

	private controllerBridge:ControllerBridge

	constructor(private controller:Controller, bridgeKey:string) {
		bridge.createProxy(bridgeKey)
			.then(it => this.controllerBridge = it)
			.catch(reason => console.error("Failed to create ControllerBridge proxy for key " + bridgeKey + ". Reason: " + reason))
	}

	update() {
		if(this.controllerBridge !== undefined) {
			this.controllerBridge.setAbsoluteDirection(this.controller.getAbsoluteDirection())
			this.controllerBridge.setTurnRate(this.controller.getTurnRate())
			this.controllerBridge.setThrust(this.controller.getThrust())
			this.controllerBridge.setShooting(this.controller.isShooting())
		}
	}
}