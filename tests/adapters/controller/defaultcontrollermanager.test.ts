import 'mocha'
import { JSDOM } from 'jsdom'
import { expect } from 'chai'
import { DefaultControllerManager } from 'adapters/controller/defaultcontrollermanager'

describe('Test DefaultControllerManager', () => {

	let window = new JSDOM('...').window;
	let document: Document = window.document;
	let controllerManager: DefaultControllerManager

	before(() => {
		controllerManager = new DefaultControllerManager()
	})

	it('Initial State', () => {
	})

	
})