import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { vec3, quat } from "gl-matrix"
import { Color, colorLerp } from "utils"
import { Visual } from "game/graphics/visual"
import { PointLight, PointLightConfig } from "../light"
import { broker } from "broker"

const DURATION = 0.5

export class Smokeball extends Visual {
	time: number = 0
	color: Color

	constructor(
		position: vec3,
		color: Color,
		model: Model,
		engine: Engine
	) {
		super()
		this.color = color
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(0.01, 0.01, 0.01)
		this.mesh.position = position
		this.mesh.orientation = quat.fromEuler(
			quat.create(),
			Math.random() * 360,
			Math.random() * 360,
			Math.random() * 360
		)
		this.mesh.baseColor = { r: 1, g: 1, b: 1 }
		this.mesh.accentColor1 = { r: 1, g: 1, b: 1 }
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		let size = this.time * 7

		this.mesh.baseColor = colorLerp(
			{ r: 1, g: 1, b: 1 },
			this.color,
			this.time / DURATION
		)
		this.mesh.accentColor1 = colorLerp(
			this.color,
			{ r: 0, g: 0, b: 0 },
			this.time / DURATION
		)

		if (this.time > DURATION * 0.8) {
			this.mesh.opacity = 1 - (this.time - DURATION * 0.8) / (DURATION * 0.2)
		}

		this.mesh.scaling = vec3.fromValues(size, size, size)
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Crumb extends Visual {
	time = 0
	tNextCloud = 0
	position: vec3
	velocity: vec3
	euler: vec3

	constructor(
		position: vec3,
		color: Color,
		private createCloud: (position: vec3) => void,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(0.5, 0.5, 0.5)
		this.mesh.baseColor = color
		this.position = vec3.clone(position)
		let direction = Math.random() * 2 * Math.PI
		let pitch = 0.5 + Math.random() * 1.0
		let speed = 20 + Math.random() * 10
		this.velocity = vec3.fromValues(
			speed * Math.cos(direction) * Math.cos(pitch),
			speed * Math.sin(direction) * Math.cos(pitch),
			Math.sin(pitch)
		)
		this.euler = vec3.fromValues(Math.random() * 360, Math.random() * 360, Math.random() * 360)
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.euler[2] += dt * 720
		this.position[0] += this.velocity[0] * dt
		this.position[1] += this.velocity[1] * dt
		this.position[2] += this.velocity[2] * dt
		this.velocity[2] -= 9.81 * dt
		this.mesh.position = this.position
		this.mesh.orientation = quat.fromEuler(quat.create(), this.euler[0], this.euler[1], this.euler[2])

		if (this.time > this.tNextCloud) {
			this.tNextCloud = this.time + 0.04
			this.createCloud(this.position)
		}

		if (this.position[2] < 0) {
			this.dispose()
		}
	}
}

export class Cloud extends Visual {
	time: number = 0

	constructor(
		position: vec3,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(2, 2, 2)
		this.mesh.position = position
		this.mesh.orientation = quat.fromEuler(quat.create(), 0, 0, Math.random() * 360)
		this.mesh.opacity = 0.2
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		let size = 3 * (1 - this.time / DURATION)
		this.mesh.scaling = vec3.fromValues(size, size, size)
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Shockwave extends Visual {
	time: number = 0

	constructor(
		position: vec3,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(0.1, 0.1, 0.1)
		this.mesh.position = position
		this.mesh.opacity = 0.2
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		let size = this.time * 50
		this.mesh.scaling = vec3.fromValues(size, size, size)
		this.mesh.opacity = 0.99 - this.time / DURATION
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Plop extends Visual {
	time: number = 0

	constructor(
		position: vec3,
		color: Color,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(0.1, 0.1, 0.1)
		this.mesh.position = position
		this.mesh.baseColor = color
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		let size = this.time * 25
		this.mesh.scaling = vec3.fromValues(size, size, size)
		this.mesh.opacity = 0.99
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Shard extends Visual {
	time: number = 0
	private position: vec3
	private velocity: vec3

	constructor(
		position: vec3,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.scaling = vec3.fromValues(3.0, 0.1, 0.1)
		this.position = vec3.clone(position)
		let direction = Math.random() * 2 * Math.PI
		let pitch = Math.random()
		let speed = 10 + Math.random() * 10
		this.velocity = vec3.fromValues(
			speed * Math.cos(direction) * Math.cos(pitch),
			speed * Math.sin(direction) * Math.cos(pitch),
			speed * Math.sin(pitch)
		)
		this.mesh.orientation = quat.fromEuler(
			quat.create(),
			0,
			-pitch * 180 / Math.PI,
			direction * 180 / Math.PI,
		)
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.position[0] += this.velocity[0] * dt
		this.position[1] += this.velocity[1] * dt
		this.position[2] += this.velocity[2] * dt
		this.mesh.position = this.position

		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Flash {
	time = 0
	active = false
	private light: PointLight
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(engine: Engine) { 
		this.light = engine.graphics.light.createPointLight(
			new PointLightConfig({
				position: vec3.fromValues(NaN, NaN, NaN),
				color: { r: 0, g: 0, b: 0 },
				intensity: 0
			})
		)
	}

	flash(position: vec3, color: Color) {
		this.time = 0
		this.light.position = position
		this.light.color = color
		if (!this.active) {
			this.active = true
			broker.update.addHandler(this.updateHandler)
		}
	}

	update(dt: number) {
		this.time += dt
		this.light.intensity = 1000 * (1 - this.time / DURATION)
		if (this.time > DURATION) {
			this.dispose()
		}
	}

	dispose() {
		this.active = false
		broker.update.removeHandler(this.updateHandler)
		this.light.intensity = 0
		this.light.color = { r: 0, g: 0, b: 0 }
		this.light.position = vec3.fromValues(NaN, NaN, NaN)
	}
}

export async function createExplosionFactory(engine: Engine) {

	let smokeballModel = await engine.graphics.loadModel(
		"game/graphics/explosion/smokeball.glb")
	let crumbModel = await engine.graphics.loadModel(
		"game/graphics/explosion/crumb.glb")
	let shardModel = await engine.graphics.loadModel(
		"game/graphics/explosion/shard.glb")
	let shockwaveModel = await engine.graphics.loadSprite(
		"game/graphics/explosion/shockwave.png")
	let plopModel = await engine.graphics.loadSprite(
		"game/graphics/explosion/plop.tint.png")
	let cloudModel = await engine.graphics.loadSprite(
		"game/graphics/explosion/smoke.png")

	// light sources are very expensive, especially creating them dynamically,
	// so we create a pool of them and reuse them
	let flashes: Flash[] = []
	for (let i = 0; i < 3; i++) {
		flashes.push(new Flash(engine))
	}
	let nextFlash = 0

	return function (position: vec3, color: Color) {
		let smokeball = new Smokeball(position, color, smokeballModel.model, engine)
		let crumbs: Crumb[] = []
		let createCloud = (position: vec3) => {
			let cloud = new Cloud(position, cloudModel, engine)
		}
		let darkColor = { r: color.r * 0.33, g: color.g * 0.33, b: color.b * 0.33 }
		for (let i = 0; i < 7; i++) {
			crumbs.push(new Crumb(position, darkColor, createCloud, crumbModel.model, engine))
		}
		let shockwave = new Shockwave(position, shockwaveModel, engine)
		let plop = new Plop(position, color, plopModel, engine)
		let shards: Shard[] = []
		for (let i = 0; i < 11; i++) {
			shards.push(new Shard(position, shardModel.model, engine))
		}
		flashes[nextFlash].flash(position, color)
		nextFlash = (nextFlash + 1) % flashes.length
		return
	}
}
