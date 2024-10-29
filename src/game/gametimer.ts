import { broker } from 'broker'

export class GameTimer {
	public countdown = 0
	private updateHandler = (e: any) => this.update(e.dt)

	constructor(
		private callback: () => void,
		public interval: number,
		public repeat = false
	) {
		this.countdown = interval
		broker.update.addHandler(this.updateHandler)
	}

	update(dt: number) {
		this.countdown -= dt
		if (this.countdown <= 0) {
			this.callback()
			if (this.repeat) {
				this.countdown += this.interval
			}
			else {
				this.cancel()
			}
		}
	}

	cancel() {
		broker.update.removeHandler(this.updateHandler)
	}
}