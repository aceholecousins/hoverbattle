import {Physics} from "./physics/physics.js"
import {P2Physics} from "./physics/p2/p2physics.js"

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