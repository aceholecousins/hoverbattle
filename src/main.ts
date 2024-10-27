
import { createMatch } from "arenas/testy_mountains/script"
import { Match } from "game/match"
import { broker } from "broker"
import { Graphics } from "game/graphics/graphics"
import { ActionCam, ActionCamConfig } from "game/actioncam"
import { Physics } from "game/physics/physics"
import { SoundLoader } from "game/sound"

import { ThreeGraphics } from "adapters/graphics/threegraphics/threegraphics"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { loadWebApiSound } from "adapters/sound/webapisound"
import { DefaultControllerManager } from "adapters/controller/defaultcontrollermanager"

import * as Stats from 'stats.js'

let dt = 1 / 125

async function main() {
	broker.newChannel('update')
	broker.newChannel('purge')

	let physics = new P2Physics() as Physics
	let graphics = new ThreeGraphics() as Graphics
	let actionCam = new ActionCam(graphics, new ActionCamConfig())
	actionCam.camera.activate()
	let controllerManager = new DefaultControllerManager()
	let loadSound = loadWebApiSound as SoundLoader

	let match = await createMatch({
		physics, graphics, actionCam, controllerManager, loadSound
	})

	let engineStats = new Stats()
	engineStats.showPanel(0)
	engineStats.dom.style.cssText = 'position:absolute;top:0px;left:100px;';
	document.body.appendChild(engineStats.dom)

	let graphicsStats = new Stats()
	graphicsStats.showPanel(0)
	graphicsStats.dom.style.cssText = 'position:absolute;top:0px;left:0px;';
	document.body.appendChild(graphicsStats.dom)

	let time = 0
	setInterval(() => {
		time += dt
		physics.step(dt)
		actionCam.update(dt)
		broker.update.fire({ dt })
		broker.purge.fire()
		engineStats.update()
	}, 1000 * dt)

	function animate() {
		requestAnimationFrame(animate)
		graphics.update()
		graphicsStats.update()
	}

	requestAnimationFrame(animate)

}

main()

