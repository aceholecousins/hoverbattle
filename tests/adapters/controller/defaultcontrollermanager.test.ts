import 'jsdom-global/register'
import {describe, it, before} from 'mocha'
import { expect } from 'chai'
import { DefaultControllerManager } from 'adapters/controller/defaultcontrollermanager'
import { Controller } from 'game/controller/controller'
import { ControllerManager } from 'game/controller/controllermanager'
import { Keyboard } from 'adapters/controller/keyboard'

describe('Test DefaultControllerManager', () => {

	let controllerManager: ControllerManager

	before(() => {
		controllerManager = new DefaultControllerManager()
	})

	it('Test keyboard is immediately connected', () => {
		let connectedControllers:Controller[] = new Array();
		controllerManager.addConnectionCallback(newController => connectedControllers.push(newController))
		expect(connectedControllers).to.have.lengthOf(2)
		expect(connectedControllers[0]).to.be.instanceOf(Keyboard)
		expect(connectedControllers[1]).to.be.instanceOf(Keyboard)
	})

	it('Remove connection callback', () => {
		let callback = (controller:Controller) => {}
		controllerManager.addConnectionCallback(callback)
		controllerManager.removeConnectionCallback(callback)
	})

	
})