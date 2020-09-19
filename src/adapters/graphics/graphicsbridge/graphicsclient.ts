
import {Graphics} from "domain/graphics/graphics"
import {bridge} from "worker/worker"

export let graphicsClient = bridge.createProxy("graphicsServer") as Graphics