
import { RigidBodyConfig, RigidBody } from "game/physics/rigidbody"
import { Physics, RayHit, Attachment } from "game/physics/physics"
import { MatterRigidBody } from "./matterrigidbody"
import * as Matter from 'matter-js'
import { CollisionOverride, CollisionHandler } from "game/physics/collision"
import { Vector2, Vector3 } from "math"
import { Color } from "utils/color"

export class MatterPhysics implements Physics {

	private engine: Matter.Engine
	private world: Matter.World

	constructor() {
		this.engine = Matter.Engine.create({ gravity: { scale: 0 } });
		this.world = this.engine.world;

	}

	addRigidBody(config: RigidBodyConfig): RigidBody {
		const body = new MatterRigidBody(this.world, config)
		return body
	}

	attach(
		bodyA: RigidBody,
		bodyB: RigidBody,
	): Attachment {
		return {
			setOffset: (position: Vector2, angle: number) => { },
			setCanCollide: (canCollide: boolean) => { },
			setStiffness: (stiffness: number) => { },
			detach: () => { }
		}
	}

	rayCast(from: Vector2, to: Vector2, skipBackfaces: boolean): RayHit[] {
		return []
	}

	registerCollisionOverride(override: CollisionOverride<any, any>) { }

	registerCollisionHandler(handler: CollisionHandler<any, any>) { }

	step(dt: number) {

	}

	getTime(): number {
		return 0
	}

	debugDraw(drawLine: (points: Vector3[], color: Color) => void): void {}
}
