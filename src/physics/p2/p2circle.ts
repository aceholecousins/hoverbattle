
import * as p2 from "p2"
import {shapeFactory} from "../shape"
import {P2Shape} from "./p2shape"
import {Circle, CircleConfig, defaultCircleConfig} from "../circle"
import { defaultTo } from "../../utils"

export class P2Circle extends P2Shape implements Circle{
	kind:"circle"
	p2shape:p2.Circle

	constructor(config: CircleConfig){
		super(config)
		this.p2shape = new p2.Circle()
		this.p2shape.radius = defaultTo(config.radius, defaultCircleConfig.radius)
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

shapeFactory.register("circle", P2Circle)