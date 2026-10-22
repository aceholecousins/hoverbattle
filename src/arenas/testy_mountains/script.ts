import { Role, enableCollision, hasRole, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Damaging, makeDamaging, Destructible, makeDestructible } from "game/entities/damage"
import { collideWithEverythingRole, Entity } from "game/entities/entity"
import { Glider } from "game/entities/vehicles/glider"
import { Car } from "game/entities/vehicles/car"
import { OmgCar } from "game/entities/vehicles/omgcar"
import { Vehicle, VehicleCtor } from "game/entities/vehicles/vehicle"
import { ignoreNewPowerup, PowerupBox, PowerupBoxCtor, setPowerupCollectionHandler } from "game/entities/powerups/powerup"
import { PhaserWeapon } from "game/entities/weapons/phaser"
import { MatchFactory } from "game/match"
import { Player } from "game/player"
import { SceneNodeConfig } from "game/graphics/scenenode"
import { Vector2, Vector3, ypr } from "math"
import { remove } from "utils/general"
import { Explosion } from "game/graphics/explosion/explosion"
import { GameTimer } from "game/gametimer"
import { appendZ } from "math"
import { MissilePowerupBox } from "game/entities/powerups/missilepowerup"
import { MinePowerupBox } from "game/entities/powerups/minepowerup"
import { LaserPowerupBox } from "game/entities/powerups/laserpowerup"
import { MinigunPowerupBox } from "game/entities/powerups/minigunpowerup"
import { PowerShieldPowerupBox } from "game/entities/powerups/powershieldpowerup"
import { RepairPowerupBox } from "game/entities/powerups/repairpowerup"
import { Resource } from "game/resourcemanager"
import { getEngine } from "game/engine"

export let VEHICLE_HP = 10

const urlParams = new URLSearchParams(window.location.search);
const vehicleKind = urlParams.get("vehicle") || "glider";
const arenaFile = vehicleKind.endsWith("car")
	? "arenas/testy_mountains/mountains_road.glb"
	: "arenas/testy_mountains/mountains.glb"

let arenaParts_meta = new Resource(() =>
	loadArena(arenaFile)
)

let skybox = new Resource(() =>
	getEngine().graphics.loadSkybox("arenas/testy_mountains/environment/*.jpg")
)

export let createMatch: MatchFactory = async function () {

	let vehicles: Vehicle[] = []
	let powerupBoxes: PowerupBox[] = []

	setPowerupCollectionHandler(ignoreNewPowerup)

	let spawnPoints: Vector2[] = []

	let vehicleCtor: VehicleCtor;

	if (vehicleKind === "glider") {
		vehicleCtor = Glider
	}
	else if (vehicleKind === "car") {
		vehicleCtor = Car
	}
	else if (vehicleKind === "omgcar") {
		vehicleCtor = OmgCar
	}

	for (const [key, value] of Object.entries(arenaParts_meta.get().meta)) {
		if (key.startsWith("spawn")) {
			const spawn = value as Required<SceneNodeConfig>
			spawnPoints.push(new Vector2(spawn.position.x, spawn.position.y))
		}
	}

	for (let part of arenaParts_meta.get().arenaParts) {
		// destructible but with infinite hitpoints, absorbs things that damage
		let part2 = makeDestructible(part, Infinity, () => { })
		assignRole(part2, collideWithEverythingRole)
	}

	getEngine().graphics.setEnvironment(skybox.get())
	getEngine().graphics.setEnvironmentOrientation(ypr(0, 0, Math.PI / 2))

	let team = 0;

	getEngine().controllerManager.addConnectionCallback((controller) => {

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

			let powerupBoxCtors: PowerupBoxCtor[] = [
				MissilePowerupBox,
				MinePowerupBox,
				LaserPowerupBox,
				MinigunPowerupBox,
				PowerShieldPowerupBox,
				RepairPowerupBox
			]
			let pick = Math.floor(Math.random() * powerupBoxCtors.length)
			let powerupBox = makeDestructible(
				new powerupBoxCtors[pick](determineSpawnPoint()),
				7,
				() => { powerupBox.dispose() }
			)
			powerupBox.onDispose(() => {
				getEngine().actionCam.unfollow(powerupBox.body)
				remove(powerupBoxes, powerupBox)
			})
			assignRole(powerupBox, collideWithEverythingRole)
			powerupBoxes.push(powerupBox)
			getEngine().actionCam.follow(powerupBox.body, 1.5)
		}
		new GameTimer(spawnPowerup, Math.random() * 2 + 1)
	}

	function spawnVehicle(player: Player) {
		let vehicle = makeDestructible(
			new vehicleCtor(
				player,
				determineSpawnPoint()
			),
			VEHICLE_HP,
			() => {
				vehicle.dispose()

				new Explosion(
					appendZ(vehicle.body.getPosition(), 1),
					player.color
				)

				let explosionPosition = vehicle.body.getPosition()
				let explosionPositionGetter = {
					getPosition() { return explosionPosition }
				}
				getEngine().actionCam.follow(explosionPositionGetter, 1.5)

				new GameTimer(() => {
					getEngine().actionCam.unfollow(explosionPositionGetter)
				}, 1)

				new GameTimer(() => {
					spawnVehicle(player)
				}, 2)
			}
		)

		vehicle.onDispose(() => {
			getEngine().actionCam.unfollow(vehicle.body)
			remove(vehicles, vehicle)
		})
		assignRole(vehicle, collideWithEverythingRole)
		vehicle.mesh.setBaseColor(player.color)
		vehicle.mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
		vehicle.mesh.setAccentColor2(player.team == 0 ? { r: 0, g: 0, b: 0.8 } : { r: 1, g: 0, b: 0.2 })
		vehicle.body.setPosition(determineSpawnPoint())
		vehicle.body.setAngle(Math.random() * Math.PI * 2)
		getEngine().actionCam.follow(vehicle.body, 5)

		let phaser = new PhaserWeapon(vehicle);

		vehicle.onPressTrigger = () => {
			vehicle.activePowerup?.pressTrigger?.()
		}

		vehicle.onReleaseTrigger = () => {
			vehicle.activePowerup?.releaseTrigger?.()
		}

		vehicle.onUpdate = (dt: number) => {
			if (vehicle.isFiring() && vehicle.activePowerup === null) {
				phaser.tryShoot()
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

