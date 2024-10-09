import * as THREE from 'three'
import * as p2 from "p2"
import { scene, camera, run } from '../quickthree'

// staitc friction, rubber on asphalt: dry 0.9, wet 0.5
// staitc friction, rubber on concrete: dry 1.0, wet 0.6
// dynamic friction, rubber on asphalt: dry 0.3, wet 0.15
// dynamic friction, rubber on concrete: dry 0.5, wet 0.3

const world = new p2.World({ gravity: [0, 0] })

const chassisBody = new p2.Body({ mass: 1 })
const boxShape = new p2.Box({ width: 0.5, height: 1 })
chassisBody.addShape(boxShape)
world.addBody(chassisBody)

const vehicle = new p2.TopDownVehicle(chassisBody)

const frontWheel = vehicle.addWheel({ localPosition: [0, 0.5] })
frontWheel.setSideFriction(10)

const backWheel = vehicle.addWheel({ localPosition: [0, -0.5] })
backWheel.setSideFriction(10)

vehicle.addToWorld(world)

const keys:any = {
	ArrowLeft: 0,
	ArrowRight: 0,
	ArrowUp: 0,
	ArrowDown: 0
}
const maxSteer = Math.PI / 5
document.addEventListener('keydown', function (evt) {
	keys[evt.key] = 1
	onInputChange()
})
document.addEventListener('keyup', function (evt) {
	keys[evt.key] = 0
	onInputChange()
})

function onInputChange() {
	frontWheel.steerValue = maxSteer * (keys.ArrowLeft - keys.ArrowRight)
	backWheel.engineForce = keys.ArrowUp * 5

	backWheel.setBrakeForce(0)
	if (keys.ArrowDown) {
		if (backWheel.getSpeed() > 0.1) {
			backWheel.setBrakeForce(5)
		} else {
			backWheel.setBrakeForce(0)
			backWheel.engineForce = -2
		}
	}
}



const planeSize = 1000;
const divisions = 1000;
const gridHelper = new THREE.GridHelper(planeSize, divisions);
gridHelper.rotation.x = Math.PI / 2
scene.add(gridHelper);


const geometry = new THREE.BoxGeometry(0.5, 1.0, 0.1)
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

let lastTime = 0
function update(time: number) {
	const dt = lastTime == 0 ? 0.01 : time - lastTime
	lastTime = time
	world.step(dt)
	cube.position.set(chassisBody.position[0], chassisBody.position[1], 0)
	cube.rotation.z = chassisBody.angle
	camera.position.set(chassisBody.position[0], chassisBody.position[1], 10)
}

run(update)