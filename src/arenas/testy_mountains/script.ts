import { Role, interact, hasRole, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Damaging, makeDamaging, Destructible, makeDestructible } from "game/entities/damage"
import { Entity } from "game/entities/entity"
import { Actor } from "game/entities/actor"
import { createGliderFactory, Glider } from "game/entities/vehicles/glider"
import { createCarFactory, Car } from "game/entities/vehicles/car"
import { createOmgCarFactory, OmgCar } from "game/entities/vehicles/omgcar"
import { Vehicle, VehicleFactory } from "game/entities/vehicles/vehicle"
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
import { Vector2, Vector3, ypr } from "math"
import { remove } from "utils/general"
import { createExplosionFactory, createSmallExplosionFactory } from "game/graphics/explosion/explosion"
import { GameTimer } from "game/gametimer"
import { appendZ } from "math"

let VEHICLE_HP = 10

export let createMatch: MatchFactory = async function (engine) {

	const urlParams = new URLSearchParams(window.location.search);
	let vehicle = urlParams.get("vehicle") || "glider";

	let vehicles: Vehicle[] = []
	let powerupBoxes: PowerupBox[] = []

	let collideWithEverythingRole = new Role<Entity>("collideWithEverything")
	let vehicleRole = new Role<Vehicle>("vehicle")
	let projectileRole = new Role<Entity>("projectile")
	let powerShieldRole = new Role<PowerShield>("powerShield")
	let powerupBoxRole = new Role<PowerupBox>("powerupBox")
	let missileRole = new Role<Missile>("missile")
	let damagingRole = new Role<Damaging>("damaging")
	let destructibleRole = new Role<Destructible>("destructible")

	interact(collideWithEverythingRole, collideWithEverythingRole)

	engine.physics.registerCollisionHandler(new CollisionHandler(
		collideWithEverythingRole, collideWithEverythingRole, function (
			a: Entity, b: Entity
		) {
		5708
	}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		powerShieldRole, collideWithEverythingRole, function (
			shield: PowerShield, other: Entity
		) {
		shield.flash()
		let impulse = other.body.getPosition().clone()
			.sub(shield.body.getPosition()).setLength(30)
		other.body.applyGlobalImpulse(impulse)
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
		vehicleRole, powerupBoxRole, (vehicle: Vehicle, powerupBox: PowerupBox) => {
			if (powerupBox.kind == "missile") {
				vehicle.readyPowerups = [new MissilePowerup()]
			}
			else if (powerupBox.kind == "mine") {
				vehicle.readyPowerups = [new MinePowerup()]
			}
			else if (powerupBox.kind == "laser") {
				vehicle.readyPowerups = [new LaserPowerup()]
			}
			else if (powerupBox.kind == "nashwan") {
				vehicle.activatedPowerups = [new NashwanPowerup()]
				let shotModifier = (shot: NashwanShot) => {
					assignRole(shot, collideWithEverythingRole)
					assignRole(shot, projectileRole)
					let projectile2 = makeDamaging(shot, 1, () => {
						if ("isMissile" in shot) {
							createSmallExplosion(
								appendZ(shot.body.getPosition(), 1),
								vehicle.player.color
							)
						}
						shot.dispose()
					})
					assignRole(projectile2, damagingRole)
				}
				let extensions = nashwanFactory(vehicle, shotModifier)
				for (let ex of [
					extensions.leftBarrel1,
					extensions.leftBarrel2,
					extensions.rightBarrel1,
					extensions.rightBarrel2,
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
				(vehicle as unknown as Destructible).repair(VEHICLE_HP)
			}
			else if (powerupBox.kind == "powershield") {
				vehicle.activatedPowerups = [new PowerShieldPowerup()]
				let powerShield1 = powerShieldFactory(vehicle);
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

	let spawnPoints: Vector2[] = []

	let arenaFile =
		vehicle.endsWith("car") ? "arenas/testy_mountains/mountains_road.glb"
			: "arenas/testy_mountains/mountains.glb"

	let [
		arenaParts_meta,
		createGlider,
		createCar,
		createOmgCar,
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
		loadArena(arenaFile, engine),
		createGliderFactory(engine),
		createCarFactory(engine),
		createOmgCarFactory(engine),
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

	let createVehicle: VehicleFactory;

	if (vehicle === "glider") {
		createVehicle = createGlider
	}
	else if (vehicle === "car") {
		createVehicle = createCar
	}
	else if (vehicle === "omgcar") {
		createVehicle = createOmgCar
	}

	for (const [key, value] of Object.entries(arenaParts_meta.meta)) {
		if (key.startsWith("spawn")) {
			const spawn = value as Required<SceneNodeConfig>
			spawnPoints.push(new Vector2(spawn.position.x, spawn.position.y))
		}
	}

	for (let part of arenaParts_meta.arenaParts) {
		// destructible but with infinite hitpoints, absorbs things that damage
		let part2 = makeDestructible(part, Infinity, () => { })
		assignRole(part2, collideWithEverythingRole)
		assignRole(part2, destructibleRole)
	}

	engine.graphics.setEnvironment(skybox)
	engine.graphics.setEnvironmentOrientation(ypr(0, 0, Math.PI / 2))

	let team = 0;

	engine.controllerManager.addConnectionCallback((controller) => {

		let baseColor = team == 0 ? { r: 1, g: 0, b: 0 } : { r: 0, g: 0.5, b: 1 }
		let player = new Player(controller, team, baseColor)

		for (let i = 0; i < 1; i++) {
			spawnVehicle(player)
		}
		team++
	})

	new GameTimer(spawnPowerup, Math.random() * 2 + 1)

	function spawnPowerup() {
		if (powerupBoxes.length < 5) {
			let kinds = ["mine", "missile", "laser", "nashwan", "powershield", "repair"]
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

	function spawnVehicle(player: Player) {
		let vehicle = makeDestructible(
			createVehicle(
				player,
				determineSpawnPoint()
			),
			VEHICLE_HP,
			() => {
				vehicle.dispose()

				createExplosion(
					appendZ(vehicle.body.getPosition(), 1),
					player.color
				)

				let explosionPosition = vehicle.body.getPosition()
				let explosionPositionGetter = {
					getPosition() { return explosionPosition }
				}
				engine.actionCam.follow(explosionPositionGetter, 1.5)

				new GameTimer(() => {
					engine.actionCam.unfollow(explosionPositionGetter)
				}, 1)

				new GameTimer(() => {
					spawnVehicle(player)
				}, 2)
			}
		)

		vehicle.onDispose(() => {
			engine.actionCam.unfollow(vehicle.body)
			remove(vehicles, vehicle)
		})
		assignRole(vehicle, vehicleRole)
		assignRole(vehicle, collideWithEverythingRole)
		assignRole(vehicle, destructibleRole)
		vehicle.mesh.setBaseColor(player.color)
		vehicle.mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
		vehicle.mesh.setAccentColor2(player.team == 0 ? { r: 0, g: 0, b: 0.8 } : { r: 1, g: 0, b: 0.2 })
		vehicle.body.setPosition(determineSpawnPoint())
		vehicle.body.setAngle(Math.random() * Math.PI * 2)
		engine.actionCam.follow(vehicle.body, 5)

		let phaserWeapon = new PhaserWeapon(phaserFactory, vehicle);
		let missileLauncher = new MissileLauncher(missileFactory, vehicle);
		let mineThrower = new MineThrower(mineFactory, vehicle);

		vehicle.onPressTrigger = () => {
			if (vehicle.readyPowerups.length > 0) {
				if (vehicle.readyPowerups[0].kind == "missile") {
					let maybeMissile = missileLauncher.tryShoot(vehicles)
					if (maybeMissile) {
						let missilePowerup = vehicle.readyPowerups[0] as MissilePowerup
						missilePowerup.stock -= 1
						vehicle.requireTriggerRelease()
						if (missilePowerup.stock == 0) {
							vehicle.readyPowerups = []
						}

						let missile1 = maybeMissile as Missile
						let explode = () => {
							missile1.dispose()
							createExplosion(
								appendZ(missile1.body.getPosition(), 1),
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

				else if (vehicle.readyPowerups[0].kind == "mine") {
					let maybeMine = mineThrower.tryShoot()
					if (maybeMine) {
						let minePowerup = vehicle.readyPowerups[0] as MinePowerup
						minePowerup.stock -= 1
						vehicle.requireTriggerRelease()
						if (minePowerup.stock == 0) {
							vehicle.readyPowerups = []
						}

						let mine1 = maybeMine as Mine
						let explode = () => {
							mine1.dispose()
							createExplosion(
								appendZ(mine1.body.getPosition(), 1),
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

				else if (vehicle.readyPowerups[0].kind == "laser") {
					let laser = vehicle.readyPowerups[0] as LaserPowerup
					if (!laser.activated) {
						laser.activated = true
						laserFactory.createBeam(vehicle, 1,
							function (actor: Actor, dt: number) {
								if (hasRole(actor, destructibleRole)) {
									(actor as unknown as Destructible).hit(40 * dt)
								}
							},
							function () { vehicle.readyPowerups = [] }
						)
					}
				}
			}
		}

		vehicle.onUpdate = (dt: number) => {
			if (vehicle.isFiring() && vehicle.readyPowerups.length == 0) {
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

		vehicles.push(vehicle)
		return vehicle
	}

	function determineSpawnPoint(): Vector2 {
		let index = Math.floor(Math.random() * spawnPoints.length)
		let point = spawnPoints[index]
		point.x += Math.random() - 0.5
		point.y += Math.random() - 0.5
		return point
	}

	return {}
}

