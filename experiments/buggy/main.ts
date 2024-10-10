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

const chassisBody = new p2.Body({
	mass: 1,
	damping: 0.3,
	angularDamping: 0.3
})
const boxShape = new p2.Box({ width: 1.0, height: 0.5 })
chassisBody.addShape(boxShape)
world.addBody(chassisBody)

let chassisParams = {
	mass: 1, // t
	momentOfInertia: 0.1 // t*m^2
}

let wheels = [
	{
		label: "FrontWheel",
		maxSteeringAngle: 30, // deg
		steeringSpeed: 2.0, // fraction/s
		lateralDamping: 20, // reaction force over sliding velocity (up to gripping force limit)
		maxGripForce: 30, // kN
		slidingForceFraction: 0.75, // reaction force when sliding faster
		motorForce: 0, // kN between wheel and ground
		brakeForce: 0,
		position: 0.5,

		steering: 0,
		thrust: 0,
		braking: 0,
		locked: false,
		mesh: undefined as any
	},
	{
		label: "RearWheel",
		maxSteeringAngle: 0, // deg
		steeringSpeed: 0, // fraction/s
		lateralDamping: 20, // reaction force over sliding velocity (up to gripping force limit)
		maxGripForce: 30, // kN
		slidingForceFraction: 0.75, // reaction force when sliding faster
		motorForce: 15, // kN between wheel and ground
		brakeForce: 30,
		position: -0.5,

		steering: 0,
		thrust: 0,
		braking: 0,
		locked: false,
		mesh: undefined as any
	}
]

let options = {
	syncFrictionParams: true,
	slowMo: 1,
	superSample: 10
}

let carFolder = gui.addFolder("Car")
carFolder.add(chassisParams, 'mass', 0.1, 20)
carFolder.add(chassisParams, 'momentOfInertia', 0.01, 5)

for (let i = 0; i < 2; i++) {
	let wheel = wheels[i]
	let otherWheel = wheels[1 - i]

	let wheelFolder = gui.addFolder(wheel.label)
	wheelFolder.add(wheel, 'maxSteeringAngle', -90, 90)
	wheelFolder.add(wheel, 'steeringSpeed', 0, 10)
	wheelFolder.add(wheel, 'motorForce', 0, 100)
	wheelFolder.add(wheel, 'brakeForce', 0, 100)
	wheelFolder.add(wheel, 'lateralDamping', 0, 100).onChange((value) => {
		if (options.syncFrictionParams) { otherWheel.lateralDamping = value }
	}).listen()
	wheelFolder.add(wheel, 'maxGripForce', 0, 100).onChange((value) => {
		if (options.syncFrictionParams) { otherWheel.maxGripForce = value }
	}).listen()
	wheelFolder.add(wheel, 'slidingForceFraction', 0, 1).onChange((value) => {
		if (options.syncFrictionParams) { otherWheel.slidingForceFraction = value }
	}).listen()
	wheelFolder.add(wheel, 'position', -3, 3)
}

let optionsFolder = gui.addFolder("Options")
optionsFolder.add(options, 'slowMo', 0.1, 2)
optionsFolder.add(options, 'syncFrictionParams')
optionsFolder.add(options, 'superSample', 1, 100, 1)


const keys: any = {
	ArrowLeft: 0,
	ArrowRight: 0,
	ArrowUp: 0,
	ArrowDown: 0
}
const maxSteer = Math.PI / 5
document.addEventListener('keydown', (evt) => { keys[evt.key] = 1 })
document.addEventListener('keyup', (evt) => { keys[evt.key] = 0 })

const planeSize = 1000;
const divisions = 1000;
const gridHelper = new THREE.GridHelper(planeSize, divisions);
gridHelper.rotation.x = Math.PI / 2
scene.add(gridHelper);

