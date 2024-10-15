import { Engine } from "./engine"

export interface Match {}

export type MatchFactory = (
	engine: Engine
) => Promise<Match>