
import {Asset, LoadAssetFunction} from "./asset"
import { TriangleCorners } from "domain/physics/triangle"


export class Arena implements Asset<"arena">{
	kind:"arena"
}

export interface ArenaInfo{
	boundary: TriangleCorners[]
}

export interface ArenaLoader{
	load:LoadAssetFunction<Arena, ArenaInfo>
}