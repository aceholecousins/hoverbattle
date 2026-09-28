import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox, Powerup } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";

let missileBoxModel = new Resource(() =>
	getEngine().graphics.loadModel("assets/models/missile.glb")
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
				launcher.tryShoot([]);
			}
		}
	}
}
