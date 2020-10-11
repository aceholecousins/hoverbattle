import { Controller } from "domain/controller/controller";
import { bridge } from "worker/worker";
import { ControllerBridge } from "./controllerbridge";

export function createControllerClient(bridgeKey:string):Controller {
	let controllerClient = new ControllerClient()
	bridge.register(controllerClient, bridgeKey)
	return controllerClient
}

class ControllerClient implements ControllerBridge, Controller {
	
	private thrust:number = 0

	getAbsoluteDirection(): number {
		return 0
	}
	getTurnRate(): number {
		return 0
	}
	getThrust(): number {
		return this.thrust
	}
	isShooting(): boolean {
		return false
	}
	setPauseCallback(callback: () => void): void {
		
	}

	setThrust(value: number): void {
		this.thrust = value
	}
}