import * as assert from 'assert'
import test from 'node:test';
import { broker, EventChannel } from 'broker'

test('test broker', (t) => {
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

	assert.strictEqual(receivedEvent.name, 'eventName')
	assert.strictEqual(receivedEvent.data, 3)
});
