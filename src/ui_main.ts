
import {bridge} from "worker/worker"
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {createGraphicsServer} from "adapters/graphics/graphicsbridge/graphicsserver"
import { DefaultControllerManager } from "adapters/controller/defaultcontrollermanager"
import { ControllerManagerServer } from "adapters/controller/controllerbridge/controllermanagerserver"

let graphics = new ThreeGraphics()
createGraphicsServer(graphics)

let controllerManagerServer = new ControllerManagerServer(new DefaultControllerManager(), "controllerManager")

function animate(time:number){
	requestAnimationFrame(animate)
	graphics.control.update(time)
	controllerManagerServer.update()
	bridge.sendAll()
}
requestAnimationFrame(animate)
