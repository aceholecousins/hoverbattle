import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { quat, vec2, vec3 } from "gl-matrix";
import { quatFromAngle } from "utils/math"
import { Vehicle, VEHICLE_RADIUS } from "game/entities/vehicles/vehicle";
import { Visual } from "game/graphics/visual"
import { Color } from "utils/color"
import { Actor } from "game/entities/actor"
import { Powerup } from "game/entities/powerups/powerup"

const LASER_WIDTH = 1.0;
const LASER_DURATION = 2.0;

export class LaserPowerup implements Powerup {
	public readonly kind = "laser"
	activated = false
}

type HitCallback = (actor: Actor, dt: number) => void;

export class Speckle extends Visual {
	constructor(
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.setScale([LASER_WIDTH * 3, LASER_WIDTH * 3, 1])
	}

	setPosition(position: vec3) {
		this.mesh.setPosition(position)
	}
}

export class LaserBeam extends Visual {

	private reflection: LaserBeam | null = null
	private hitSpeckle: Speckle
	protected z = 0.5 + Math.random() * 0.1

	constructor(
		color: Color,
		numReflections: number,
		beamModel: Model,
		speckleModel: Model,
		private engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: beamModel })
		)
		this.mesh.setBaseColor(color)
		this.mesh.setAccentColor1({ r: 1, g: 1, b: 1 })
		this.mesh.setPositionZ(this.z)

		if (numReflections > 0) {
			this.reflection = new LaserBeam(
				color, numReflections - 1, beamModel, speckleModel, engine)
		}

		this.hitSpeckle = new Speckle(speckleModel, engine)
	}

	cast(
		start: vec2,
		angle: number,
		maxDistance: number,
		onHit: (actor: Actor) => void
	) {
		let p1 = start
		let p2 = vec2.fromValues(
			p1[0] + Math.cos(angle) * maxDistance,
			p1[1] + Math.sin(angle) * maxDistance
		)
		let hits = this.engine.physics.rayCast(p1, p2, true)
		let hit = null
		if (hits.length > 0) {
			hit = hits[0]
			p2 = hit.position
			this.hitSpeckle.setPosition([p2[0], p2[1], this.z + 0.1])
			onHit(hit.actor)
		}
		let distance = vec2.distance(p1, p2)
		this.mesh.setPositionXY([(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2])
		this.mesh.setScale([distance, LASER_WIDTH, 1])
		this.mesh.setAngle(angle)

		if (hit && this.reflection) {
			let normalAngle = Math.atan2(hit.normal[1], hit.normal[0])
			let reflectionAngle = angle - 2 * (angle - normalAngle) + Math.PI;
			this.reflection.cast(p2, reflectionAngle, maxDistance - distance, onHit)
		}
	}

	dispose() {
		if (this.reflection) {
			this.reflection.dispose()
		}
		this.hitSpeckle.dispose()
		super.dispose()
	}
}

export class LaserBeamRoot extends LaserBeam {

	private startSpeckle: Speckle
	countdown = LASER_DURATION

	constructor(
		public parent: Vehicle,
		numReflections: number,
		public onHit: HitCallback,
		private onDispose: () => void,
		beamModel: Model,
		speckleModel: Model,
		engine: Engine
	) {
		super(parent.player.color, numReflections, beamModel, speckleModel, engine)
		this.startSpeckle = new Speckle(speckleModel, engine)
	}

	update(dt: number) {
		this.countdown -= dt
		if (this.countdown <= 0 || this.parent.isDisposed()) {
			this.dispose()
			return
		}

		let p1 = vec2.clone(this.parent.body.getPosition())
		p1[0] += Math.cos(this.parent.body.getAngle()) * VEHICLE_RADIUS
		p1[1] += Math.sin(this.parent.body.getAngle()) * VEHICLE_RADIUS
		this.startSpeckle.setPosition([p1[0], p1[1], 0.7])
		this.cast(p1, this.parent.body.getAngle(), 1000,
			(actor: Actor) => this.onHit(actor, dt))
	}

	dispose() {
		this.onDispose()
		this.startSpeckle.dispose()
		super.dispose()
	}
}


export async function createLaserFactory(engine: Engine) {

	let laserSprite = await engine.graphics.loadSprite(
		"assets/sprites/laser.tint.png"
	)
	let laserHitSprite = await engine.graphics.loadSprite(
		"assets/sprites/phaser_impact.png"
	)

	return {
		createBeam: function (
			parent: Vehicle,
			numReflections: number,
			onHit: HitCallback,
			onDispose: () => void
		) {
			return new LaserBeamRoot(
				parent,
				numReflections,
				onHit,
				onDispose,
				laserSprite,
				laserHitSprite,
				engine
			)
		}
	}
}