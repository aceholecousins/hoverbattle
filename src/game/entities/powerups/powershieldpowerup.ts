import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { PowerupBox } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";
import { PowerShield } from "../weapons/powershield";

export class PowerShieldPowerupBox extends PowerupBox {

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/powershieldcrate.glb")
	)

	constructor(
		position: Vector2,
	) {
		super(position, PowerShieldPowerupBox.model.get().model)
	}

	onCollect(collector: Vehicle) {
		super.onCollect(collector)
		let shield = new PowerShield(collector)

		collector.activePowerup = {
			cancel() {
				shield.dispose()
				collector.activePowerup = null
			}
		}
	}
}
