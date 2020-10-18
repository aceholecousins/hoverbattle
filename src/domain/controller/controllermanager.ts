import { Controller } from "./controller";

export type ConnectionListener = (controller: Controller, connected:boolean) => void

export interface ControllerManager {

	addConnectionListener(connectionChanged: ConnectionListener): void

	removeConnectionListener(callbackToBeRemoved: ConnectionListener): void
}