
import {bridge} from "worker/worker"
import {ThreeGraphics} from "adapters/graphics/threegraphics/threegraphics"
import {createGraphicsServer} from "adapters/graphics/graphicsbridge/graphicsserver"
import { DefaultControllerManager } from "adapters/controller/defaultcontrollermanager"
import { ControllerManagerServer } from "adapters/controller/controllerbridge/controllermanagerserver"
import { WebApiSoundFxPlayer } from "adapters/sound/webapisound"

import * as Stats from 'stats.js'

let graphicsStats = new Stats()
graphicsStats.showPanel(0)
graphicsStats.dom.style.cssText = 'position:absolute;top:0px;left:0px;';
document.body.appendChild(graphicsStats.dom)

let engineStats = new Stats()
engineStats.showPanel(0)
engineStats.dom.style.cssText = 'position:absolute;top:0px;left:100px;';
document.body.appendChild(engineStats.dom)
bridge.register(engineStats, "engineStats")

let graphics = new ThreeGraphics()
createGraphicsServer(graphics)

let controllerManagerServer = new ControllerManagerServer(new DefaultControllerManager(), "controllerManager")
bridge.register(new WebApiSoundFxPlayer(), "soundFxPlayer")

function animate(time:number){
	requestAnimationFrame(animate)
	graphicsStats.update()
	graphics.control.update(time)
	controllerManagerServer.update()
	bridge.sendAll()
}

requestAnimationFrame(animate)
