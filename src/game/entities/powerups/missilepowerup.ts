import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";

export class MissilePowerupBox extends PowerupBox {

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/missilecrate.glb")
	)

	constructor(
		position: Vector2,
	) {
		super(position, MissilePowerupBox.model.get().model)
	}

	onCollect(collector: Vehicle) {
		super.onCollect(collector)
		let launcher = new MissileLauncher(collector);
		collector.activePowerup = {
			pressTrigger() {
				launcher.tryShoot([]);
			},
			cancel(){
				launcher.dispose()
				collector.activePowerup = null
			}
		}
	}
}
