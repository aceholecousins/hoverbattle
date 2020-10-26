
/**
 * Worker bridge communication interface for each Controller.
 * Direction: UI -> Engine
 */
export interface ControllerBridge {

	setAbsoluteDirection(value:number):void
	setTurnRate(value:number):void
	setThrust(value:number):void
	setShooting(value:boolean):void
}

/**
 * Worker bridge communication interface for the Controller Manager.
 * Direction: UI -> Engine
 */
export interface ControllerManagerBridge {

	/**
	 * Notifies the engine that a new Controller has been connected for the first time.
	 * The engine has to create a proxy for this Controller in order to use it.
	 * 
	 * @param bridgeKey Key of the new Controller to be used for proxy creation
	 */
	controllerAdded(bridgeKey:string):void
}