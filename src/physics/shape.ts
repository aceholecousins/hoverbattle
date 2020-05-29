
import {vec2} from "gl-matrix"
import {Kind, Registry, Optionals} from "../utils"

// parameters that are common to all shapes

export interface Shape<K extends Kind> {
    kind: K
	offset: vec2
	offsetAngle: number
	boundingRadius: number
}

export interface ShapeConfig<K extends Kind>{
	kind: K
	offset?: vec2
	offsetAngle?: number
}

export const shapeDefaults:Optionals<ShapeConfig<any>> = {
	offset: vec2.fromValues(0, 0),
	offsetAngle: 0
}

// factory for distinct shape types
// where shape modules can register their individual factories
type ShapeConstructor<K extends Kind> = new(config: ShapeConfig<K>) => Shape<K>

class ShapeFactory{

    private factories: Registry<ShapeConstructor<any>> = {}

    register(kind: string, factory: ShapeConstructor<any>): void {
        this.factories[kind] = factory
    }

    createShape<K extends Kind>(config: ShapeConfig<K>): Shape<K> {
        return new this.factories[config.kind](config)
    }
}

export const shapeFactory = new ShapeFactory()
