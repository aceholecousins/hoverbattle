import { ModelMeshConfig } from "game/graphics/mesh"
import { Model } from "game/graphics/asset"
import { Engine, getEngine, onEngineReady } from "game/engine"
import { Vector3, ypr, Quaternion, Euler } from "math"
import { Color, colorLerp } from "utils/color"
import { Visual } from "game/graphics/visual"
import { PointLight, PointLightConfig } from "game/graphics/light"
import { broker } from "broker"
import { Smoke } from "./smoke"
import { Resource } from "game/resourcemanager"

const DURATION = 0.5

export class Smokeball extends Visual {
	time: number = 0
	color: Color

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/smokeball.glb")
	)

	constructor(
		position: Vector3,
		color: Color
	) {
		let mesh = getEngine().graphics.mesh.createFromModel({ model: Smokeball.model.get().model })
		mesh.setScale(0.01)
		mesh.setPosition(position)
		mesh.setOrientation(new Quaternion().random())
		mesh.setBaseColor({ r: 1, g: 1, b: 1 })
		mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
		super(mesh)
		this.color = color
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

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/crumb.glb")
	)

	constructor(
		position: Vector3,
		private color: Color
	) {
		let mesh = getEngine().graphics.mesh.createFromModel({ model: Crumb.model.get().model })
		mesh.setScale(0.5)
		mesh.setBaseColor(color)
		super(mesh)
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
			new Smoke(this.position, this.color)
		}

		if (this.position.z < 0) {
			this.dispose()
		}
	}
}

export class Shockwave extends Visual {
	time: number = 0

	private static model = new Resource(() =>
		getEngine().graphics.loadSprite("assets/sprites/shockwave.png")
	)

	constructor(
		position: Vector3
	) {
		let mesh = getEngine().graphics.mesh.createFromModel({ model: Shockwave.model.get() })
		mesh.setScale(0.1)
		mesh.setPosition(position)
		mesh.setOpacity(0.2)
		super(mesh)
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

	private static model = new Resource(() =>
		getEngine().graphics.loadSprite("assets/sprites/plop.tint.png")
	)

	constructor(
		position: Vector3,
		color: Color
	) {
		let mesh = getEngine().graphics.mesh.createFromModel({ model: Plop.model.get() })
		mesh.setScale(0.1)
		mesh.setPosition(position)
		mesh.setBaseColor(color)
		super(mesh)
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

export class SmallExplosion extends Visual {
	progress: number = 0

	private static model = new Resource(() =>
		getEngine().graphics.loadSprite("assets/sprites/small_explosion.tint.png")
	)

	constructor(
		position: Vector3,
		private color: Color
	) {
		let mesh = getEngine().graphics.mesh.createFromModel({ model: SmallExplosion.model.get() })
		mesh.setScale(0.1)
		let shifted = position.clone()
		shifted.z += 0.1 * Math.random()
		mesh.setPosition(shifted)
		mesh.setAngle(Math.random() * 6.28)
		mesh.setBaseColor(color)
		mesh.setAccentColor2(colorLerp(color, { r: 0, g: 0, b: 0 }, 0.5))
		super(mesh)
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

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/shard.glb")
	)

	constructor(
		position: Vector3
	) {
		let mesh = getEngine().graphics.mesh.createFromModel({ model: Shard.model.get().model })
		mesh.setScale(new Vector3(3.0, 0.1, 0.1))
		let direction = Math.random() * 2 * Math.PI
		let pitch = Math.random()
		mesh.setOrientation(ypr(
			direction, -pitch, 0))
		super(mesh)

		this.position = position.clone()
		let speed = 10 + Math.random() * 10
		this.velocity = new Vector3(
			speed * Math.cos(direction) * Math.cos(pitch),
			speed * Math.sin(direction) * Math.cos(pitch),
			speed * Math.sin(pitch)
		)
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

	constructor() {
		this.light = getEngine().graphics.light.createPointLight({
			position: new Vector3(NaN, NaN, NaN),
			color: { r: 0, g: 0, b: 0 },
			intensity: 0
		})
	}

	// call to reuse this instance somewhere else
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

export class Explosion {
	// light sources are very expensive, especially creating them dynamically,
	// so we create a pool of them and reuse them (initialized below class)
	static flashes: Flash[] = []
	static nextFlash = 0

	smokeball: Smokeball
	crumbs: Crumb[] = []
	shockwave: Shockwave
	plop: Plop
	shards: Shard[] = []

	constructor(position: Vector3, color: Color) {
		this.smokeball = new Smokeball(position, color)
		let darkColor = { r: color.r * 0.33, g: color.g * 0.33, b: color.b * 0.33 }
		for (let i = 0; i < 7; i++) {
			this.crumbs.push(new Crumb(position, darkColor))
		}
		let shockwavePosition = position.clone()
		shockwavePosition.z += Math.random() * 0.1
		this.shockwave = new Shockwave(shockwavePosition)
		let plopPosition = position.clone()
		plopPosition.z += Math.random() * 0.1
		this.plop = new Plop(plopPosition, color)
		for (let i = 0; i < 11; i++) {
			this.shards.push(new Shard(position))
		}
		Explosion.flashes[Explosion.nextFlash].flash(position, color)
		Explosion.nextFlash = (Explosion.nextFlash + 1) % Explosion.flashes.length
	}
}

onEngineReady(engine => { // TODO code smell
	for (let i = 0; i < 3; i++) {
		Explosion.flashes.push(new Flash())
	}
})
