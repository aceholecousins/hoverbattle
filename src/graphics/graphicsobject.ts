
import {vec3, quat} from "gl-matrix"
import {Kind, Optionals, Color, Registry} from "../utils"

export interface GraphicsObject<K extends Kind>{
	kind:K
	position?:vec3
	orientation?:quat
	scaling?:vec3
	remove():void
}

// a config is associated with the type it configures so the factory can return this type
export interface GraphicsObjectConfig<K extends Kind, GO extends GraphicsObject<K>>{
	kind:K
	position?:vec3
	orientation?:quat
	scaling?:vec3
}

export const graphicsObjectDefaults:Optionals<GraphicsObjectConfig<any, any>> = {
	position:vec3.fromValues(0, 0, 0),
	orientation:quat.fromValues(0, 0, 0, 1),
	scaling:vec3.fromValues(1, 1, 1)
}

// factory for distinct object types
// where graphics object modules can register their individual factories
type GraphicsObjectConstructor<K extends Kind, GO extends GraphicsObject<K>> =
	new(config: GraphicsObjectConfig<K, GO>) => GO


class GraphicsObjectFactory{

    private factories: Registry<GraphicsObjectConstructor<any, any>> = {}

    register(kind: string, factory: GraphicsObjectConstructor<any, any>): void {
        this.factories[kind] = factory
    }

    createGraphicsObject<K extends Kind, GO extends GraphicsObject<K>>(
		config: GraphicsObjectConfig<K, GO>
	): GO {
        return new this.factories[config.kind](config)
    }
}

export const graphicsObjectFactory = new GraphicsObjectFactory()