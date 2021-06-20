import { Sound, SoundFxPlayer } from "game/sound/soundfx";

export class VanillaSoundFxPlayer implements SoundFxPlayer {

	async loadSound(file: string): Promise<Sound> {
		return new Promise((resolve, reject) => {
			const audioElement = new Audio(file)
			audioElement.addEventListener('canplaythrough', () => resolve(new VanillaSound(audioElement)))
			audioElement.addEventListener('error', () => reject("Failed to load audio file " + file))
		})
	}
}

export class VanillaSound implements Sound {

	constructor(private audioElement: HTMLAudioElement) {
	}

	play(volume: number = 1.0, rate: number = 1, loop = true) {
		this.audioElement.volume = volume
		this.audioElement.playbackRate = rate
		this.audioElement.loop = loop
		this.audioElement.play();
	}
}
