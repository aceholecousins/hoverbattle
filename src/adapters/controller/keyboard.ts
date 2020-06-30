import { Controller, ControlType } from "domain/controller/controller";

enum Keys {
	UP = "KeyW",
	DOWN = "KeyS",
	RIGHT = "KeyD",
	LEFT = "KeyA",
	SHOOT = "Space",
	PAUSE = "Pause"
}

export class Keyboard implements Controller {

	private controlType: ControlType

	private absoluteDirection: number = undefined
	private turnRate: number = undefined
	private thrust: number = 0
	private shooting: boolean = false

	constructor(controlType: ControlType) {
		this.controlType = controlType

		if(controlType == ControlType.RELATIVE) {
			this.turnRate = 0
		} else {
			this.absoluteDirection = 0
		}

		document.addEventListener("keydown", (event) => {
			this.onKeyAction(event, 1)
		})
		document.addEventListener("keyup", (event) => {
			this.onKeyAction(event, 0)
		})
	}

	getAbsoluteDirection(): number {
		return this.absoluteDirection
	}
	getTurnRate(): number {
		return this.turnRate
	}
	getThrust(): number {
		return this.thrust
	}
	isShooting(): boolean {
		return this.shooting
	}
	setPauseCallback(callback: () => void): void {
		throw new Error("Method not implemented.");
	}

	private onKeyAction(event:KeyboardEvent, value: number) {
		if(!event.repeat) {
			this.onGeneralKeyAction(event.key, value)
			if(this.controlType == ControlType.RELATIVE) {				
				this.onRelativeKeyAction(event.key, value)
			} else {
				this.onAbsoluteKeyAction(event.key, value)
			}
		}
	}
	onGeneralKeyAction(key: string, value: number) {
		if(key == Keys.SHOOT) {
			this.shooting = (value != 0);
		}
	}

	onRelativeKeyAction(key: string, value: number) {
		if(key == Keys.UP) {
			this.thrust = value
		}

		this.turnRate = 0
		if(key == "KeyA") {
			this.turnRate -= value
		}
		if(key == "KeyD"){
			this.turnRate += value
		}
	}

	onAbsoluteKeyAction(key: string, value: number) {
		throw new Error("Method not implemented.");
	}	
}