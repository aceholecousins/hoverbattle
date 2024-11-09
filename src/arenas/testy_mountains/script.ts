import { Role, interact, hasRole, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Damaging, makeDamaging, Destructible, makeDestructible } from "game/entities/damage"
import { Entity } from "game/entities/entity"
import { Actor } from "game/entities/actor"
import {
	createGliderFactory,
	Glider,
	GLIDER_THRUST,
	GLIDER_TURN_RATE,
	GLIDER_DAMPING,
	GLIDER_ANGULAR_DAMPING
} from "game/entities/glider/glider"
import { PowerupKind, createPowerupBoxFactory, PowerupBox } from "game/entities/powerups/powerup"
import { createPhaserFactory, PhaserShot, PhaserWeapon } from "game/entities/weapons/phaser"
import { createLaserFactory, LaserPowerup } from "game/entities/weapons/laser"
import { createMissileFactory, MissilePowerup, Missile, MissileLauncher } from "game/entities/weapons/missile"
import { createMineFactory, MinePowerup, Mine, MineThrower } from "game/entities/weapons/mine"
import { createPowerShieldFactory, PowerShield, PowerShieldPowerup } from "game/entities/weapons/powershield"
import { createNashwanFactory, NashwanPowerup, NashwanShot } from "game/entities/weapons/nashwan"
import { MatchFactory } from "game/match"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Player } from "game/player"
import { SceneNodeConfig } from "game/graphics/scenenode"
import { vec2, vec3, quat } from "gl-matrix"
import { remove } from "utils"
import { createExplosionFactory, createSmallExplosionFactory } from "game/graphics/explosion/explosion"
import { GameTimer } from "game/gametimer"

let GLIDER_HP = 10

