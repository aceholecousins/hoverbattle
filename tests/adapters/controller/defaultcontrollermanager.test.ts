import 'mocha'
import { JSDOM } from 'jsdom'
import { expect } from 'chai'
import { DefaultControllerManager } from 'adapters/controller/defaultcontrollermanager'

describe('Test DefaultControllerManager', () => {

	let window = new JSDOM('...').window;
	let document: Document = window.document;
	let controllerManager: DefaultControllerManager

	before(() => {
		controllerManager = new DefaultControllerManager(document)
	})

	it('Initial State', () => {
		let controllers = controllerManager.getAllConnectedControllers();
		expect(controllers).to.be.empty
	})

	
})