import * as THREE from 'three'
import * as p2 from "p2"
import { scene, camera, run } from '../quickthree'
import { vec2 } from 'gl-matrix'
import * as dat from 'dat.gui';

const gui = new dat.GUI();

// staitc friction, rubber on asphalt: dry 0.9, wet 0.5
// staitc friction, rubber on concrete: dry 1.0, wet 0.6
// dynamic friction, rubber on asphalt: dry 0.3, wet 0.15
// dynamic friction, rubber on concrete: dry 0.5, wet 0.3

const world = new p2.World({ gravity: [0, 0] })

const chassisBody = new p2.Body({ mass: 1, damping: 0.3, angularDamping: 0.3 })
const boxShape = new p2.Box({ width: 1.0, height: 0.5 })
chassisBody.addShape(boxShape)
world.addBody(chassisBody)

let wheels = [
	{
		position: vec2.fromValues(0.5, 0),
		steering: 0,
		thrust: 0,
		locked: false,
		mesh: undefined as any
	},
	{
		position: vec2.fromValues(-0.5, 0),
		steering: 0,
		thrust: 0,
		locked: false,
		mesh: undefined as any
	}
]

let params = {
	maxSteeringAngle: 30, // deg
	steeringSpeed: 0.03, // rad/s
	wheelDamping: 50, // reaction force over sliding velocity (up to gripping force limit)
	wheelMaxGrippingForce: 30, // force units :P
	wheelSlidingForceReduction: 0.75, // reaction force when sliding faster
	wheelThrustForce: 15,
	wheelBrakeForce: 30
}

gui.add(params, 'maxSteeringAngle', 0, 90)
gui.add(params, 'steeringSpeed', 0, 0.2)
gui.add(params, 'wheelDamping', 0, 100)
gui.add(params, 'wheelMaxGrippingForce', 0, 100)
gui.add(params, 'wheelSlidingForceReduction', 0, 1)
gui.add(params, 'wheelThrustForce', 0, 100)
gui.add(params, 'wheelBrakeForce', 0, 100)

const keys: any = {
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

}

const planeSize = 1000;
const divisions = 1000;
const gridHelper = new THREE.GridHelper(planeSize, divisions);
gridHelper.rotation.x = Math.PI / 2
scene.add(gridHelper);

const chassis = new THREE.Mesh(
	new THREE.BoxGeometry(1.6, 0.8, 0.1),
	new THREE.MeshBasicMaterial({ color: 0x101010 })
)
scene.add(chassis)

const centerOfRotationMarker = new THREE.Mesh(
	new THREE.SphereGeometry(0.1),
	new THREE.MeshBasicMaterial({ color: 0x000080 })
)
scene.add(centerOfRotationMarker)

for (let wheel of wheels) {
	const wheelMesh = new THREE.Mesh(
		new THREE.CylinderGeometry(0.3, 0.3, 0.1),
		new THREE.MeshBasicMaterial({ color: 0x0000ff })
	)
	chassis.add(wheelMesh)
	wheelMesh.position.set(wheel.position[0], wheel.position[1], 0)
	const wheelAxle = new THREE.Mesh(
		new THREE.CylinderGeometry(0.02, 0.02, 20),
		new THREE.MeshBasicMaterial({ color: 0x0000ff })
	)
	wheelMesh.add(wheelAxle)

	wheel.mesh = wheelMesh
}

function arrow(position: vec2, direction: vec2, scale: number, color: THREE.Color) {
	const normalizedDirection = vec2.normalize(vec2.create(), direction);
	const arrowHelper = new THREE.ArrowHelper(
		new THREE.Vector3(normalizedDirection[0], normalizedDirection[1], 0),
		new THREE.Vector3(position[0], position[1], 0),
		vec2.length(direction) * scale,
		color
	)
	arrowHelper.userData.deleteMe = true
	arrowHelper.renderOrder = 999;
	(arrowHelper.line.material as any).depthTest = false;
	scene.add(arrowHelper)
	return arrowHelper
}

function circle(position: vec2, radius: number, color: THREE.Color) {
	const segments = 32;
	const points: any = [];
	for (let i = 0; i <= segments; i++) {
		const theta = (i / segments) * Math.PI * 2;
		points.push(radius * Math.cos(theta), radius * Math.sin(theta), 0);
	}
	const geometry = new THREE.BufferGeometry();
	const vertices = new Float32Array(points);
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
	const material = new THREE.LineBasicMaterial({ color });
	const circle = new THREE.LineLoop(geometry, material);
	circle.position.set(position[0], position[1], 0.3); // Set circle position
	circle.userData.deleteMe = true
	scene.add(circle);
	return circle;
}

