
import {bridge} from "worker/worker"
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {createGraphicsServer} from "adapters/graphics/graphicsbridge/graphicsserver"
import { Keyboard } from "adapters/controller/keyboard"

let graphics = new ThreeGraphics(document.getElementById("rendertarget") as HTMLCanvasElement)
createGraphicsServer(graphics)

function animate(time:number){
	requestAnimationFrame(animate)
	graphics.control.update(time)
	bridge.sendAll()
}
requestAnimationFrame(animate)
