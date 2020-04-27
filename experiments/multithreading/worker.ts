
console.log("hi")
importScripts("physics.js", "p2.js", "p2physics.js")

let phys = new P2Physics()

let bodies:RigidBody[] = []
let positions:Vec2[] = []

for(let i = 0; i < 1000; i++){
	let bod = phys.createBody()
	let x = Math.random()*100-50
	let y = Math.random()*100-50
	let vx = -y * Math.random()
	let vy = x * Math.random()

	bod.setPosition({x:x, y:y})
	bod.setVelocity({x:vx, y:vy})
	bod.setShape({
		kind:"circle",
		radius:1
	})
	bodies.push(bod)
	positions.push({x:0, y:0})
}

setInterval(function(){
	console.log("hi")
	for(let i = 0; i < bodies.length; i++){
		let pos = bodies[i].getPosition()
		bodies[i].applyForce({x:-pos.x, y:-pos.y})
	}
	phys.step(0.05)
	for(let i = 0; i < bodies.length; i++){
		positions[i] = bodies[i].getPosition()
	}
	postMessage(positions)
}, 50)
