
import { Triangle3 } from "utilities/math_utils"
import { SceneNodeConfig } from "./scenenode"

export class Model { readonly kind = "model" }
export class Skybox { readonly kind = "skybox" }

export class ModelMetaData {
	[key: string]: Triangle3[] | SceneNodeConfig<"empty">
}

export interface ModelLoader {
	(file: string): Promise<{ model: Model; meta: ModelMetaData }>;
}

export interface SpriteLoader {
	(file: string): Promise<Model>;
}

export interface SkyboxLoader {
	(file: string): Promise<Skybox>;
}