import { Role, interact, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Damaging, makeDamaging, Destructible, makeDestructible } from "game/entities/damage"
import { Entity } from "game/entities/entity"
import { createGliderFactory, Glider } from "game/entities/glider/glider"
import { Powerup, createPowerupBoxFactory, PowerupBox } from "game/entities/powerup"
import { createPhaserManager, PhaserShot, PhaserWeapon } from "game/entities/weapons/phaser"
import { createMissileManager, MissilePowerup, Missile, MissileLauncher } from "game/entities/weapons/missile"
import { ExplosionConfig } from "game/graphics/fx"
import { MatchFactory } from "game/match"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Player } from "game/player"
import { vec2, vec3 } from "gl-matrix"
import { remove } from "utils"

export let createMatch: MatchFactory = async function (engine) {

	let gliders: Glider[] = []
	let powerupBoxes: PowerupBox[] = []

	engine.graphics.control.setSceneOrientation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2])

	let collideWithEverythingRole = new Role<Entity>()
	let arenaRole = new Role<Entity>()
	let gliderRole = new Role<Glider>()
	let phaserRole = new Role<PhaserShot>()
	let powerupBoxRole = new Role<PowerupBox>()
	let missileRole = new Role<Missile>()
	let damagingRole = new Role<Damaging>()
	let destructibleRole = new Role<Destructible>()

	interact(collideWithEverythingRole, collideWithEverythingRole)

	engine.physics.registerCollisionOverride(new CollisionOverride(
		gliderRole, phaserRole, function (
			glider: Glider, phaserShot: PhaserShot
		) {
		return glider != phaserShot.parent
	}
	))

	engine.physics.registerCollisionOverride(new CollisionOverride(
		gliderRole, missileRole, function (
			glider: Glider, missile: Missile
		) {
		return glider != missile.parent
	}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		phaserRole, phaserRole, function (
			shotA: PhaserShot, shotB: PhaserShot
		) {
			shotA.dispose()
			shotB.dispose()
		}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		gliderRole, gliderRole, function (
			gliderA: Glider, gliderB: Glider
		) {
		if (gliderA.player.team != gliderB.player.team) {
			let a2b = vec2.subtract(
				vec2.create(),
				gliderB.body.position,
				gliderA.body.position
			)
			gliderA.body.applyImpulse(vec2.scale(vec2.create(), a2b, -3))
			gliderB.body.applyImpulse(vec2.scale(vec2.create(), a2b, 3))
		}
	}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		phaserRole, phaserRole, (shotA: PhaserShot, shotB: PhaserShot) => {
			shotA.dispose()
			shotB.dispose()
		}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		damagingRole, destructibleRole, (damaging: Damaging, destructible: Destructible) => {
			damaging.impact()
			destructible.hit(damaging.damage)
		}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		gliderRole, powerupBoxRole, (glider: Glider, powerupBox: PowerupBox) => {
			glider.readyPowerups = [new MissilePowerup()]
			remove(powerupBoxes, powerupBox)
			powerupBox.dispose()
		}
	))

	let spawnPoints: vec2[] = []

	let tempArena = await loadArena(
		engine, "arenas/testy_mountains/mountains.glb", (meta: any) => {
			for (let tri of meta.spawn) {
				spawnPoints.push(vec2.fromValues(tri[0][0], tri[0][1]))
			}
		})

	// destructible but with infinite hitpoints, absorbs things that damage
	let arena = makeDestructible(tempArena, Infinity, () => { })
	assignRole(arena, arenaRole)
	assignRole(arena, collideWithEverythingRole)
	assignRole(arena, destructibleRole)

	let createGlider = await createGliderFactory(engine)
	let createPowerupBox = await createPowerupBoxFactory(engine)

	await new Promise<void>((resolve, reject) => {
		let env = engine.graphics.skybox.load(
			"arenas/testy_mountains/environment/*.jpg",
			function () {
				engine.graphics.control.setEnvironment(env)
				resolve()
			},
			reject
		)
	})

	let phaserManager = await createPhaserManager(engine)
	let missileManager = await createMissileManager(engine)

	let team = 0;

	engine.controllerManager.addConnectionCallback((controller) => {

		let baseColor = team == 0 ? { r: 1, g: 0, b: 0 } : { r: 0, g: 0.5, b: 1 }
		let player = new Player(controller, team, baseColor)

		for (let i = 0; i < 1; i++) {
			spawnGlider(player)
		}
		team++
	})

	setTimeout(spawnPowerup, Math.random() * 5000 + 3000)

	return {
		update(dt) {
			engine.physics.step(dt)
			engine.actionCam.update(dt)
		}
	}

	function spawnPowerup() {
		if (powerupBoxes.length < 3) {
			let powerupBox = makeDestructible(
				createPowerupBox("missiles"),
				7,
				() => {
					remove(powerupBoxes, powerupBox)
					powerupBox.dispose()
				}
			)
			assignRole(powerupBox, powerupBoxRole)
			assignRole(powerupBox, collideWithEverythingRole)
			assignRole(powerupBox, destructibleRole)
			powerupBoxes.push(powerupBox)
			powerupBox.body.position = determineSpawnPoint()
		}
		setTimeout(spawnPowerup, Math.random() * 5000 + 3000)
	}

	function spawnGlider(player: Player) {
		let glider = makeDestructible(createGlider(player), 20, () => {
			engine.actionCam.unfollow(glider.body)
			remove(gliders, glider)
			glider.dispose()

			engine.graphics.fx.createExplosion(new ExplosionConfig({
				position: vec3.fromValues(glider.body.position[0], glider.body.position[1], 0),
				color: player.color
			}))
			setTimeout(() => {
				spawnGlider(player)
			}, 2000)
		})
		assignRole(glider, gliderRole)
		assignRole(glider, collideWithEverythingRole)
		assignRole(glider, destructibleRole)
		glider.mesh.baseColor = player.color
		glider.mesh.accentColor1 = player.team == 0 ? { r: 1, g: 0.5, b: 0 } : { r: 0, g: 0.8, b: 1 }
		glider.mesh.accentColor2 = player.team == 0 ? { r: 0, g: 0, b: 0.8 } : { r: 1, g: 0, b: 0.2 }
		glider.body.position = determineSpawnPoint()
		glider.body.angle = Math.random() * 1000
		engine.actionCam.follow(glider.body, 1.5)

		let phaserWeapon = new PhaserWeapon(phaserManager, glider);
		let missileLauncher = new MissileLauncher(missileManager, glider);

		glider.onPressTrigger = () => {
			if (
				glider.readyPowerups.length > 0
				&& glider.readyPowerups[0].kind == "missile"
			) {
				let maybeMissile = missileLauncher.tryShoot(gliders)
				if (maybeMissile) {
					let missilePowerup = glider.readyPowerups[0] as MissilePowerup
					missilePowerup.stock -= 1
					glider.requireTriggerRelease()
					if (missilePowerup.stock == 0) {
						glider.readyPowerups = []
					}

					let missile1 = maybeMissile as Missile
					let explode = () => {
						missile1.dispose()
						engine.graphics.fx.createExplosion(new ExplosionConfig({
							position: vec3.fromValues(missile1.body.position[0], missile1.body.position[1], 0)
						}))
					}
					let missile2 = makeDamaging(missile1, 17, () => { explode() })
					let missile3 = makeDestructible(missile2, 3, () => { explode() })
					assignRole(missile3, missileRole)
					assignRole(missile3, collideWithEverythingRole)
					assignRole(missile3, damagingRole)
					assignRole(missile3, destructibleRole)
				}
			}
		}

		glider.onUpdate = () => {
			if (glider.isFiring() && glider.readyPowerups.length == 0) {
				let phaserShots = phaserWeapon.tryShoot()
				if (phaserShots) {
					for (let shot1 of phaserShots) {
						let shot2 = makeDamaging(shot1, 1, () => { shot1.dispose() })
						assignRole(shot2, phaserRole)
						assignRole(shot2, collideWithEverythingRole)
						assignRole(shot2, damagingRole)
					}
				}
			}
		}

		gliders.push(glider)
		return glider
	}

	function determineSpawnPoint(): vec2 {
		let index = Math.floor(Math.random() * spawnPoints.length)
		let point = spawnPoints[index]
		point[0] += Math.random() - 0.5
		point[1] += Math.random() - 0.5
		return point
	}
}

