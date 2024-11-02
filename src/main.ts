
//import { createMatch } from "arenas/testy_mountains/script"
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





import { Role, interact, hasRole, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Damaging, makeDamaging, Destructible, makeDestructible } from "game/entities/damage"
import { Entity } from "game/entities/entity"
import { Actor } from "game/entities/actor"
import { createGliderFactory, Glider } from "game/entities/glider/glider"
import { PowerupKind, createPowerupBoxFactory, PowerupBox } from "game/entities/powerups/powerup"
import { createPhaserFactory, PhaserShot, PhaserWeapon } from "game/entities/weapons/phaser"
import { createLaserFactory, LaserPowerup } from "game/entities/weapons/laser"
import { createMissileFactory, MissilePowerup, Missile, MissileLauncher } from "game/entities/weapons/missile"
import { createMineFactory, MinePowerup, Mine, MineThrower } from "game/entities/weapons/mine"
import { MatchFactory } from "game/match"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Player } from "game/player"
import { SceneNodeConfig } from "game/graphics/scenenode"
import { vec2, vec3, quat } from "gl-matrix"
import { remove } from "utils"
import { createExplosionFactory } from "game/graphics/explosion/explosion"
import { GameTimer } from "game/gametimer"

const imports = {
	Role, interact, hasRole, assignRole, loadArena, makeDamaging,
	makeDestructible, Entity, createGliderFactory, Glider, createPowerupBoxFactory,
	PowerupBox, createPhaserFactory, PhaserShot, PhaserWeapon, createLaserFactory,
	LaserPowerup, createMissileFactory, MissilePowerup, Missile, MissileLauncher,
	createMineFactory, MinePowerup, Mine, MineThrower, CollisionOverride,
	CollisionHandler, Player, SceneNodeConfig, vec2, vec3, quat, remove,
	createExplosionFactory, GameTimer
};





async function importArena(path: string) {
	let module = await import("arenas/testy_mountains/script");
	return module
}

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

	let arena = await importArena("arenas/testy_mountains/script")

	let match = await arena.createMatch(
		imports,
		{
			physics, graphics, actionCam, controllerManager, loadSound
		}
	)

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

	window.addEventListener('keydown', (event) => {
		switch (event.key) {
			case '0':
				dt = 0
				break
			case '1':
				dt = 1 / 125
				break
			case '9':
				dt = 1 / 1250
				break
		}
	})

	requestAnimationFrame(animate)

}

main()

