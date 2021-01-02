
import { Entity } from "domain/entity/entity"
import {Graphics} from "domain/graphics/graphics"
import {Physics} from "domain/physics/physics"
import {executeFile} from "utilities/executefile"

export interface Arena extends Entity{}

export function loadArena(
	url:string,
	graphics:Graphics,
	physics:Physics,
	onLoaded:(arena:Arena)=>void
){
	executeFile(url, {graphics, physics}, onLoaded)
}
