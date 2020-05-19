import {ShapeBase, Shape, CircleConfig, Circle, RectangleConfig, Rectangle, ShapeConfig} from "../shapes.js"
import * as p2 from "p2"
import { vec2 } from "gl-matrix"

export abstract class P2ShapeBase implements ShapeBase{
	kind: string
	
	abstract p2shape: p2.Shape
	
	updateP2(){
		this.p2shape.updateBoundingRadius()
		this.p2shape.body.aabbNeedsUpdate = true
		this.p2shape.body.updateBoundingRadius()
	}

	set offset(p: vec2){
		vec2.copy(this.p2shape.position, p)
	}
	get offset(){
		return vec2.clone(this.p2shape.position)
	}

	set offsetAngle(phi: number){
		this.p2shape.angle = phi
	}
	get offsetAngle(){
		return this.p2shape.angle
	}

	abstract boundingRadius: number

}

export class P2Circle extends P2ShapeBase implements Circle{
	kind:"circle"
	p2shape:p2.Circle

	constructor(cfg: CircleConfig){
		super()
		this.p2shape = new p2.Circle()
		this.p2shape.radius = 1
		Object.assign(this, cfg)
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

export class P2Rectangle extends P2ShapeBase implements Rectangle{
	kind:"rectangle"
	p2shape:p2.Box

	constructor(cfg: RectangleConfig){
		super()
		this.p2shape = new p2.Box()
		this.p2shape.width = 2
		this.p2shape.height = 2
		Object.assign(this, cfg)
	}

	set sides(s: vec2){
		this.p2shape.width = s[0]
		this.p2shape.height = s[1]
	}
	get sides():vec2{
		return vec2.fromValues(
			this.p2shape.width,
			this.p2shape.height			
		)
	}
	set boundingRadius(r: number){
		let scale = r / this.p2shape.boundingRadius
		this.p2shape.width *= scale
		this.p2shape.height *= scale
		this.updateP2()
	}
	get boundingRadius(){
		return this.p2shape.boundingRadius
	}

}

export type P2Shape = P2Circle | P2Rectangle

export function createP2Shape(cfg:ShapeConfig){
	switch(cfg.kind){
		case "circle":
			return new P2Circle(cfg)
		case "rectangle":
			return new P2Rectangle(cfg)
	}
}