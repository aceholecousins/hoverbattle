import { Controller } from "domain/controller/controller";

enum Keys {
	UP = "KeyW",
	DOWN = "KeyS",
	RIGHT = "KeyD",
	LEFT = "KeyA",
	SHOOT = "Space",
	PAUSE = "Pause",
	SWITCH_MODE = "KeyM"
}

export class Keyboard implements Controller {

	private shooting: boolean = false
	private currentStrategy: ControlStrategy = new RelativeStrategy()

	constructor() {
		document.addEventListener("keydown", (event) => {
			this.onKeyAction(event, true)
		})
		document.addEventListener("keyup", (event) => {
			this.onKeyAction(event, false)
		})
	}

	getAbsoluteDirection(): number {
		return this.currentStrategy.getAbsoluteDirection();
	}

	getTurnRate(): number {
		return this.currentStrategy.getTurnRate();
	}

	getThrust(): number {
		return this.currentStrategy.getThrust();
	}

	isShooting(): boolean {
		return this.shooting
	}

	setPauseCallback(callback: () => void): void {
		throw new Error("Method not implemented.");
	}

	private onKeyAction(event: KeyboardEvent, value: boolean) {
		if (!event.repeat) {
			this.onGeneralKeyAction(event.code, value)
			this.currentStrategy.onKeyAction(event.code, value)
		}
	}
	private onGeneralKeyAction(keyCode: string, value: boolean) {
		switch (keyCode) {
			case Keys.SHOOT:
				this.shooting = value;
				break;
			case Keys.SWITCH_MODE:
				if (value) {
					this.switchStrategy();
				}
				break
		}
	}
	private switchStrategy() {
		if (this.currentStrategy instanceof RelativeStrategy) {
			console.log("Switch to absolute keyboard")
			this.currentStrategy = new AbsoluteStrategy()
		} else {
			console.log("Switch to relative keyboard")
			this.currentStrategy = new RelativeStrategy()
		}
	}
}

interface ControlStrategy {
	getAbsoluteDirection(): number
	getTurnRate(): number
	getThrust(): number
	onKeyAction(keyCode: string, value: boolean): void
}

class RelativeStrategy implements ControlStrategy {

	private turnRate: number = 0
	private thrust: number = 0

	private valueLeft = 0;
	private valueRight = 0;

	getAbsoluteDirection(): number {
		return undefined;
	}

	getTurnRate(): number {
		return this.turnRate
	}

	getThrust(): number {
		return this.thrust
	}

	onKeyAction(keyCode: string, value: boolean) {
		if (keyCode == Keys.UP) {
			this.thrust = value ? 1 : 0
		}
		if (keyCode == Keys.LEFT) {
			this.valueLeft = value ? 1 : 0
		}
		if (keyCode == Keys.RIGHT) {
			this.valueRight = value ? 1 : 0
		}
		this.turnRate = this.valueLeft - this.valueRight;
	}
}

class AbsoluteStrategy implements ControlStrategy {

	private absoluteDirection: number = undefined
	private thrust: number = 0

	private valueUp: number = 0
	private valueDown: number = 0
	private valueLeft: number = 0
	private valueRight: number = 0

	getAbsoluteDirection(): number {
		return this.absoluteDirection
	}

	getTurnRate(): number {
		return undefined
	}

	getThrust(): number {
		return this.thrust
	}

	onKeyAction(keyCode: string, value: boolean) {		
		switch (keyCode) {
			case Keys.UP:
				this.valueUp = value ? 1 : 0
				break
			case Keys.DOWN:
				this.valueDown = value ? 1 : 0
				break
			case Keys.RIGHT:
				this.valueRight = value ? 1 : 0
				break
			case Keys.LEFT:
				this.valueLeft = value ? 1 : 0
				break
		}
		let thrustX = this.valueRight - this.valueLeft;
		let thrustY = this.valueUp - this.valueDown;

		if (thrustX != 0 || thrustY != 0) {
			this.absoluteDirection = Math.atan2(thrustY, thrustX)
		} else {
			this.absoluteDirection = undefined
		}
		this.thrust = (thrustX != 0 || thrustY != 0) ? 1 : 0;
	}
}