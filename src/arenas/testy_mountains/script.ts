import { Role, interact, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { Destructible, makeDestructible } from "game/entities/destructible"
import { Entity } from "game/entities/entity"
import { createGliderFactory, Glider } from "game/entities/glider/glider"
import { createPhaserManager, PhaserShot, PhaserWeapon } from "game/entities/weapons/phaser"
import { ExplosionConfig } from "game/graphics/fx"
import { MatchFactory } from "game/match"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Player } from "game/player"
import { vec2, vec3 } from "gl-matrix"

export let createMatch: MatchFactory = async function (engine) {

	engine.graphics.control.setSceneOrientation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2])

	let arenaRole = new Role<Entity>()
	let gliderRole = new Role<Glider>()
	let phaserRole = new Role<PhaserShot>()
	let destructibleRole = new Role<Destructible>()

	interact(arenaRole, gliderRole)
	interact(gliderRole, gliderRole)
	interact(phaserRole, gliderRole)
	interact(phaserRole, arenaRole)
	interact(phaserRole, phaserRole)
	interact(phaserRole, destructibleRole)

	engine.physics.registerCollisionOverride(new CollisionOverride(
		gliderRole, phaserRole, function (
			glider: Glider, phaserShot: PhaserShot
		) {
		return glider != phaserShot.glider
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
		phaserRole, arenaRole, (shot: PhaserShot, arena: Entity) => {
			shot.dispose()
		}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		phaserRole, gliderRole, (shot: PhaserShot, glider: Glider) => {
			shot.dispose()
		}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		phaserRole, phaserRole, (shotA: PhaserShot, shotB: PhaserShot) => {
			shotA.dispose()
			shotB.dispose()
		}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		phaserRole, destructibleRole, (shot: PhaserShot, destructible: Destructible) => {
			destructible.hit()
		}
	))

	let arena = await loadArena(
		engine, "arenas/testy_mountains/mountains.glb")

	assignRole(arena, arenaRole)

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

	let team = 0;

	engine.controllerManager.addConnectionCallback((controller) => {

		let baseColor = team == 0 ? { r: 1, g: 0, b: 0 } : { r: 0, g: 0.5, b: 1 }
		let player = new Player(controller, team, baseColor)

		for (let i = 0; i < 2; i++) {
			let glider = spawn(player)
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
		let glider = makeDestructible(createGlider(player), 3, () => {
			console.log('destroy')
			engine.actionCam.unfollow(glider.body)
			glider.dispose()
	
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
		glider.body.position = vec2.fromValues(Math.random() * 20 - 10, Math.random() * 20 - 10)
		glider.body.angle = Math.random() * 1000
		engine.actionCam.follow(glider.body, 1.5)
	
		let weapon = new PhaserWeapon(phaserManager, glider);
	
		glider.shootCallback = () => weapon.shoot()
		return glider
	}	
}

