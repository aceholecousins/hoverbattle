import { Vehicle } from "../vehicles/vehicle";
import { MissileLauncher } from "../weapons/missile";
import { PowerupBox, PowerupHandle } from "./powerup";

export class MissilePowerup extends PowerupBox {

    onCollect(collector: Vehicle): PowerupHandle {
        super.onCollect(collector)
        let launcher = new MissileLauncher(collector);
        return {cancel(){}}
    }
    
}