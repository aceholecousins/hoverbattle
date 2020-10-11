import { Controller } from "domain/controller/controller";
import { bridge } from "worker/worker";

export const CONTROLLER_SERVER_KEY = "controllerServer"

export function createControllerServer(controller:Controller) {
	bridge.register(controller, CONTROLLER_SERVER_KEY)
}