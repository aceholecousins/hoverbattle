import { Controller } from "game/controller/controller";

export interface KeyboardLayout {
	up: string
	down: string
	right: string
	left: string
	shoot: string
	pause: string
	switchMode: string
}

const defaultLayout: KeyboardLayout = {
	up: "KeyW",
	down: "KeyS",
	right: "KeyD",
	left: "KeyA",
	shoot: "Space",
	pause: "KeyP",
	switchMode: "ShiftLeft",
}

export class Keyboard implements Controller {

	private shooting: boolean = false
	private currentStrategy: ControlStrategy

	constructor(private layout: KeyboardLayout = defaultLayout) {
		this.currentStrategy = new RelativeStrategy(layout)
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

	private onKeyAction(event: KeyboardEvent, isPressed: boolean) {
		if (!event.repeat) {
			this.onGeneralKeyAction(event.code, isPressed)
			this.currentStrategy.onKeyAction(event.code, isPressed)
		}
	}
	private onGeneralKeyAction(keyCode: string, isPressed: boolean) {
		switch (keyCode) {
			case this.layout.shoot:
				this.shooting = isPressed;
				break;
			case this.layout.switchMode:
				if (isPressed) {
					this.switchStrategy();
				}
				break
		}
	}
	private switchStrategy() {
		if (this.currentStrategy instanceof RelativeStrategy) {
			console.log("Switch to absolute keyboard")
			this.currentStrategy = new AbsoluteStrategy(this.layout)
		} else {
			console.log("Switch to relative keyboard")
			this.currentStrategy = new RelativeStrategy(this.layout)
		}
	}
}

interface ControlStrategy {
	getAbsoluteDirection(): number
	getTurnRate(): number
	getThrust(): number
	onKeyAction(keyCode: string, isPressed: boolean): void
}

class RelativeStrategy implements ControlStrategy {

	private turnRate: number = 0
	private thrust: number = 0

	private valueLeft = 0;
	private valueRight = 0;

	constructor(private layout: KeyboardLayout) {
	}

	getAbsoluteDirection(): number {
		return undefined;
	}

	getTurnRate(): number {
		return this.turnRate
	}

	getThrust(): number {
		return this.thrust
	}

	onKeyAction(keyCode: string, isPressed: boolean) {
		if (keyCode == this.layout.up) {
			this.thrust = isPressed ? 1 : 0
		}
		if (keyCode == this.layout.left) {
			this.valueLeft = isPressed ? 1 : 0
		}
		if (keyCode == this.layout.right) {
			this.valueRight = isPressed ? 1 : 0
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

	constructor(private layout: KeyboardLayout) {
	}

	getAbsoluteDirection(): number {
		return this.absoluteDirection
	}

	getTurnRate(): number {
		return undefined
	}

	getThrust(): number {
		return this.thrust
	}

	onKeyAction(keyCode: string, isPressed: boolean) {
		switch (keyCode) {
			case this.layout.up:
				this.valueUp = isPressed ? 1 : 0
				break
			case this.layout.down:
				this.valueDown = isPressed ? 1 : 0
				break
			case this.layout.right:
				this.valueRight = isPressed ? 1 : 0
				break
			case this.layout.left:
				this.valueLeft = isPressed ? 1 : 0
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