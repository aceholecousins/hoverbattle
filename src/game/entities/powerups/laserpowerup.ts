import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";
import { LaserBeamRoot } from "../weapons/laser";

export class LaserPowerupBox extends PowerupBox {

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/lasercrate.glb")
	)

	constructor(
		position: Vector2,
	) {
		super(position, LaserPowerupBox.model.get().model)
	}

	onCollect(collector: Vehicle) {
		super.onCollect(collector)
		let laser: LaserBeamRoot | null = null

		collector.activePowerup = {
			pressTrigger() {
				laser = new LaserBeamRoot(collector, 1)
			},
			cancel() {
				collector.activePowerup = null
			}
		}
	}
}
