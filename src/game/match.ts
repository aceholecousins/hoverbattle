import { Engine } from "./engine"

export interface Match {}

export type MatchFactory = () => Promise<Match>