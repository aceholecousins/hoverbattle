

interface Shape {
    kind: string
    offset: number[]
}

// the Pick<...> enforces Blob (which is a Shape)
// and BlobConfig (which is a ShapeConfig<Blob>)
// to have the same kind attribute
interface ShapeConfig<S extends Shape> extends Pick<S, "kind"> {
    offset?: number[]
}

interface Circle extends Shape {
    kind: "circle"
    radius: number
}

interface CircleConfig extends ShapeConfig<Circle> {
    kind: "circle"
    radius?: number
}



type ShapeFactoryEntry<S extends Shape> = (config: ShapeConfig<S>) => S

type Registry<T> = { [index: string]: T }

class ShapeFactory {

    private factories: Registry<ShapeFactoryEntry<any>> = {}

    register(kind: string, factory: ShapeFactoryEntry<any>): void {
        this.factories[kind] = factory
    }

    createShape<S extends Shape>(config: ShapeConfig<S>): S {
        return this.factories[config.kind](config)
    }
}

export const shapeFactory = new ShapeFactory()

//somewhere in p2 code
let p2circleFactory: ShapeFactoryEntry<Circle> =
    function (config: CircleConfig): Circle {
        return {
            kind: "circle",
            radius: typeof(config.radius) !== "undefined"? config.radius : 1,
            offset: typeof(config.offset) !== "undefined"? config.offset : [0, 0],
        }
    }

shapeFactory.register("circle", p2circleFactory)

let myShape = shapeFactory.createShape({ kind: "circle" })

let myCircle = shapeFactory.createShape<Circle>({ kind: "circle" })
myCircle.radius = 7
