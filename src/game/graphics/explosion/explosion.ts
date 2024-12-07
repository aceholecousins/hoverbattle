import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine } from "game/engine"
import { Vector3, ypr, Quaternion, Euler } from "math"
import { Color, colorLerp } from "utils/color"
import { Visual } from "game/graphics/visual"
import { PointLight, PointLightConfig } from "../light"
import { broker } from "broker"
import { SmokeFactory, createSmokeFactory } from "./smoke"

const DURATION = 0.5

export class Smokeball extends Visual {
	time: number = 0
	color: Color

	constructor(
		position: Vector3,
		color: Color,
		model: Model,
		engine: Engine
	) {
		super()
		this.color = color
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(0.01)
		this.mesh.setPosition(position)
		this.mesh.setOrientation(new Quaternion().random())
		this.mesh.setBaseColor({ r: 1, g: 1, b: 1 })
		this.mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		let size = this.time * 7

		this.mesh.setBaseColor(colorLerp(
			{ r: 1, g: 1, b: 1 },
			this.color,
			this.time / DURATION
		))
		this.mesh.setAccentColor1(colorLerp(
			this.color,
			{ r: 0, g: 0, b: 0 },
			this.time / DURATION
		))

		if (this.time > DURATION * 0.8) {
			this.mesh.setOpacity(1 - (this.time - DURATION * 0.8) / (DURATION * 0.2))
		}

		this.mesh.setScale(size)
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Crumb extends Visual {
	time = 0
	tNextCloud = 0
	position: Vector3
	velocity: Vector3
	euler: Euler

	constructor(
		position: Vector3,
		private color: Color,
		private createCloud: SmokeFactory,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(0.5)
		this.mesh.setBaseColor(color)
		this.position = position.clone()
		let direction = Math.random() * 2 * Math.PI
		let pitch = 0.5 + Math.random() * 1.0
		let speed = 35 + Math.random() * 10
		this.velocity = new Vector3(
			speed * Math.cos(direction) * Math.cos(pitch),
			speed * Math.sin(direction) * Math.cos(pitch),
			Math.sin(pitch)
		)
		this.euler = new Euler(
			Math.random() * 2 * Math.PI,
			Math.random() * 2 * Math.PI,
			Math.random() * 2 * Math.PI
		)
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.euler.x += dt * 4 * Math.PI
		this.position.addScaledVector(this.velocity, dt)
		this.velocity.z -= 9.81 * dt
		this.mesh.setPosition(this.position)
		this.mesh.setOrientation(new Quaternion().setFromEuler(this.euler))

		if (this.time > this.tNextCloud) {
			this.tNextCloud = this.time + 0.04
			this.createCloud(this.position, this.color)
		}

		if (this.position.z < 0) {
			this.dispose()
		}
	}
}

export class Shockwave extends Visual {
	time: number = 0

	constructor(
		position: Vector3,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(0.1)
		this.mesh.setPosition(position)
		this.mesh.setOpacity(0.2)
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.mesh.setScale(this.time * 50)
		this.mesh.setOpacity(0.99 - this.time / DURATION)
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Plop extends Visual {
	time: number = 0

	constructor(
		position: Vector3,
		color: Color,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(0.1)
		this.mesh.setPosition(position)
		this.mesh.setBaseColor(color)
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.mesh.setScale(this.time * 25)
		this.mesh.setOpacity(0.99)
		if (this.time > DURATION) {
			this.dispose()
		}
	}
}

export class Piff extends Visual {
	progress: number = 0

	constructor(
		position: Vector3,
		private color: Color,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(0.1)
		let shifted = position.clone()
		shifted.z += 0.1*Math.random()
		this.mesh.setPosition(shifted)
		this.mesh.setAngle(Math.random() * 6.28)
		this.mesh.setBaseColor(color)
		this.mesh.setAccentColor2(colorLerp(color, { r: 0, g: 0, b: 0 }, 0.5))
		this.update(0)
	}

	update(dt: number) {
		this.progress += dt * 10
		if (this.progress > 1) {
			this.dispose()
			return
		}
		this.mesh.setScale(this.progress * 5)
		this.mesh.setOpacity(0.99)

		this.mesh.setBaseColor(colorLerp(
			this.color,
			{ r: 0, g: 0, b: 0 },
			0.9 * this.progress
		))

		this.mesh.setAccentColor1(colorLerp(
			{ r: 1, g: 1, b: 1 },
			this.color,
			this.progress
		))
	}
}

export class Shard extends Visual {
	time: number = 0
	private position: Vector3
	private velocity: Vector3

	constructor(
		position: Vector3,
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(new ModelMeshConfig({ model }))
		this.mesh.setScale(new Vector3(3.0, 0.1, 0.1))
		this.position = position.clone()
		let direction = Math.random() * 2 * Math.PI
		let pitch = Math.random()
		let speed = 10 + Math.random() * 10
		this.velocity = new Vector3(
			speed * Math.cos(direction) * Math.cos(pitch),
			speed * Math.sin(direction) * Math.cos(pitch),
			speed * Math.sin(pitch)
		)
		this.mesh.setOrientation(ypr(
			direction, -pitch, 0))
		this.update(0)
	}

	update(dt: number) {
		this.time += dt
		this.position.addScaledVector(this.velocity, dt)
		this.mesh.setPosition(this.position)

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
				position: new Vector3(NaN, NaN, NaN),
				color: { r: 0, g: 0, b: 0 },
				intensity: 0
			})
		)
	}

	flash(position: Vector3, color: Color) {
		this.time = 0
		this.light.setPosition(position)
		this.light.setColor(color)
		if (!this.active) {
			this.active = true
			broker.update.addHandler(this.updateHandler)
		}
	}

	update(dt: number) {
		this.time += dt
		this.light.setIntensity(1000 * (1 - this.time / DURATION))
		if (this.time > DURATION) {
			this.dispose()
		}
	}

	dispose() {
		this.active = false
		broker.update.removeHandler(this.updateHandler)
		this.light.setIntensity(0)
		this.light.setColor({ r: 0, g: 0, b: 0 })
		this.light.setPosition(new Vector3(NaN, NaN, NaN))
	}
}

export async function createExplosionFactory(engine: Engine) {

	let smokeballModel = await engine.graphics.loadModel(
		"assets/models/smokeball.glb")
	let crumbModel = await engine.graphics.loadModel(
		"assets/models/crumb.glb")
	let shardModel = await engine.graphics.loadModel(
		"assets/models/shard.glb")
	let shockwaveModel = await engine.graphics.loadSprite(
		"assets/sprites/shockwave.png")
	let plopModel = await engine.graphics.loadSprite(
		"assets/sprites/plop.tint.png")
	let createCloud = await createSmokeFactory(engine)

	// light sources are very expensive, especially creating them dynamically,
	// so we create a pool of them and reuse them
	let flashes: Flash[] = []
	for (let i = 0; i < 3; i++) {
		flashes.push(new Flash(engine))
	}
	let nextFlash = 0

	return function (position: Vector3, color: Color) {
		let smokeball = new Smokeball(position, color, smokeballModel.model, engine)
		let crumbs: Crumb[] = []
		let darkColor = { r: color.r * 0.33, g: color.g * 0.33, b: color.b * 0.33 }
		for (let i = 0; i < 7; i++) {
			crumbs.push(new Crumb(position, darkColor, createCloud, crumbModel.model, engine))
		}
		let shockwavePosition = position.clone()
		shockwavePosition.z += Math.random() * 0.1
		let shockwave = new Shockwave(shockwavePosition, shockwaveModel, engine)
		let plopPosition = position.clone()
		plopPosition.z += Math.random() * 0.1
		let plop = new Plop(plopPosition, color, plopModel, engine)
		let shards: Shard[] = []
		for (let i = 0; i < 11; i++) {
			shards.push(new Shard(position, shardModel.model, engine))
		}
		flashes[nextFlash].flash(position, color)
		nextFlash = (nextFlash + 1) % flashes.length
		return { smokeball, crumbs, shockwave, plop, shards }
	}
}

export async function createSmallExplosionFactory(engine: Engine) {
	let explosionModel = await engine.graphics.loadSprite(
		"assets/sprites/small_explosion.tint.png")

	return function (position: Vector3, color: Color) {
		return new Piff(position, color, explosionModel, engine)
	}
}