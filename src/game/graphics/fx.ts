import { Color, copyIfPresent } from "utils"
import { SceneNode, SceneNodeConfig } from "./scenenode"

export interface FxFactory {
	createExplosion(config: ExplosionConfig): void
}

export class ExplosionConfig extends SceneNodeConfig<"explosion"> {
	kind: "explosion" = "explosion"
	color: Color = { r: 1, g: 1, b: 1 }

	constructor(config: Partial<ExplosionConfig> = {}) {
		super(config)
		copyIfPresent(this, config, ["color"])
	}
}
