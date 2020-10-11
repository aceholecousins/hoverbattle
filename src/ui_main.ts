
import {bridge} from "worker/worker"
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {createGraphicsServer} from "adapters/graphics/graphicsbridge/graphicsserver"
import { Keyboard } from "adapters/controller/keyboard"
import { createControllerServer } from "adapters/controller/controllerbridge/controllerserver"

let graphics = new ThreeGraphics()
createGraphicsServer(graphics)

let keyboard = new Keyboard()
createControllerServer(keyboard)

function animate(time:number){
	requestAnimationFrame(animate)
	graphics.control.update(time)
	bridge.sendAll()
}
requestAnimationFrame(animate)
