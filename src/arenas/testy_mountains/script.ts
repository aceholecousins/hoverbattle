import { Role, interact, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Damaging, makeDamaging, Destructible, makeDestructible } from "game/entities/damage"
import { Entity } from "game/entities/entity"
import { createGliderFactory, Glider } from "game/entities/glider/glider"
import { PowerupKind, createPowerupBoxFactory, PowerupBox } from "game/entities/powerups/powerup"
import { createPhaserFactory, PhaserShot, PhaserWeapon } from "game/entities/weapons/phaser"
import { createLaserFactory, LaserBeamRoot } from "game/entities/weapons/laser"
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
import { ModelMeshConfig } from "game/graphics/mesh";
import { broker } from "broker"

export let createMatch: MatchFactory = async function (engine) {

	let gliders: Glider[] = []
	let powerupBoxes: PowerupBox[] = []

	let collideWithEverythingRole = new Role<Entity>()
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
			if (powerupBox.kind == "missile") {
				glider.readyPowerups = [new MissilePowerup()]
			}
			else if (powerupBox.kind == "mine") {
				glider.readyPowerups = [new MinePowerup()]
			}
			powerupBox.dispose()
		}
	))

	let spawnPoints: vec2[] = []

	let [
		arena_meta,
		createGlider,
		createPowerupBox,
		skybox,
		phaserFactory,
		laserFactory,
		missileFactory,
		mineFactory,
		createExplosion
	] = await Promise.all([
		loadArena("arenas/testy_mountains/mountains.glb", engine),
		createGliderFactory(engine),
		createPowerupBoxFactory(engine),
		engine.graphics.loadSkybox("arenas/testy_mountains/environment/*.jpg"),
		createPhaserFactory(engine),
		createLaserFactory(engine),
		createMissileFactory(engine),
		createMineFactory(engine),
		createExplosionFactory(engine)
	]);

	for (const [key, value] of Object.entries(arena_meta.meta)) {
		if (key.startsWith("spawn")) {
			const spawn = value as SceneNodeConfig<"empty">
			spawnPoints.push(vec2.fromValues(spawn.position[0], spawn.position[1]))
		}
	}

	// destructible but with infinite hitpoints, absorbs things that damage
	let arena = makeDestructible(arena_meta.arena, Infinity, () => { })
	assignRole(arena, collideWithEverythingRole)
	assignRole(arena, destructibleRole)

	engine.graphics.setEnvironment(skybox)
	engine.graphics.setEnvironmentOrientation([Math.PI / 2, 0, Math.PI / 2])

	let team = 0;

	engine.controllerManager.addConnectionCallback((controller) => {

		let baseColor = team == 0 ? { r: 1, g: 0, b: 0 } : { r: 0, g: 0.5, b: 1 }
		let player = new Player(controller, team, baseColor)

		for (let i = 0; i < 1; i++) {
			spawnGlider(player)
		}
		team++
	})

	new GameTimer(spawnPowerup, Math.random() * 5 + 3)

	function spawnPowerup() {
		if (powerupBoxes.length < 3) {
			const powerupKind:PowerupKind = ["missile", "mine"][Math.floor(Math.random() * 2)] as PowerupKind;
			let powerupBox = makeDestructible(
				createPowerupBox(
					powerupKind,
					determineSpawnPoint(),
				),
				7,
				() => { powerupBox.dispose() }
			)
			powerupBox.onDispose = () => {
				engine.actionCam.unfollow(powerupBox.body)
				remove(powerupBoxes, powerupBox)
			}
			assignRole(powerupBox, powerupBoxRole)
			assignRole(powerupBox, collideWithEverythingRole)
			assignRole(powerupBox, destructibleRole)
			powerupBoxes.push(powerupBox)
			engine.actionCam.follow(powerupBox.body, 1.5)
		}
		new GameTimer(spawnPowerup, Math.random() * 7 + 3)
	}

	function spawnGlider(player: Player) {
		let laser: LaserBeamRoot = null

		let glider = makeDestructible(
			createGlider(
				player,
				determineSpawnPoint()
			),
			10,
			() => {
				glider.dispose()

				createExplosion(
					vec3.fromValues(glider.body.position[0], glider.body.position[1], 1),
					player.color
				)

				let explosionPosition = {
					position: vec2.fromValues(glider.body.position[0], glider.body.position[1])
				}
				engine.actionCam.follow(explosionPosition, 1.5)

				new GameTimer(() => {
					engine.actionCam.unfollow(explosionPosition)
				}, 1)

				new GameTimer(() => {
					spawnGlider(player)
				}, 2)
			}
		)

		glider.onDispose = () => {
			engine.actionCam.unfollow(glider.body)
			remove(gliders, glider)
			if (laser) {
				laser.dispose()
				laser = null
			}
		}
		assignRole(glider, gliderRole)
		assignRole(glider, collideWithEverythingRole)
		assignRole(glider, destructibleRole)
		glider.mesh.baseColor = player.color
		glider.mesh.accentColor1 = player.team == 0 ? { r: 1, g: 0.5, b: 0 } : { r: 0, g: 0.8, b: 1 }
		glider.mesh.accentColor2 = player.team == 0 ? { r: 0, g: 0, b: 0.8 } : { r: 1, g: 0, b: 0.2 }
		glider.body.position = determineSpawnPoint()
		glider.body.angle = Math.random() * 1000
		engine.actionCam.follow(glider.body, 5)

		let phaserWeapon = new PhaserWeapon(phaserFactory, glider);
		let missileLauncher = new MissileLauncher(missileFactory, glider);
		let mineThrower = new MineThrower(mineFactory, glider);

		glider.onPressTrigger = () => {
			if (glider.readyPowerups.length > 0) {
				if (glider.readyPowerups[0].kind == "missile") {
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
							createExplosion(
								vec3.fromValues(missile1.body.position[0], missile1.body.position[1], 1),
								missile1.parent.player.color
							)
						}
						let missile2 = makeDamaging(missile1, 17, () => { explode() })
						let missile3 = makeDestructible(missile2, 3, () => { explode() })
						assignRole(missile3, missileRole)
						assignRole(missile3, collideWithEverythingRole)
						assignRole(missile3, damagingRole)
						assignRole(missile3, destructibleRole)
					}
				}

				else if (glider.readyPowerups[0].kind == "mine") {
					let maybeMine = mineThrower.tryShoot()
					if (maybeMine) {
						let minePowerup = glider.readyPowerups[0] as MinePowerup
						minePowerup.stock -= 1
						glider.requireTriggerRelease()
						if (minePowerup.stock == 0) {
							glider.readyPowerups = []
						}

						let mine1 = maybeMine as Mine
						let explode = () => {
							mine1.dispose()
							createExplosion(
								[mine1.body.position[0], mine1.body.position[1], 1],
								mine1.parent.player.color
							)
						}
						let mine2 = makeDestructible(mine1, 3, () => { explode() })
						assignRole(mine2, collideWithEverythingRole)
						assignRole(mine2, destructibleRole)

						mine2.onPrime = () => {
							let mine3 = makeDamaging(mine2, 17, () => { explode() })
							assignRole(mine3, damagingRole)
						}
					}
				}
			}
		}

		let wasFiring = false
		glider.onUpdate = (dt: number) => {
			/*if (glider.isFiring() && glider.readyPowerups.length == 0) {
				let phaserShots = phaserWeapon.tryShoot()
				if (phaserShots) {
					for (let shot1 of phaserShots) {
						let shot2 = makeDamaging(shot1, 1, () => { shot1.dispose() })
						assignRole(shot2, phaserRole)
						assignRole(shot2, collideWithEverythingRole)
						assignRole(shot2, damagingRole)
					}
				}
			}*/
			if (glider.isFiring() && !wasFiring && glider.readyPowerups.length == 0) {
				laser = laserFactory.createBeam(glider, 1)
			}
			if (!glider.isFiring() && wasFiring) {
				if (laser) {
					laser.dispose()
					laser = null
				}
			}
			wasFiring = glider.isFiring()

			if (laser) {
				let hits = laser.fire()
				for (let hit of hits) {
					if ("isDestructible" in hit) {
						(hit as unknown as Destructible).hit(40 * dt)
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

	return {}
}

