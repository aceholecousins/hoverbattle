
import {Graphics} from "domain/graphics/graphics"
import {bridge} from "worker/worker"

export async function createGraphicsClient(){
	return bridge.createProxy("graphicsServer") as Promise<Graphics>
}