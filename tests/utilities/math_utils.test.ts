import 'mocha'
import {expect} from 'chai'
import { wrapAngle } from 'utilities/math_utils'

describe('Test math utils', () => {
	it('Wrap angle at Math.PI', () => {
		expect(wrapAngle(0)).to.equal(0)
		
		expect(wrapAngle(Math.PI/2)).to.equal(Math.PI/2)
		expect(wrapAngle(-Math.PI/2)).to.equal(-Math.PI/2)
		
		expect(wrapAngle(Math.PI)).to.equal(-Math.PI)
		expect(wrapAngle(-Math.PI)).to.equal(-Math.PI)
		
		expect(wrapAngle(Math.PI * 1.5)).to.equal(-Math.PI/2)
		expect(wrapAngle(-Math.PI * 1.5)).to.equal(Math.PI/2)

		expect(wrapAngle(Math.PI * 2)).to.equal(0)
		expect(wrapAngle(-Math.PI * 2)).to.equal(0)

		expect(wrapAngle(Math.PI * 3.5)).to.equal(-Math.PI/2)
		expect(wrapAngle(-Math.PI * 3.5)).to.equal(Math.PI/2)

		expect(wrapAngle(Math.PI * 4)).to.equal(0)
		expect(wrapAngle(-Math.PI * 4)).to.equal(0)
	})
})