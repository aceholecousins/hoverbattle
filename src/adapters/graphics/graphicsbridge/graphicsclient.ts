
import {Graphics} from "domain/graphics/graphics"
import {bridge} from "worker/worker"

export function createGraphicsClient(){
	return bridge.createProxy("graphicsServer") as Graphics
}