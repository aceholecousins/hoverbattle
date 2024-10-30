import { ModelMeshConfig } from "game/graphics/mesh";
import { Model } from "game/graphics/asset";
import { Engine } from "game/engine";
import { quat, vec2, vec3 } from "gl-matrix";
import { Glider, GLIDER_RADIUS } from "../glider/glider";
import { Visual } from "game/graphics/visual"
import { Color } from "utils"
import { Actor } from "game/entities/actor"

const LASER_WIDTH = 1.0;

export class Speckle extends Visual {
	constructor(
		model: Model,
		engine: Engine
	) {
		super()
		this.mesh = engine.graphics.mesh.createFromModel(
			new ModelMeshConfig({ model: model })
		)
		this.mesh.scaling = vec3.fromValues(LASER_WIDTH * 3, LASER_WIDTH * 3, 1)
	}

	set position(p: vec3) {
		this.mesh.position = p
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
		this.mesh.baseColor = color
		this.mesh.accentColor1 = { r: 1, g: 1, b: 1 }

		if (numReflections > 0) {
			this.reflection = new LaserBeam(
				color, numReflections - 1, beamModel, speckleModel, engine)
		}

		this.hitSpeckle = new Speckle(speckleModel, engine)
	}

	cast(
		start: vec2,
		angle: number,
		maxDistance: number
	): Actor[] {
		let result: Actor[] = []
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
			this.hitSpeckle.position = vec3.fromValues(p2[0], p2[1], this.z + 0.1)
			result.push(hit.actor)
		}
		let distance = vec2.distance(p1, p2)
		this.mesh.position = vec3.fromValues(
			(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, this.z)
		this.mesh.scaling = vec3.fromValues(
			distance, LASER_WIDTH, 1)
		this.mesh.orientation = quat.fromEuler(
			quat.create(), 0, 0, angle / Math.PI * 180)

		if (hit && this.reflection) {
			let normalAngle = Math.atan2(hit.normal[1], hit.normal[0])
			let reflectionAngle = angle - 2 * (angle - normalAngle) + Math.PI;
			result = result.concat(
				this.reflection.cast(p2, reflectionAngle, maxDistance - distance)
			)
		}

		return result
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

	constructor(
		public parent: Glider,
		numReflections: number,
		beamModel: Model,
		speckleModel: Model,
		engine: Engine
	) {
		super(parent.player.color, numReflections, beamModel, speckleModel, engine)
		this.startSpeckle = new Speckle(speckleModel, engine)
	}

	fire(): Actor[] {
		let p1 = vec2.clone(this.parent.body.position)
		p1[0] += Math.cos(this.parent.body.angle) * GLIDER_RADIUS
		p1[1] += Math.sin(this.parent.body.angle) * GLIDER_RADIUS
		this.startSpeckle.position = vec3.fromValues(p1[0], p1[1], 0.7)
		return this.cast(p1, this.parent.body.angle, 1000)
	}

	dispose() {
		this.startSpeckle.dispose()
		super.dispose()
	}
}


export async function createLaserFactory(engine: Engine) {

	let laserSprite = await engine.graphics.loadSprite(
		"game/entities/weapons/laser.tint.png"
	)
	let laserHitSprite = await engine.graphics.loadSprite(
		"game/entities/weapons/phaser_impact.png"
	)

	return {
		createBeam: function (parent: Glider, numReflections: number) {
			return new LaserBeamRoot(parent, numReflections, laserSprite, laserHitSprite, engine)
		}
	}
}