export let createMatch: MatchFactory = async function (engine) {

	let gliders: Glider[] = []
	let powerupBoxes: PowerupBox[] = []

	let collideWithEverythingRole = new Role<Entity>("collideWithEverything")
	let gliderRole = new Role<Glider>("glider")
	let projectileRole = new Role<Entity>("projectile")
	let powerShieldRole = new Role<PowerShield>("powerShield")
	let powerupBoxRole = new Role<PowerupBox>("powerupBox")
	let missileRole = new Role<Missile>("missile")
	let damagingRole = new Role<Damaging>("damaging")
	let destructibleRole = new Role<Destructible>("destructible")

	interact(collideWithEverythingRole, collideWithEverythingRole)

	engine.physics.registerCollisionHandler(new CollisionHandler(
		powerShieldRole, collideWithEverythingRole, function (
			shield: PowerShield, other: Entity
		) {
		shield.flash()
		let a2b = vec2.subtract(
			vec2.create(),
			other.body.position,
			shield.body.position
		)
		vec2.normalize(a2b, a2b)
		other.body.applyImpulse(vec2.scale(vec2.create(), a2b, 30))
	}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		projectileRole, collideWithEverythingRole, function (
			projectile: Entity, _: Entity
		) {
		projectile.dispose()
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
			else if (powerupBox.kind == "laser") {
				glider.readyPowerups = [new LaserPowerup()]
			}
			else if (powerupBox.kind == "nashwan") {
				glider.activatedPowerups = [new NashwanPowerup()]
				let shotModifier = (shot: NashwanShot) => {
					assignRole(shot, collideWithEverythingRole)
					assignRole(shot, projectileRole)
					let projectile2 = makeDamaging(shot, 1, () => {
						if("isMissile" in shot) {
							createSmallExplosion([
								shot.body.position[0],
								shot.body.position[1],
								1
							], glider.player.color)
						}
						shot.dispose()
					})
					assignRole(projectile2, damagingRole)
				}
				let extensions = nashwanFactory(glider, shotModifier)
				for (let ex of [
					extensions.leftBarrel1,
					extensions.leftBarrel2,
					extensions.rightBarrel1,
					extensions.rightBarrel1,
					extensions.drone]
				) {
					assignRole(ex, collideWithEverythingRole)
				}
				new GameTimer(() => {
					for (let ex of Object.values(extensions)) {
						ex.dispose()
					}
				}, 10)
			}
			else if (powerupBox.kind == "repair") {
				(glider as unknown as Destructible).repair(GLIDER_HP)
			}
			else if (powerupBox.kind == "powershield") {
				glider.activatedPowerups = [new PowerShieldPowerup()]
				let powerShield1 = powerShieldFactory(glider);
				let powerShield2 = makeDamaging(powerShield1, 8, () => { })
				let powerShield3 = makeDestructible(powerShield2, Infinity, () => { })
				assignRole(powerShield3, powerShieldRole)
				assignRole(powerShield3, collideWithEverythingRole)
				assignRole(powerShield3, damagingRole)
				assignRole(powerShield3, destructibleRole)
				new GameTimer(() => { powerShield3.dispose() }, 10)
			}
			powerupBox.dispose()
		}
	))

	let spawnPoints: vec2[] = []

	let [
		arenaParts_meta,
		createGlider,
		createPowerupBox,
		skybox,
		phaserFactory,
		laserFactory,
		missileFactory,
		mineFactory,
		powerShieldFactory,
		nashwanFactory,
		createExplosion,
		createSmallExplosion
	] = await Promise.all([
		loadArena("arenas/testy_mountains/mountains.glb", engine),
		createGliderFactory(engine),
		createPowerupBoxFactory(engine),
		engine.graphics.loadSkybox("arenas/testy_mountains/environment/*.jpg"),
		createPhaserFactory(engine),
		createLaserFactory(engine),
		createMissileFactory(engine),
		createMineFactory(engine),
		createPowerShieldFactory(engine),
		createNashwanFactory(engine),
		createExplosionFactory(engine),
		createSmallExplosionFactory(engine)
	]);

	for (const [key, value] of Object.entries(arenaParts_meta.meta)) {
		if (key.startsWith("spawn")) {
			const spawn = value as SceneNodeConfig<"empty">
			spawnPoints.push(vec2.fromValues(spawn.position[0], spawn.position[1]))
		}
	}

	for (let part of arenaParts_meta.arenaParts) {
		// destructible but with infinite hitpoints, absorbs things that damage
		let part2 = makeDestructible(part, Infinity, () => { })
		assignRole(part2, collideWithEverythingRole)
		assignRole(part2, destructibleRole)
	}

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

	new GameTimer(spawnPowerup, Math.random() * 2 + 1)

	function spawnPowerup() {
		if (powerupBoxes.length < 5) {
			let kinds = ["mine", "missile", "laser", "nashwan", "powershield", "repair"]
			kinds = ["missile", "nashwan"]
			const powerupKind = kinds[Math.floor(Math.random() * kinds.length)] as PowerupKind;
			let powerupBox = makeDestructible(
				createPowerupBox(
					powerupKind,
					determineSpawnPoint(),
				),
				7,
				() => { powerupBox.dispose() }
			)
			powerupBox.onDispose(() => {
				engine.actionCam.unfollow(powerupBox.body)
				remove(powerupBoxes, powerupBox)
			})
			assignRole(powerupBox, powerupBoxRole)
			assignRole(powerupBox, collideWithEverythingRole)
			assignRole(powerupBox, destructibleRole)
			powerupBoxes.push(powerupBox)
			engine.actionCam.follow(powerupBox.body, 1.5)
		}
		new GameTimer(spawnPowerup, Math.random() * 2 + 1)
	}

	function spawnGlider(player: Player) {
		let glider = makeDestructible(
			createGlider(
				player,
				determineSpawnPoint()
			),
			GLIDER_HP,
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

		glider.onDispose(() => {
			engine.actionCam.unfollow(glider.body)
			remove(gliders, glider)
		})
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

				else if (glider.readyPowerups[0].kind == "laser") {
					let laser = glider.readyPowerups[0] as LaserPowerup
					if (!laser.activated) {
						laser.activated = true
						laserFactory.createBeam(glider, 1,
							function (actor: Actor, dt: number) {
								if (hasRole(actor, destructibleRole)) {
									(actor as unknown as Destructible).hit(40 * dt)
								}
							},
							function () { glider.readyPowerups = [] }
						)
					}
				}
			}
		}

		glider.onUpdate = (dt: number) => {
			if (glider.isFiring() && glider.readyPowerups.length == 0) {
				let phaserShots = phaserWeapon.tryShoot()
				if (phaserShots) {
					for (let shot1 of phaserShots) {
						let shot2 = makeDamaging(shot1, 1, () => { shot1.dispose() })
						assignRole(shot2, projectileRole)
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

	return {}
}

