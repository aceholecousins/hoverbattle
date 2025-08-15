import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { appendZ, vec2FromDir, Vector2, Vector3 } from "math"
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
		let mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		mesh.setScale(new Vector3(LASER_WIDTH * 3, LASER_WIDTH * 3, 1))

		super(mesh)
	}

	setPosition(position: Vector3) {
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
		super(engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: beamModel })
		))
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
		start: Vector2,
		angle: number,
		maxDistance: number,
		onHit: (actor: Actor) => void
	) {
		let p1 = start
		let p2 = vec2FromDir(angle).multiplyScalar(maxDistance).add(p1)
		let hit = this.engine.physics.rayCast(p1, p2)
		if (hit !== null) {
			p2 = hit.position
			this.hitSpeckle.setPosition(appendZ(p2, this.z + 0.1))
			onHit(hit.actor)
		}
		else{
			this.hitSpeckle.mesh.setPositionZ(-1000)
		}
		let distance = p1.distanceTo(p2)
		this.mesh.setPositionXY(p1.lerp(p2, 0.5))
		this.mesh.setScale(new Vector3(distance, LASER_WIDTH, 1))
		this.mesh.setAngle(angle)

		if (this.reflection) {
			if (hit) {
				this.reflection.show()
				let reflectionAngle = angle - 2 * (angle - hit.normal.angle()) + Math.PI;
				this.reflection.cast(p2, reflectionAngle, maxDistance - distance, onHit)
			}
			else {
				this.reflection.hide()
			}
		}
	}

	hide() {
		this.mesh.setPositionZ(-1000)
		this.hitSpeckle.mesh.setPositionZ(-1000)
		if (this.reflection) {
			this.reflection.hide()
		}
	}

	show() {
		this.mesh.setPositionZ(this.z)
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

		let p1 = this.parent.body.getPosition().clone() as Vector2
		p1.addScaledVector(vec2FromDir(this.parent.body.getAngle()), VEHICLE_RADIUS)
		this.startSpeckle.setPosition(appendZ(p1, 0.7))
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
