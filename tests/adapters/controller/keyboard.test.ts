import 'jsdom-global/register'
import 'mocha'
import { expect } from 'chai'
import { Keyboard } from 'adapters/controller/keyboard'

describe('Test keyboard', () => {

	let keyboard: Keyboard

	before(() => {
		keyboard = new Keyboard();
	})

	it('Shooting', () => {
		document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "Space" }));
		expect(keyboard.isShooting()).to.be.true;
		document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "Space" }));
		expect(keyboard.isShooting()).to.be.false;
	})

	describe('Relative keyboard', () => {

		it('Initial state', () => {
			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getTurnRate()).to.equal(0)
			expect(keyboard.getThrust()).to.equal(0)
			expect(keyboard.isShooting()).to.be.false
		})

		it('Directions', () => {
			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyD" }));
			expect(keyboard.getTurnRate()).to.equal(-1)

			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyA" }));
			expect(keyboard.getTurnRate()).to.equal(0)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyD" }));
			expect(keyboard.getTurnRate()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyD" }));
			expect(keyboard.getTurnRate()).to.equal(0)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyA" }));
			expect(keyboard.getTurnRate()).to.equal(-1)

			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getThrust()).to.equal(0)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyD" }));
		})

		it('Thrust', () => {
			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyW" }));
			expect(keyboard.getThrust()).to.equal(1)
			expect(keyboard.getTurnRate()).to.equal(0)
			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyW" }));
			expect(keyboard.getThrust()).to.equal(0)
		})
	})

	describe('Absolute Keyboard', () => {

		before(() => {
			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyM" }));
		})

		it('Initial state', () => {
			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getTurnRate()).to.be.undefined
			expect(keyboard.getThrust()).to.equal(0)
			expect(keyboard.isShooting()).to.be.false
		})

		it('Directions', () => {
			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyD" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(0)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyW" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(Math.PI / 4)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyD" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(Math.PI / 2)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyA" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(Math.PI * 3 / 4)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyW" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(Math.PI)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyS" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(- Math.PI * 3 / 4)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyA" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(- Math.PI / 2)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyD" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(- Math.PI / 4)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyS" }));
			expect(keyboard.getAbsoluteDirection()).to.equal(0)
			expect(keyboard.getThrust()).to.equal(1)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyD" }));
			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getThrust()).to.equal(0)
		})

		it('Opposite Directions', () => {
			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyD" }));
			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyA" }));
			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getThrust()).to.equal(0)

			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyW" }));
			document.dispatchEvent(new window.KeyboardEvent("keydown", { code: "KeyS" }));
			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getThrust()).to.equal(0)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyD" }));
			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyA" }));
			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getThrust()).to.equal(0)

			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyW" }));
			document.dispatchEvent(new window.KeyboardEvent("keyup", { code: "KeyS" }));
			expect(keyboard.getAbsoluteDirection()).to.be.undefined
			expect(keyboard.getThrust()).to.equal(0)
		})
	})
})