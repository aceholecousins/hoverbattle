import { Role, interact, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Damaging, makeDamaging, Destructible, makeDestructible } from "game/entities/damage"
import { Entity } from "game/entities/entity"
import { createGliderFactory, Glider } from "game/entities/glider/glider"
import { createPhaserManager, PhaserShot, PhaserWeapon } from "game/entities/weapons/phaser"
import { createMissileManager, Missile, MissileLauncher } from "game/entities/weapons/missile"
import { ExplosionConfig } from "game/graphics/fx"
import { MatchFactory } from "game/match"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Player } from "game/player"
import { vec2, vec3 } from "gl-matrix"

export let createMatch: MatchFactory = async function (engine) {

	let gliders: Glider[] = []

	engine.graphics.control.setSceneOrientation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2])

	let arenaRole = new Role<Entity>()
	let gliderRole = new Role<Glider>()
	let phaserRole = new Role<PhaserShot>()
	let missileRole = new Role<Missile>()
	let damagingRole = new Role<Damaging>()
	let destructibleRole = new Role<Destructible>()

	interact(arenaRole, gliderRole)
	interact(gliderRole, gliderRole)
	interact(phaserRole, phaserRole)
	interact(damagingRole, destructibleRole)

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
		gliderRole, gliderRole, function (
			gliderA: Glider, gliderB: Glider
		) {
		if (gliderA.player.team != gliderB.player.team) {
			let a2b = vec2.subtract(
				vec2.create(),
				gliderB.body.position,
				gliderA.body.position
			)
			gliderA.body.applyImpulse(vec2.scale(vec2.create(), a2b, -10))
			gliderB.body.applyImpulse(vec2.scale(vec2.create(), a2b, 10))
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

	let spawnPoints: vec2[] = []

	let tempArena = await loadArena(
		engine, "arenas/testy_mountains/mountains.glb", (meta: any) => {
			for (let tri of meta.spawn) {
				spawnPoints.push(vec2.fromValues(tri[0][0], tri[0][1]))
			}
		})

	// destructible but infinite hitpoints, absorbs damaging things
	let arena = makeDestructible(tempArena, Infinity, () => { })
	assignRole(arena, arenaRole)
	assignRole(arena, destructibleRole)

	let createGlider = await createGliderFactory(engine)

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

	let phaserManager = await createPhaserManager(engine, phaserRole)
	let missileManager = await createMissileManager(engine, missileRole)

	let team = 0;

	engine.controllerManager.addConnectionCallback((controller) => {

		let baseColor = team == 0 ? { r: 1, g: 0, b: 0 } : { r: 0, g: 0.5, b: 1 }
		let player = new Player(controller, team, baseColor)

		for (let i = 0; i < 1; i++) {
			spawn(player)
		}
		team++
	})

	return {
		update(dt) {
			engine.physics.step(dt)
			engine.actionCam.update(dt)
		}
	}

	function spawn(player: Player) {
		let glider = makeDestructible(createGlider(player), 20, () => {
			engine.actionCam.unfollow(glider.body)
			glider.dispose()
			gliders = gliders.filter(g => g !== glider)

			engine.graphics.fx.createExplosion(new ExplosionConfig({
				position: vec3.fromValues(glider.body.position[0], glider.body.position[1], 0),
				color: player.color
			}))
			setTimeout(() => {
				spawn(player)
			}, 2000)
		})
		assignRole(glider, gliderRole)
		assignRole(glider, destructibleRole)
		glider.mesh.baseColor = player.color
		glider.mesh.accentColor1 = player.team == 0 ? { r: 1, g: 0.5, b: 0 } : { r: 0, g: 0.8, b: 1 }
		glider.mesh.accentColor2 = player.team == 0 ? { r: 0, g: 0, b: 0.8 } : { r: 1, g: 0, b: 0.2 }
		glider.body.position = determineSpawnPoint()
		glider.body.angle = Math.random() * 1000
		engine.actionCam.follow(glider.body, 1.5)

		//let weapon = new PhaserWeapon(phaserManager, glider);
		let weapon = new MissileLauncher(missileManager, glider, Infinity);

		glider.shootCallback = () => {
			let maybeMissile = weapon.shoot(gliders)
			if (maybeMissile) {
				let missile1 = maybeMissile
				let explode = () => {
					missile1.dispose()
					engine.graphics.fx.createExplosion(new ExplosionConfig({
						position: vec3.fromValues(missile1.body.position[0], missile1.body.position[1], 0)
					}))
				}
				let missile2 = makeDamaging(missile1, 17, () => { explode() })
				assignRole(missile2, damagingRole)
				let missile3 = makeDestructible(missile2, 3, () => { explode() })
				assignRole(missile3, destructibleRole)
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

