import { Controller } from "domain/controller/controller";
import { ControllerManager } from "domain/controller/controllermanager";
import { bridge } from "worker/worker";
import { ControllerManagerBridge } from "./controllerbridge";
import { ControllerServer } from "./controllerserver";

export class ControllerManagerServer{

	private newControllerCounter = 0

	private controllerManagerBridge:ControllerManagerBridge

	private controllerMap:Map<string,ControllerServer> = new Map()

	constructor(controllerManager:ControllerManager, bridgeKey:string) {

		controllerManager.addConnectionListener(this.controllerAdded.bind(this))

		bridge.createProxy(bridgeKey)
			.then(it => {
				this.controllerManagerBridge = it
				this.publishAllControllers()
			})
			.catch(reason => console.error("Failed to create ControllerManagerBridge proxy for key " + bridgeKey + ". Reason: " + reason))
	}
	private publishAllControllers() {
		for (const bridgeKey of this.controllerMap.keys()) {
			this.controllerManagerBridge.controllerAdded(bridgeKey)
		}
	}

	private controllerAdded(controller: Controller) {
		let bridgeKey = "controller" + ++this.newControllerCounter
		this.controllerMap.set(bridgeKey, new ControllerServer(controller, bridgeKey)			)
		if(this.controllerManagerBridge !== undefined) {
			this.controllerManagerBridge.controllerAdded(bridgeKey)
		}
	}

	update() {
		for (const controllerServer of this.controllerMap.values()) {
			controllerServer.update()
		}
	}
}