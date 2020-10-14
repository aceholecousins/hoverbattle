
import {bridge} from "worker/worker"
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {createGraphicsServer} from "adapters/graphics/graphicsbridge/graphicsserver"
import { Keyboard } from "adapters/controller/keyboard"
import { ControllerServer } from "adapters/controller/controllerbridge/controllerserver"

let graphics = new ThreeGraphics()
createGraphicsServer(graphics)

let keybaordServer = new ControllerServer(new Keyboard(), "keyboard")

function animate(time:number){
	requestAnimationFrame(animate)
	graphics.control.update(time)
	keybaordServer.update()
	bridge.sendAll()
}
requestAnimationFrame(animate)
