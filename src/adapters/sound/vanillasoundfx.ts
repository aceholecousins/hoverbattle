import { Sound, SoundFxPlayer } from "game/sound/soundfx";

export class VanillaSoundFxPlayer implements SoundFxPlayer {

	loadSound(file: string): Sound {
		const audioElement = new Audio(file)
		return new VanillaSound(audioElement)
	}
}

export class VanillaSound implements Sound {

	constructor(private audioElement: HTMLAudioElement) {
	}

	play(volume: number = 1.0, rate: number = 1, loop = false) {
		this.audioElement.volume = volume
		this.audioElement.playbackRate = rate
		this.audioElement.loop = loop
		this.audioElement.play();
	}
}
