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
	private currentStrategy: ControlStrategy = new RelativeStrategy

	constructor() {
		document.addEventListener("keydown", (event) => {
			this.onKeyAction(event, 1)
		})
		document.addEventListener("keyup", (event) => {
			this.onKeyAction(event, 0)
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

	private onKeyAction(event: KeyboardEvent, value: number) {
		if (!event.repeat) {
			this.onGeneralKeyAction(event.code, value)
			this.currentStrategy.onKeyAction(event.code, value)
		}
	}
	private onGeneralKeyAction(keyCode: string, value: number) {
		switch (keyCode) {
			case Keys.SHOOT:
				this.shooting = (value != 0);
				break;
			case Keys.SWITCH_MODE:
				if (value != 0) {
					this.switchStrategy();
				}
				break
		}
	}
	private switchStrategy() {
		if (this.currentStrategy instanceof RelativeStrategy) {
			console.log("Switch to absolute keyboard")
			this.currentStrategy = new AbsoluteStrategy
		} else {
			console.log("Switch to relative keyboard")
			this.currentStrategy = new RelativeStrategy
		}
	}
}

interface ControlStrategy {
	getAbsoluteDirection(): number
	getTurnRate(): number
	getThrust(): number
	onKeyAction(keyCode: string, value: number): void
}

class RelativeStrategy implements ControlStrategy {

	private turnRate: number = 0
	private thrust: number = 0

	private leftValue = 0;
	private rightValue = 0;

	getAbsoluteDirection(): number {
		return undefined;
	}

	getTurnRate(): number {
		return this.turnRate
	}

	getThrust(): number {
		return this.thrust
	}

	onKeyAction(keyCode: string, value: number) {
		if (keyCode == Keys.UP) {
			this.thrust = value
		}
		if (keyCode == Keys.LEFT) {
			this.leftValue = value
		}
		if (keyCode == Keys.RIGHT) {
			this.rightValue = value
		}
		this.turnRate = this.rightValue - this.leftValue;
	}
}

class AbsoluteStrategy implements ControlStrategy {

	private absoluteDirection: number = undefined
	private thrust: number = 0

	private thrustX: number = 0
	private thrustY: number = 0

	getAbsoluteDirection(): number {
		return this.absoluteDirection
	}

	getTurnRate(): number {
		return undefined
	}

	getThrust(): number {
		return this.thrust
	}

	onKeyAction(keyCode: string, value: number) {
		let delta = (value * 2) - 1
		switch (keyCode) {
			case Keys.UP:
				this.thrustY += delta
				break
			case Keys.DOWN:
				this.thrustY -= delta
				break
			case Keys.RIGHT:
				this.thrustX += delta
				break
			case Keys.LEFT:
				this.thrustX -= delta
				break
		}
		if (this.thrustX != 0 || this.thrustY != 0) {
			this.absoluteDirection = Math.atan2(this.thrustY, this.thrustX)
		} else {
			this.absoluteDirection = undefined
		}
		this.thrust = (this.thrustX != 0 || this.thrustY != 0) ? 1 : 0;
	}
}