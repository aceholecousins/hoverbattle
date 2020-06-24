
import * as p2 from "p2"
import {P2Shape, p2shapeFactory} from "./p2shape"
import {Circle, CircleConfig, circleDefaults} from "../../../domain/physics/circle"

export class P2Circle extends P2Shape<"circle"> implements Circle{
	kind:"circle"
	p2shape:p2.Circle

	constructor(config: CircleConfig){
		const filledConfig:Required<CircleConfig> =
			{...circleDefaults, ...config}
		super()
		this.p2shape = new p2.Circle()
		Object.assign(this, filledConfig)
	}

	set radius(r: number){
		this.p2shape.radius = r
		this.updateP2()
	}
	get radius():number{
		return this.p2shape.radius
	}

	set boundingRadius(r: number){
		this.p2shape.radius = r
		this.updateP2()
	}
	get boundingRadius(){
		return this.p2shape.boundingRadius
	}
}

p2shapeFactory.register("circle", P2Circle)


