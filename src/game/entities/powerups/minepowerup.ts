import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { PowerupBox } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";
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
		collector.activePowerup = {
			pressTrigger() {
				launcher.tryShoot();
			},
			cancel() {
				launcher.dispose()
				collector.activePowerup = null
			}
		}
	}
}
