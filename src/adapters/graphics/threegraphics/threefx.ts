import { ExplosionConfig, FxFactory } from "game/graphics/fx";
import { createSmokeBall, init as initSmokeBall } from "./smokeball";

export class ThreeFxFactory implements FxFactory {

	constructor(scene:THREE.Scene) {
		initSmokeBall(scene)
	}

	createExplosion(config: ExplosionConfig): void {
		createSmokeBall(config)
	}

}