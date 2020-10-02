
import {Graphics} from "domain/graphics/graphics"
import {Physics} from "domain/physics/physics"
import {executeFile} from "utilities/executefile"

export interface Arena{
	update:()=>{}
}

export function loadArena(
	url:string,
	graphics:Graphics,
	physics:Physics,
	onLoaded:(arena:Arena)=>void
){
	executeFile(url, {graphics, physics}, onLoaded)
}