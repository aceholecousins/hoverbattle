import { Sound, SoundHandle, SoundLoader } from "game/sound";

let audioContext = new AudioContext()

export const loadWebApiSound: SoundLoader = function(file:string){

	return new Promise((resolve, reject) => {
		const sound = new WebApiSound();
		
		var request = new XMLHttpRequest();
		request.open("GET", file, true);
		request.responseType = "arraybuffer";

		request.onload = () => {
			audioContext.decodeAudioData(request.response).then(data => {
				sound.buffer = data;
				resolve(sound);
			}).catch(e => {
				console.error("Error decoding sound " + e);
				reject(e);
			});
		};

		request.onerror = e => {
			console.error("Error loading sound " + e);
			reject(e);
		};

		request.send();
	});
}

export class WebApiSound implements Sound {

	buffer:AudioBuffer

	play(volume: number = 1, rate: number = 1, loop: boolean = false): SoundHandle {
		
		let sourceNode = audioContext.createBufferSource()
		sourceNode.buffer = this.buffer
		sourceNode.playbackRate.value = rate;
		sourceNode.loop = loop
    	
		let gainNode = audioContext.createGain()
		gainNode.gain.value = volume;

		sourceNode.connect(gainNode)
		gainNode.connect(audioContext.destination)

    	sourceNode.start()

		return {
			stop: () => {
				sourceNode.stop(0)
			}
		}
	}
}
