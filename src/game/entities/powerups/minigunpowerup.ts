import { Resource } from "game/resourcemanager";
import { Vehicle, VEHICLE_RADIUS } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";
import { Minigun, MINIGUN_DIAMETER } from "../weapons/minigun";

export class MinigunPowerupBox extends PowerupBox {

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/miniguncrate.glb")
	)

	constructor(
		position: Vector2,
	) {
		super(position, MinigunPowerupBox.model.get().model)
	}

	onCollect(collector: Vehicle) {
		super.onCollect(collector)
		
		let leftGun = new Minigun(collector,
			new Vector2(0.3, -VEHICLE_RADIUS * 0.7 - MINIGUN_DIAMETER / 2))
		let rightGun = new Minigun(collector,
			new Vector2(0.3, VEHICLE_RADIUS * 0.7 + MINIGUN_DIAMETER / 2))

		collector.activePowerup = {
			pressTrigger() {
				leftGun.setTrigger(true)
				rightGun.setTrigger(true)
			},
			releaseTrigger() {
				leftGun.setTrigger(false)
				rightGun.setTrigger(false)
			},
			cancel(){
				leftGun.dispose()
				rightGun.dispose()
				collector.activePowerup = null
			}
		}
	}
}



