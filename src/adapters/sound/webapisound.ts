import { Sound, SoundFxPlayer } from "game/sound/soundfx";

let audioContext = new AudioContext()

export class WebApiSoundFxPlayer implements SoundFxPlayer {

	loadSound(file: string): Sound {
		const sound = new WebApiSound();
		
		var request = new XMLHttpRequest();
		request.open("GET", file, true);
		request.responseType = "arraybuffer";

		request.onload = () => {
			audioContext.decodeAudioData(request.response).then(data => {
				sound.buffer = data
			}).catch(e => {
				//TODO handle error
				console.error("Error decoding sound " + e)
			})
		}

		request.onerror = e => {
			//TODO handle error
			console.error("Error loading sound " + e)
		}

		request.send();

		return sound
	}

}

export class WebApiSound implements Sound {

	buffer:AudioBuffer

	play(volume: number = 1, rate: number = 1, loop: boolean = false): void {
		
		let sourceNode = audioContext.createBufferSource()
		sourceNode.buffer = this.buffer
		sourceNode.playbackRate.value = rate;
		sourceNode.loop = loop
    	
		let gainNode = audioContext.createGain()
		gainNode.gain.value = volume;

		sourceNode.connect(gainNode)
		gainNode.connect(audioContext.destination)

    	sourceNode.start()
	}
}
