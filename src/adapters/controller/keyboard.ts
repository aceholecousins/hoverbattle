import { Controller } from "domain/controller/controller";

export class Keyboard implements Controller {
	getAbsoluteDirection(): number {
		throw new Error("Method not implemented.");
	}
	getTurnRate(): number {
		throw new Error("Method not implemented.");
	}
	getThrust(): number {
		throw new Error("Method not implemented.");
	}
	isShooting(): boolean {
		throw new Error("Method not implemented.");
	}
	registerPauseCallback(callback: () => void): void {
		throw new Error("Method not implemented.");
	}
	removePauseCallback(): void {
		throw new Error("Method not implemented.");
	}	
}