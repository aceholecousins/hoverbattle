
export interface SoundFxPlayer {
	loadSound(file: string): Promise<Sound>
}

export interface Sound {
	play(volume?:number, rate?:number, loop?:boolean):void
}
