import {describe, it} from 'mocha'
import {expect} from 'chai'
import {broker, EventChannel} from 'broker'

describe('Test broker', () => {
	it('fire', () => {
		
		broker.newChannel('myChannel')
		
		let myChannel:EventChannel = broker.myChannel

		let receivedEvent:any;

		myChannel.addHandler(e => {
			receivedEvent = e
		})

		myChannel.fire( {
			name: 'eventName',
			data: 3
		})

		expect(receivedEvent.name).to.equal('eventName')
		expect(receivedEvent.data).to.equal(3)

	})
})