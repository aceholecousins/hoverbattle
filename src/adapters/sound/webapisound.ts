import { Sound, SoundHandle, SoundLoader } from "game/sound";
import { assertDefined } from "utils/general";

let audioContext = new AudioContext()

export const loadWebApiSound: SoundLoader = function (file: string) {

	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open("GET", file, true);
		request.responseType = "arraybuffer";

		request.onload = () => {
			audioContext.decodeAudioData(request.response).then(data => {
				resolve(new WebApiSound(data));
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

	constructor(public buffer: AudioBuffer) { }
	play(volume: number = 1, rate: number = 1, loop: boolean = false): SoundHandle {

		let sourceNode = audioContext.createBufferSource()
		assertDefined(this.buffer)
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
