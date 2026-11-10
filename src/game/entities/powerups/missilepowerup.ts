import { Resource } from "game/resourcemanager";
import { Vehicle } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox } from "./powerup";
import { getEngine } from "game/engine";
import { Vector2 } from "math";
import { Context } from "game/context"

export class MissilePowerupBox extends PowerupBox {

	private static model = new Resource(() =>
		getEngine().graphics.loadModel("assets/models/missilecrate.glb")
	)

	constructor(
		position: Vector2,
		private context: Context
	) {
		super(position, MissilePowerupBox.model.get().model)
	}

	onCollect(collector: Vehicle) {

		super.onCollect(collector)

		let launcher: MissileLauncher

		let cancel = () => {
			launcher.dispose()
			collector.activePowerup = null
		}

		let context = this.context

		collector.activePowerup = {
			pressTrigger() {
				const opponents = context.vehicles.filter(v => v.player.team !== collector.player.team)
				launcher.tryShoot(opponents);
			},
			cancel
		}

		launcher = new MissileLauncher(collector, cancel);
	}
}
