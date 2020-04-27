
type EventHandler = (event: any) => any

class EventChannel {
	private handlers = new Set<EventHandler>()

	addHandler(handler: EventHandler) {
		this.handlers.add(handler)
	}

	removeHandler(handler: EventHandler) {
		this.handlers.delete(handler)
	}

	fire(event: any) {
		this.handlers.forEach(function (handler) {
			handler(event)
		})
	}

	fetch(request: any) {
		let responses: any[] = []
		this.handlers.forEach(function (handler) {
			let response: any = handler(request)
			if (response !== undefined) {
				responses.push(response)
			}
		})
		return responses
	}
}

let broker: { [key: string]: EventChannel } = {}

function newChannel(name: string): void {
	if (broker.hasOwnProperty(name)) {
		throw new Error('channel "' + name + '" already exists')
	}
	else {
		broker[name] = new EventChannel()
	}
}

export { EventChannel, broker, newChannel }
