
import {vec3, quat} from "gl-matrix"
import {Kind, Optionals, Color, Registry} from "../utils"

export interface GraphicsObjectConfig<K extends Kind>{
	kind:K
	position?:vec3
	orientation?:quat
	scaling?:vec3
}

export interface GraphicsObject<K extends Kind>{
	kind:K
	position?:vec3
	orientation?:quat
	scaling?:vec3
	remove():void
}

export const graphicsObjectDefaults:Optionals<GraphicsObjectConfig<any>> = {
	position:vec3.fromValues(0, 0, 0),
	orientation:quat.fromValues(0, 0, 0, 1),
	scaling:vec3.fromValues(1, 1, 1)
}

// factory for distinct object types
// where graphics object modules can register their individual factories
type GraphicsObjectConstructor<K extends Kind> = new(config: GraphicsObjectConfig<K>) => GraphicsObject<K>

class GraphicsObjectFactory{

    private factories: Registry<GraphicsObjectConstructor<any>> = {}

    register(kind: string, factory: GraphicsObjectConstructor<any>): void {
        this.factories[kind] = factory
    }

    createGraphicsObject<K extends Kind>(config: GraphicsObjectConfig<K>): GraphicsObject<K> {
        return new this.factories[config.kind](config)
    }
}

export const graphicsObjectFactory = new GraphicsObjectFactory()