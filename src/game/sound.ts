
export interface Sound {
	play(volume?: number, rate?: number, loop?: boolean): SoundHandle
}

export interface SoundHandle {
	stop(): void
}

export interface SoundLoader {
	(file: string): Promise<Sound>;
}
