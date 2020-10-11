import { Controller } from "domain/controller/controller";
import { bridge } from "worker/worker";
import { ControllerBridge } from "./controllerbridge";

export class ControllerServer {

	private controllerBridge:ControllerBridge

	constructor(private controller:Controller, bridgeKey:string) {
		this.controllerBridge = bridge.createProxy(bridgeKey)
	}

	update() {
		this.controllerBridge.setThrust(this.controller.getThrust())
	}
}