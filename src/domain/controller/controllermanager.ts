import { Controller } from "./controller";

export type ConnectionListener = (controller: Controller, connected:boolean) => void

export interface ControllerManager {

	addConnectionListener(callback: ConnectionListener): void

	removeConnectionListener(callbackToBeRemoved: ConnectionListener): void
}