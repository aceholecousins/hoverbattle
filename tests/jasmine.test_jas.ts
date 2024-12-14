
import { broker, EventChannel } from 'broker'

describe('calculate', function () {
	it('add', function () {
		broker.newChannel('myChannel')

		let myChannel: EventChannel = broker.myChannel

		let receivedEvent: any;

		myChannel.addHandler(e => {
			receivedEvent = e
		})

		myChannel.fire({
			name: 'eventName',
			data: 3
		})


		expect(receivedEvent.name).toBe('eventName')
		expect(receivedEvent.data).toBe(4)
		expect(receivedEvent.data).toBe(4)
	});
});