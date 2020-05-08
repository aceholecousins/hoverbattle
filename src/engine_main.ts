import { Euler } from "three";


const ctx: Worker = self as any;

ctx.onmessage = function(e) {
	console.log(e.data)
	/*let currentRotation:Rotation = e.data
	let currentEuler:Euler = new Euler(currentRotation.x, currentRotation.y, currentRotation.z)
	currentEuler.x += 0.01
	currentEuler.y += 0.02
	currentEuler.z += 0.03
	ctx.postMessage(new Rotation(currentEuler))*/
}