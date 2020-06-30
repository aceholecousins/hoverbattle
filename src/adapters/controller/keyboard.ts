import { Controller } from "domain/controller/controller";

enum Keys {
	UP = "KeyW",
	DOWN = "KeyS",
	RIGHT = "KeyD",
	LEFT = "KeyA",
	SHOOT = "Space",
	PAUSE = "Pause"
}

abstract class Keyboard implements Controller {

	protected thrust: number = 0
	private shooting: boolean = false

	constructor() {
		document.addEventListener("keydown", (event) => {
			this.onKeyAction(event, 1)
		})
		document.addEventListener("keyup", (event) => {
			this.onKeyAction(event, 0)
		})
	}

	getAbsoluteDirection(): number {
		return undefined
	}

	getTurnRate(): number {
		return undefined
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

	protected onKeyAction(event: KeyboardEvent, value: number) {
		if (!event.repeat) {
			this.onGeneralKeyAction(event.key, value)
			this.onSpecialKeyAction(event.key, value)			
		}
	}
	private onGeneralKeyAction(key: string, value: number) {
		if (key == Keys.SHOOT) {
			this.shooting = (value != 0);
		}
	}

	protected abstract onSpecialKeyAction(key: string, value: number): void
	
}

export class RelativeKeyboard extends Keyboard {

	private turnRate: number = undefined

	constructor() {
		super()
	}

	getTurnRate(): number {
		return this.turnRate
	}

	onSpecialKeyAction(key: string, value: number) {
		if (key == Keys.UP) {
			this.thrust = value
		}

		this.turnRate = 0
		if (key == "KeyA") {
			this.turnRate -= value
		}
		if (key == "KeyD") {
			this.turnRate += value
		}
	}
}

export class AbsoluteKeyboard extends Keyboard {

	private absoluteDirection: number = 0

	private thrustX: number = 0
	private thrustY: number = 0

	constructor() {
		super()
	}

	getAbsoluteDirection(): number {
		return this.absoluteDirection
	}

	onSpecialKeyAction(key: string, value: number) {
		let delta = (value * 2) - 1
		switch (key) {
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
		if(this.thrustX != 0 || this.thrustY != 0) {
			this.absoluteDirection = Math.atan2(this.thrustY, this.thrustX)
		}
		this.thrust = (this.thrustX != 0 || this.thrustY != 0) ? 1 : 0;
	}
}