import { Controller } from "domain/controller/controller";
import { bridge } from "worker/worker";
import { CONTROLLER_SERVER_KEY } from "./controllerserver";

export function createControllerClient() {
	return bridge.createProxy(CONTROLLER_SERVER_KEY) as Controller
}