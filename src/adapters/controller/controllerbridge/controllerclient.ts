import { Controller } from "domain/controller/controller";
import { bridge } from "worker/worker";
import { ControllerBridge } from "./controllerbridge";

/**
 * Creates a new client in the engine for a Controller which is connected to the UI
 * 
 * @param bridgeKey Key to identify the Controller. Has to match the ControllerServer on the UI side.
 */
export function createControllerClient(bridgeKey:string):Controller {
	let controllerClient = new ControllerClient()
	bridge.register(controllerClient, bridgeKey)
	return controllerClient
}

class ControllerClient implements ControllerBridge, Controller {
	
	private absobulteDirection:number
	private turnRate:number
	private thrust:number = 0
	private shooting:boolean = false
	
	getAbsoluteDirection(): number {
		return this.absobulteDirection
	}
	getTurnRate(): number {
		return this.turnRate
	}
	getThrust(): number {
		return this.thrust
	}
	isShooting(): boolean {
		return this.shooting
	}
	setPauseCallback(callback: () => void): void {
		throw new Error("Method not implemented.");
	}
	
	setAbsoluteDirection(value: number): void {
		this.absobulteDirection = value
	}
	setTurnRate(value: number): void {
		this.turnRate = value
	}
	setThrust(value: number): void {
		this.thrust = value
	}
	setShooting(value: boolean): void {
		this.shooting = value
	}
}