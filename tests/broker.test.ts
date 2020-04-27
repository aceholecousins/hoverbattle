import 'mocha'
import {expect} from 'chai'
import {broker, EventChannel, newChannel as newBrokerChannel} from '../src/broker'

describe('Test broker', () => {
	it('fire', () => {
		
		newBrokerChannel('myChannel')
		
		newBrokerChannel('myChannel')

		let receivedEvent:any;

		broker.myChannel.addHandler(e => {
			receivedEvent = e
		})

		broker.myChannel.fire( {
			name: 'eventName',
			data: 3
		})

		expect(receivedEvent.name).to.equal('eventName')
		expect(receivedEvent.data).to.equal(3)

	})
})