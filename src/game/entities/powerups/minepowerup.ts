import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox, Powerup } from "./powerup";
import { getEngine } from "game/engine";
import { appendZ, Vector2 } from "math";
import { assignRole } from "../actor";
import { collideWithEverythingRole, fragileRole } from "../entity";
import { makeDamaging, makeDestructible } from "../damage";
import { Explosion } from "game/graphics/explosion/explosion";
import { assertNull } from "utils/general";
import { MineThrower } from "../weapons/mine";

export class MinePowerupBox extends PowerupBox {

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/minecrate.glb")
	)

	constructor(
		position: Vector2,
	) {
		super(position, MinePowerupBox.model.get().model)
	}

	onCollect(collector: Vehicle) {
		super.onCollect(collector)
		let launcher = new MineThrower(collector);
		let stock = 1
		collector.activePowerup = {
			pressTrigger() {
				let mine = launcher.tryShoot();
				if (mine) {
					mine.onPrime = () => {

						assignRole(mine, collideWithEverythingRole)

						let explode = () => {
							mine.dispose()
							new Explosion(
								appendZ(mine.body.getPosition(), 1),
								mine.parent.player.color
							)
						}

						makeDamaging(mine, 17, () => { explode() })
						makeDestructible(mine, 3, () => { explode() })
					}
					stock -= 1
					if (stock == 0) {
						collector.activePowerup?.cancel?.()
					}
				}
			},
			cancel() {
				collector.activePowerup = null
			}
		}
	}
}
