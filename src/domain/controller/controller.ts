import { vec2 } from "gl-matrix";

/**
 * Interface for one controller which is able to control one vehicle.
 * Could be any human interface device like keyboard, mouse, game pad, touch device etc.
 */
export interface Controller {

	/**
	 * @returns the current thrust value as a floating point value between 0 and 1.
	 * 			Never undefined.
	 */
	getThrust():number
	
	/**
	 * @returns the current absolute direction in rad. 0 pointing up, pi/2 pointing to the right.
	 * 			May be undefined.
	 */
	getAbsoluteDirection():number
	
	/**
	 * @returns the current change rate of the direction as a floating point value between -1 and 1.
	 * 			0 means no change, -1 means maximum rate to the left, 1 means maximum rate to the right.
	 * 			May be undefined.
	 */
	getDirectionChangeRate():number

	/**
	 * Registers a callback which is called whenever the shoot button of the Controller ist pressed.
	 * There is only one callback which means that each subsequent call overwrites the current callback.
	 * 
	 * @param callback Function which is called when the shoot button is pressed.
	 */
	registerShootCallback(callback: () => void): void

	/**
	 * Removes the currently registered shoot callback.
	 */
	removeShootCallback(): void
}