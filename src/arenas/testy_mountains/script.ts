import { Role, interact, assignRole } from "game/entities/actor"
import { loadArena } from "game/entities/arena/arena"
import { createGliderFactory, Glider } from "game/entities/glider/glider"
import { MatchFactory } from "game/match"
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { vec2 } from "gl-matrix"

export let createMatch:MatchFactory = async function(engine){

	engine.graphics.control.setSceneOrientation([-Math.SQRT1_2, 0, 0, Math.SQRT1_2])

	let arenaRole = new Role<{}>()
	let gliderRole = new Role<Glider>()

	interact(arenaRole, gliderRole)
	interact(gliderRole, gliderRole)

	engine.physics.registerCollisionOverride(new CollisionOverride(
		gliderRole, gliderRole, function(
			gliderA:Glider, gliderB:Glider
		){
			return !(gliderA.team == 1 && gliderB.team == 1)
		}
	))

	engine.physics.registerCollisionHandler(new CollisionHandler(
		gliderRole, gliderRole, function(
			gliderA:Glider, gliderB:Glider
		){
			if(gliderA.team != gliderB.team){
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

	let arena = await loadArena(
		engine, "arenas/testy_mountains/mountains.glb")

	assignRole(arena, arenaRole)
	
	let createGlider = await createGliderFactory(engine)

	await new Promise<void>((resolve, reject)=>{
		let env = engine.graphics.skybox.load(
			"arenas/testy_mountains/environment/*.jpg",
			function(){
				engine.graphics.control.setEnvironment(env)
				resolve()
			},
			reject
		)
	})

	let gliders:Glider[] = []

	engine.controllerManager.addConnectionCallback((controller) => {
		for(let i=0; i<10; i++){
			let team = i<5? 0:1
			let glider = createGlider(team, controller)
			assignRole(glider, gliderRole)
			glider.mesh.baseColor = team==0? {r:1, g:0.5, b:0}:{r:0, g:0.5, b:1}
			glider.mesh.accentColor = team==0? {r:1, g:0.5, b:0}:{r:0, g:0.5, b:1}
			glider.body.position = vec2.fromValues(Math.random()*20-10, Math.random()*20-10)
			glider.body.angle = Math.random()*1000
			engine.actionCam.follow(glider.body, 1.5)
			gliders.push(glider)
		}
	})

	return {update(dt){
		engine.physics.step(dt)
		engine.actionCam.update(dt)
		for(let glider of gliders){
			glider.update()
		}
	}}
}













	