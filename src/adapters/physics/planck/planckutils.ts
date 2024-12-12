import { Vector2 } from "math";
import { Vec2 } from "planck";

export function toVec2(v: Vector2): Vec2 {
	return new Vec2(v.x, v.y);
}