let lastTime = 0
function update(time: number) {

	let maxSteeringAngle = params.maxSteeringAngle * Math.PI / 180
	let steeringSpeed = params.steeringSpeed
	let wheelDamping = params.wheelDamping
	let wheelMaxGrippingForce = params.wheelMaxGrippingForce
	let wheelSlidingForceReduction = params.wheelSlidingForceReduction
	let wheelThrustForce = params.wheelThrustForce
	let wheelBrakeForce = params.wheelBrakeForce

	let wheelSlipThresholdSpeed = wheelMaxGrippingForce / wheelDamping
	let wheelSlidingForce = wheelMaxGrippingForce * wheelSlidingForceReduction


	scene.children = scene.children.filter(child => !(child.userData.deleteMe));

	if (keys.ArrowLeft || keys.ArrowRight) {
		wheels[0].steering += (keys.ArrowLeft - keys.ArrowRight) * steeringSpeed
		wheels[0].steering = Math.max(-maxSteeringAngle, Math.min(maxSteeringAngle, wheels[0].steering))
	}
	else {
		wheels[0].steering *= 0.9
	}
	wheels[1].thrust = keys.ArrowUp * wheelThrustForce - keys.ArrowDown * wheelBrakeForce

	for (let wheel of wheels) {
		const wheelAngle = chassisBody.angle + wheel.steering

		let radius = vec2.create();
		vec2.rotate(radius, wheel.position, [0, 0], chassisBody.angle);
		const turningComponent = vec2.fromValues(
			-chassisBody.angularVelocity * radius[1],
			chassisBody.angularVelocity * radius[0]
		)

		let globalWheelPosition = vec2.create()
		chassisBody.toWorldFrame(
			globalWheelPosition as [number, number],
			wheel.position as [number, number]
		)

		const motion = vec2.add(vec2.create(), chassisBody.velocity, turningComponent)
		arrow(globalWheelPosition, motion, 0.1, new THREE.Color(0x0000ff))

		const forwardDirection = vec2.fromValues(
			Math.cos(wheelAngle),
			Math.sin(wheelAngle),
		)

		const axisDirection = vec2.fromValues(
			-forwardDirection[1],
			forwardDirection[0]
		)

		const sideVelocity = vec2.dot(motion, axisDirection)
		const sideSpeed = Math.abs(sideVelocity)

		let forwardForceAbs = Math.abs(wheel.thrust)
		let sideForceAbs = sideSpeed < wheelSlipThresholdSpeed ?
			wheelDamping * sideSpeed : wheelSlidingForce

		let sliding = false

		let maxWheelForceAbs = wheelMaxGrippingForce
		if (
			sideSpeed > wheelSlipThresholdSpeed
			|| forwardForceAbs ** 2 + sideForceAbs ** 2 > wheelMaxGrippingForce ** 2
		) {
			maxWheelForceAbs = wheelSlidingForce
			sliding = true
		}

		let totalWheelForceAbs = Math.sqrt(forwardForceAbs ** 2 + sideForceAbs ** 2)
		if (totalWheelForceAbs > maxWheelForceAbs) {
			const scale = maxWheelForceAbs / totalWheelForceAbs
			forwardForceAbs *= scale
			sideForceAbs *= scale
			sliding = true
		}

		if (sliding) {
			wheel.mesh.material.color.setHex(0xff0000)
		}
		else {
			wheel.mesh.material.color.setHex(0x00aa00)
			let q = totalWheelForceAbs / maxWheelForceAbs
			wheel.mesh.material.color.r = q
		}

		let forwardForceSigned = Math.sign(wheel.thrust) * forwardForceAbs
		let sideForceSigned = -Math.sign(sideVelocity) * sideForceAbs

		let wheelForce = vec2.fromValues(
			forwardDirection[0] * forwardForceSigned + axisDirection[0] * sideForceSigned,
			forwardDirection[1] * forwardForceSigned + axisDirection[1] * sideForceSigned
		)
		arrow(globalWheelPosition, wheelForce, 0.03, new THREE.Color(0xff00ff))
		circle(globalWheelPosition, maxWheelForceAbs * 0.03, new THREE.Color(0xff00ff))

		let wheelRelativePosition = vec2.create()
		chassisBody.vectorToWorldFrame(
			wheelRelativePosition as [number, number],
			wheel.position as [number, number]
		)

		chassisBody.applyForce(
			wheelForce as [number, number],
			wheelRelativePosition as [number, number]
		)

		let centerOfRotation = vec2.copy(vec2.create(), chassisBody.position)
		let corRadius = vec2.fromValues(
			-chassisBody.velocity[1] / chassisBody.angularVelocity,
			chassisBody.velocity[0] / chassisBody.angularVelocity
		)
		vec2.add(centerOfRotation, centerOfRotation, corRadius)

		centerOfRotationMarker.position.set(
			centerOfRotation[0],
			centerOfRotation[1],
			0.3
		)

		wheel.mesh.rotation.z = wheel.steering
	}

	const dt = lastTime == 0 ? 0.01 : time - lastTime
	lastTime = time
	world.step(dt * 0.4)
	chassis.position.set(chassisBody.position[0], chassisBody.position[1], 0)
	chassis.rotation.z = chassisBody.angle
	camera.position.set(chassisBody.position[0], chassisBody.position[1], 15)
}

run(update)