const chassisMesh = new THREE.Mesh(
	new THREE.BoxGeometry(1.6, 0.8, 0.1),
	new THREE.MeshBasicMaterial({ color: 0x101010 })
)
scene.add(chassisMesh)

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
	chassisMesh.add(wheelMesh)
	wheelMesh.position.set(wheel.position, 0, 0)
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

	let elapsedTime = lastTime == 0 ? 0.01 : time - lastTime
	lastTime = time

	const gamepads = navigator.getGamepads();

	scene.children = scene.children.filter(child => !(child.userData.deleteMe));

	for (let i = 0; i < options.superSample; i++) {

		let dt = elapsedTime * options.slowMo / options.superSample

		world.step(dt)

		for (let wheel of wheels) {

			let maxSteeringAngle = wheel.maxSteeringAngle * Math.PI / 180
			let steeringSpeed = wheel.steeringSpeed
			let lateralDamping = wheel.lateralDamping
			let maxGripForce = wheel.maxGripForce
			let slidingForceFraction = wheel.slidingForceFraction
			let motorForce = wheel.motorForce
			let brakeForce = wheel.brakeForce

			let slipThresholdSpeed = maxGripForce / lateralDamping
			let slidingForce = maxGripForce * slidingForceFraction

			chassisBody.mass = chassisParams.mass
			chassisBody.inertia = chassisParams.momentOfInertia
			chassisBody.invMass = 1 / chassisParams.mass
			chassisBody.invInertia = 1 / chassisParams.momentOfInertia

			if (gamepads[0]) {
				let gp = gamepads[0]
				wheel.steering = -gp.axes[0]
				wheel.thrust = gp.buttons[7].value
				wheel.braking = gp.buttons[6].value
			}
			else {
				if (keys.ArrowLeft || keys.ArrowRight) {
					wheel.steering += (keys.ArrowLeft - keys.ArrowRight) * steeringSpeed * dt
					wheel.steering = Math.max(-1, Math.min(1, wheel.steering))
				}
				else if (wheel.steering > 0) {
					wheel.steering = Math.max(0, wheel.steering - steeringSpeed * dt)
				}
				else if (wheel.steering < 0) {
					wheel.steering = Math.min(0, wheel.steering + steeringSpeed * dt)
				}
				wheel.thrust = keys.ArrowUp
				wheel.braking = keys.ArrowDown
			}

			const wheelPosition = vec2.fromValues(wheel.position, 0)
			const wheelAngle = chassisBody.angle + wheel.steering * maxSteeringAngle

			let radius = vec2.create();
			vec2.rotate(radius, wheelPosition, [0, 0], chassisBody.angle);
			const turningComponent = vec2.fromValues(
				-chassisBody.angularVelocity * radius[1],
				chassisBody.angularVelocity * radius[0]
			)

			let globalWheelPosition = vec2.create()
			chassisBody.toWorldFrame(
				globalWheelPosition as [number, number],
				wheelPosition as [number, number]
			)

			const motion = vec2.add(vec2.create(), chassisBody.velocity, turningComponent)

			const forwardDirection = vec2.fromValues(
				Math.cos(wheelAngle),
				Math.sin(wheelAngle),
			)

			const forwardVelocity = vec2.dot(motion, forwardDirection)
			let drive = wheel.thrust * motorForce
			if (wheel.braking) {
				if (Math.abs(forwardVelocity) > 0.03) {
					drive = -Math.sign(forwardVelocity) * wheel.braking * brakeForce
				}
			}

			const axisDirection = vec2.fromValues(
				-forwardDirection[1],
				forwardDirection[0]
			)

			const sideVelocity = vec2.dot(motion, axisDirection)
			const sideSpeed = Math.abs(sideVelocity)

			let forwardForceAbs = Math.abs(drive)
			let sideForceAbs = sideSpeed < slipThresholdSpeed ?
				lateralDamping * sideSpeed : slidingForce

			let sliding = false

			let maxWheelForceAbs = maxGripForce
			if (
				sideSpeed > slipThresholdSpeed
				|| forwardForceAbs ** 2 + sideForceAbs ** 2 > maxGripForce ** 2
			) {
				maxWheelForceAbs = slidingForce
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

			let forwardForceSigned = Math.sign(drive) * forwardForceAbs
			let sideForceSigned = -Math.sign(sideVelocity) * sideForceAbs

			let wheelForce = vec2.fromValues(
				forwardDirection[0] * forwardForceSigned + axisDirection[0] * sideForceSigned,
				forwardDirection[1] * forwardForceSigned + axisDirection[1] * sideForceSigned
			)

			let wheelRelativePosition = vec2.create()
			chassisBody.vectorToWorldFrame(
				wheelRelativePosition as [number, number],
				wheelPosition as [number, number]
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

			if (i == options.superSample - 1) {
				arrow(globalWheelPosition, motion, 0.1, new THREE.Color(0x0000ff))
				arrow(globalWheelPosition, wheelForce, 0.03, new THREE.Color(0xff00ff))
				circle(globalWheelPosition, maxWheelForceAbs * 0.03, new THREE.Color(0xff00ff))

				wheel.mesh.rotation.z = wheel.steering * maxSteeringAngle
				wheel.mesh.position.x = wheel.position
			}
		}
	}

	chassisMesh.position.set(chassisBody.position[0], chassisBody.position[1], 0)
	chassisMesh.rotation.z = chassisBody.angle
	camera.position.set(chassisBody.position[0], chassisBody.position[1], 15)

}

run(update)