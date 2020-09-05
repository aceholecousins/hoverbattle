import { Controller } from "./controller";

export interface ControllerManager {

	getAllConnectedControllers(): Controller[]

	addConnectionListener(connectionChanged: (controller: Controller, connected:boolean) => void): void

	removeConnectionListener(callbackToBeRemoved: any): void
}