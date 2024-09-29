
import { createMatch } from "arenas/testy_mountains/script"
import { Match } from "game/match"
import { broker } from "broker"
import { Graphics } from "game/graphics/graphics"
import { ActionCam, ActionCamConfig } from "game/actioncam"
import { Physics } from "game/physics/physics"
import { SoundFxPlayer } from "game/sound/soundfx"

import { ThreeGraphics } from "adapters/graphics/threegraphics/threegraphics"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { WebApiSoundFxPlayer } from "adapters/sound/webapisound"
import { DefaultControllerManager } from "adapters/controller/defaultcontrollermanager"

let dt = 1 / 100

async function main() {
	broker.newChannel('update')
	broker.newChannel('purge')

	let physics = new P2Physics() as Physics
	let graphics = new ThreeGraphics() as Graphics
	let actionCam = new ActionCam(graphics, new ActionCamConfig())
	actionCam.camera.activate()
	let controllerManager = new DefaultControllerManager()
	let soundFxPlayer = new WebApiSoundFxPlayer() as SoundFxPlayer

	let match = await createMatch({
		physics, graphics, actionCam, controllerManager, soundFxPlayer
	})

	setInterval(() => {
		match.update(dt)
		broker.update.fire({ dt })
		broker.purge.fire()
	}, 1000 * dt)

	function animate(time: number) {
		requestAnimationFrame(animate)
		graphics.control.update(time)
	}

	requestAnimationFrame(animate)

}

main()

