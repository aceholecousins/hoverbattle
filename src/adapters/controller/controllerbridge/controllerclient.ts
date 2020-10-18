import { Controller } from "domain/controller/controller";
import { ControllerManager } from "domain/controller/controllermanager";
import { bridge } from "worker/worker";
import { ControllerBridge } from "./controllerbridge";

export async function createControllerManagerClient():Promise<ControllerManager> {
	return await bridge.createProxy("controllerManager") as ControllerManager
}

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