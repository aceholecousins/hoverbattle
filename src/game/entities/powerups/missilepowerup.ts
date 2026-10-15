import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox, Powerup } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";
import { assignRole } from "../actor";
import { collideWithEverythingRole, fragileRole } from "../entity";
import { makeDamaging, makeDestructible } from "../damage";

let missileBoxModel = new Resource(() =>
	getEngine().graphics.loadModel("assets/models/missilecrate.glb")
)

export class MissilePowerupBox extends PowerupBox {

	constructor(
		position: Vector2,
	) {
		super(position, missileBoxModel.get().model)
	}

	onCollect(collector: Vehicle) {
		super.onCollect(collector)
		let launcher = new MissileLauncher(collector);
		collector.activePowerup = {
			pressTrigger() {
				let missile = launcher.tryShoot([]);
				if (missile) {
					assignRole(missile, collideWithEverythingRole)

					let explode = () => {
						missile.dispose()
						// createExplosion( // TODO when Explosion no longer needs factory
						// 	appendZ(missile.body.getPosition(), 1),
						// 	missile.parent.player.color
						// )
					}

					makeDamaging(missile, 17, () => { explode() })
					makeDestructible(missile, 3, () => { explode() })

				}
			}
		}
	}
}
