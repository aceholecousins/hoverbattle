import { Color } from "utils/color";
import { Controller } from "./controller/controller";


export class Player {

	constructor(
		public controller: Controller,
		public team: number,
		public color: Color
	) {
	}
}