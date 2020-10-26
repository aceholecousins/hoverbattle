import { Controller } from "./controller";

/**
 * Callback definition for getting notified about new Controllers
 */
export type ConnectionCallback = (controller: Controller) => void

/**
 * Interface of a manager taking care of newly connected Conrollres.
 * Only handles Controllers which are connected for the first time.
 * Reconnects are handled by Controllers temselves.
 */
export interface ControllerManager {

	/**
	 * Add a callback which is called whenever a new Controller is connected for the first time.
	 * @param callback Callback to be called in that case
	 */
	addConnectionCallback(callback: ConnectionCallback): void

	/**
	 * Remove a callback again. The callback needs to be the same that has been registered.
	 * @param callbackToBeRemoved Callback to be removed
	 */
	removeConnectionCallback(callbackToBeRemoved: ConnectionCallback): void
}