
import { Vector2, Triangle2 } from "math"

export class Shape { }

export class Circle extends Shape {
	constructor(
		public radius: number = 1,
		public center: Vector2 = new Vector2(0, 0)
	) {
		super()
	}
}

export class Triangle extends Shape {
	constructor(public corners: Triangle2 = [
		new Vector2(1, 0),
		new Vector2(-1, 1),
		new Vector2(-1, -1)
	]) {
		super()
	}
}
