
import {Graphics} from "domain/graphics/graphics"
import {bridge} from "worker/worker"

export function createGraphicsServer(graphics:Graphics){
	bridge.register(graphics, "graphicsServer")
}
