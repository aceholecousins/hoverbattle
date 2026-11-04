import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { PowerupBox } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";
import { destructibleRole } from "../damage";
import { VEHICLE_HP } from "arenas/testy_mountains/script";
import { hasRole } from "../actor";

export class RepairPowerupBox extends PowerupBox {

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/repaircrate.glb")
	)

	constructor(
		position: Vector2,
	) {
		super(position, RepairPowerupBox.model.get().model)
	}

	onCollect(collector: Vehicle) {
		super.onCollect(collector)
		if (hasRole(collector, destructibleRole)) {
			collector.repair(VEHICLE_HP)
		}
	}
}
