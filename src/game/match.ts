import { ActionCam } from "./actioncam";
import { ControllerManager } from "./controller/controllermanager";
import { Graphics } from "./graphics/graphics";
import { Physics } from "./physics/physics";
import { SoundFxPlayer } from "./sound/soundfx";

export interface Engine{
    graphics:Graphics,
    physics:Physics,
    controllerManager:ControllerManager,
    actionCam:ActionCam
	soundFxPlayer:SoundFxPlayer,
}

export interface Match{
    update(dt:number):void
}

export type MatchFactory = (
    engine:Engine
) => Promise<Match>