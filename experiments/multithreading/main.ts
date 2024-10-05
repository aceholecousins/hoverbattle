
let inWorker = false
if (typeof window === "undefined") {
	inWorker = true
}

if (!inWorker) {

	let divs: any[] = []

	for (let i = 0; i < window.numObjects; i++) {
		let div = document.createElement("div")
		div.style.position = "absolute"
		div.style.left = "0px"
		div.style.top = "0px"
		div.style.width = "10px"
		div.style.height = "10px"
		div.style.display = "block"
		div.style.backgroundColor = "white"
		div.style.borderRadius = "5px"
		div.style.border = "solid 1px red"
		divs.push(div)
		document.body.appendChild(div)
	}

	window.updateDivs = function (positions) {
		for (let i = 0; i < window.numObjects; i++) {
			divs[i].style.left = window.innerWidth / 2 + positions[i].x * 5 + "px"
			divs[i].style.top = window.innerHeight / 2 + positions[i].y * 5 + "px"
		}
	}

	// start this script again as a worker
	window.worker = new Worker("main.js")

	window.worker.onmessage = function (e) {
		updateDivs(e.data)
	}
}
else { // inWorker
	importScripts("physics.js", "p2.js", "p2physics.js")
}

// everything below exists twice, once in the normal page and once in the worker

let phys = new P2Physics()

let bodies: RigidBody[] = []
let positions: Vec2[] = []

function setupAndRun(fps: number, nObjs: number) {

	for (let i = 0; i < nObjs; i++) {
		let bod = phys.createBody()
		let x = Math.random() * 100 - 50
		let y = Math.random() * 100 - 50
		let vx = -y * Math.random()
		let vy = x * Math.random()

		bod.setPosition({ x: x, y: y })
		bod.setVelocity({ x: vx, y: vy })
		bod.setShape({
			kind: "circle",
			radius: 1
		})
		bodies.push(bod)
		positions.push({ x: 0, y: 0 })
	}

	setInterval(function () {
		for (let i = 0; i < nObjs; i++) {
			let pos = bodies[i].getPosition()
			bodies[i].applyForce({ x: -pos.x, y: -pos.y })
		}
		phys.step(1.0 / fps)
		for (let i = 0; i < nObjs; i++) {
			positions[i] = bodies[i].getPosition()
		}
		if (inWorker) {
			postMessage(positions)
		}
		else {
			window.updateDivs(positions)
		}
	}, 1000 / fps)
}

if (inWorker) {
	onmessage = function (e) {
		setupAndRun(e.data.fps, e.data.nObjs)
	}
}

