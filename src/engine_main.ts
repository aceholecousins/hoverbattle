
import {bridge} from "worker/worker"
import {createGraphicsClient} from "adapters/graphics/graphicsbridge/graphicsclient"
import {ActionCam, ActionCamConfig} from "game/actioncam"
import { Physics } from "game/physics/physics"
import { P2Physics } from "adapters/physics/p2/p2physics"
import { createMatch } from "arenas/testy_mountains/script"
import { createControllerManagerClient } from "adapters/controller/controllerbridge/controllermanagerclient"
import { Match } from "game/match"
import { broker } from "broker"
import { SoundFxPlayer } from "game/sound/soundfx"

import * as Stats from 'stats.js'

let dt = 1/100

async function initMatch(){
	broker.newChannel('update')
	broker.newChannel('purge')

	let physics = new P2Physics() as Physics
	let graphics = await createGraphicsClient()
	let actionCam = new ActionCam(graphics, new ActionCamConfig())
	actionCam.camera.activate()
	let controllerManager = createControllerManagerClient("controllerManager")
	let soundFxPlayer = await (bridge.createProxy("soundFxPlayer") as Promise<SoundFxPlayer>)

	return createMatch({	
		physics, graphics, actionCam, controllerManager, soundFxPlayer
	})
}

async function start(match:Match){
	let engineStats = await (bridge.createProxy("engineStats") as Promise<Stats>)

	setInterval(()=>{
		match.update(dt)
		broker.update.fire({dt})
		bridge.sendAll()
		broker.purge.fire()
		engineStats.update()
	}, 1000*dt)
}

async function main(){
	let match = await initMatch()
	await start(match)
}

main()