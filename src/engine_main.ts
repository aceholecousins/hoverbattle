import {Physics} from "./domain/physics/physics"
import {P2Physics} from "./adapters/physics/p2/p2physics"

const ctx: Worker = self as any

class Game{
	physics:Physics

	constructor(){
		this.physics = new P2Physics()
	}

	update(dt:number){
		this.physics.step(dt)
	}
}

let dt = 1 / 100
let game = new Game()

setInterval(()=>{
	game.update(dt)
}, dt)

ctx.onmessage = function(e) {
	console.log(e.data)
}