import { Engine } from "./engine"

export interface Match {
	update(dt: number): void
}

export type MatchFactory = (
	engine: Engine
) => Promise<Match>