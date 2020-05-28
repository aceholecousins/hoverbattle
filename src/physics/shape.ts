
import {vec2} from "gl-matrix"
import {Registry, Optionals} from "../utils"

// parameters that are common to all shapes

export interface Shape {
    kind: string
	offset: vec2
	offsetAngle: number
	boundingRadius: number
}

// the Pick<...> enforces Blob (which is a Shape)
// and BlobConfig (which is a ShapeConfig<Blob>)
// to have the same kind attribute
export interface ShapeConfig<S extends Shape> extends Pick<S, "kind"> {
	offset?: vec2
	offsetAngle?: number
}
export const shapeDefaults:Optionals<ShapeConfig<any>> = {
	offset: vec2.fromValues(0, 0),
	offsetAngle: 0
}

// factory for distinct shape types
// where shape modules can register their individual factories

type ShapeConstructor<S extends Shape> = new(config: ShapeConfig<S>) => S

class ShapeFactory{

    private factories: Registry<ShapeConstructor<any>> = {}

    register(kind: string, factory: ShapeConstructor<any>): void {
        this.factories[kind] = factory
    }

    createShape<S extends Shape>(config: ShapeConfig<S>): S {
        return new this.factories[config.kind](config)
    }
}

export const shapeFactory = new ShapeFactory()
