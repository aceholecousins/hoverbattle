
import {bridge} from "worker/worker"
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {createGraphicsServer} from "adapters/graphics/graphicsbridge/graphicsserver"
import { Keyboard } from "adapters/controller/keyboard"
import { ControllerServer, createControllerManagerServer } from "adapters/controller/controllerbridge/controllerserver"
import { DefaultControllerManager } from "adapters/controller/defaultcontrollermanager"

let graphics = new ThreeGraphics()
createGraphicsServer(graphics)

createControllerManagerServer(new DefaultControllerManager())
let keybaordServer = new ControllerServer(new Keyboard(), "keyboard")

function animate(time:number){
	requestAnimationFrame(animate)
	graphics.control.update(time)
	keybaordServer.update()
	bridge.sendAll()
}
requestAnimationFrame(animate)
