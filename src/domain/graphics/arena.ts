
import {Asset, LoadAssetFunction} from "./asset"
import { vec2 } from "gl-matrix"

export class Arena implements Asset<"arena">{
	kind:"arena"
}

export type Triangle = [vec2, vec2, vec2]

export interface ArenaInfo{
	boundary: Triangle[]
}

export interface ArenaLoader{
	load:LoadAssetFunction<Arena, ArenaInfo>
}