import { Color } from "utils";
import { Controller } from "./controller/controller";


export class Player {
	
	constructor(
		public controller:Controller,
		public team:number,
		public color:Color
	) {
	}
}