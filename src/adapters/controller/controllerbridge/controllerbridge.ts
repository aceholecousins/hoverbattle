import { Controller } from "domain/controller/controller";
import { ControllerClient } from "./controllerclient";

export interface ControllerBridge {

	setAbsoluteDirection(value:number):void
	setTurnRate(value:number):void
	setThrust(value:number):void
	setShooting(value:boolean):void
}

export interface ControllerManagerBridge {

	controllerAdded(bridgeKey:string):void
}