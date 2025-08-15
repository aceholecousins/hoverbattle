
/**
 * Interface for one controller which is able to control one vehicle.
 * Could be any human interface device like keyboard, mouse, game pad, touch device etc.
 */
export interface Controller {

	/**
	 * @returns the current absolute direction in rad.
	 * 			In the mathematical sense:
	 * 			0 pointing to the right, pi/2 pointing up.
	 * 			Always between -pi and pi.
	 * 			May be undefined.
	 */
	getAbsoluteDirection(): number | undefined

	/**
	 * @returns the current change rate of the direction as a floating point value between -1 and 1.
	 * 			In the mathematical sense:
	 * 			0 means no change, 1 means maximum rate to the left, -1 means maximum rate to the right.
	 * 			May be undefined.
	 */
	getTurnRate(): number | undefined

	/**
	 * @returns the current thrust value as a floating point value between 0 and 1.
	 * 			Never undefined.
	 */
	getThrust(): number

	/**
	 * @returns true if the player holds down the shoot button, false otherwise.
	 */
	isShooting(): boolean

	/**
	 * Sets a callback which is called whenever the pause button of the controller ist pressed.
	 * There is only one callback which means that each subsequent call overwrites the current callback.
	 * 
	 * @param callback Function which is called when the pause button is pressed. Pass null in order to remove the set callback
	 */
	setPauseCallback(callback: () => void): void
}