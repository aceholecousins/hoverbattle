
export interface SoundFxPlayer {
	loadSound(file: string): Sound
}

export interface Sound {
	play(volume?:number, rate?:number, loop?:boolean):void
	changeVolume(newVolume:number):void
}
