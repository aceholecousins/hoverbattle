import * as THREE from 'three'
import { scene, run } from '../quickthree'

let nTube = 250
let nRing = 200
let nObjs = 100
let nLights = 50

console.log((nTube * nRing * 2 * nObjs) / 1e6 + " mio triangles")
console.log(nLights + " lights")

let geom = new THREE.TorusKnotGeometry(1, 0.1, nTube, nRing)

let models: any[] = []

for (let i = 0; i < nObjs; i++) {
	let x = Math.cos(i / nObjs * 2 * Math.PI) * 3
	let y = Math.sin(i / nObjs * 2 * Math.PI) * 3

	let model = new THREE.Mesh(
		geom,
		new THREE.MeshStandardMaterial({
			color: new THREE.Color(Math.random(), Math.random(), Math.random()),
			emissive: new THREE.Color(Math.random() * 0.4, Math.random() * 0.4, Math.random() * 0.4),
			metalness: Math.random(),
			roughness: Math.random()
		})
	)
	model.material.color.convertSRGBToLinear()
	model.material.emissive.convertSRGBToLinear()
	model.position.set(x, y, 0)
	models.push(model)
	scene.add(model)
}

var lightHolder = new THREE.Group()
scene.add(lightHolder)

for (let i = 0; i < nLights; i++) {
	let q = i / nLights * 2 * Math.PI
	let x = Math.cos(q) * 3
	let y = Math.sin(q) * 3
	let z = (Math.random() - 0.5) * 20
	let r = Math.sin(q) * 0.5 + 0.5
	let g = Math.sin(q + 2 * Math.PI / 3) * 0.5 + 0.5
	let b = Math.sin(q + 4 * Math.PI / 3) * 0.5 + 0.5

	let light = new THREE.PointLight(
		new THREE.Color(r, g, b), 10
	)
	light.position.set(x, y, z)

	lightHolder.add(light)
}

function update(time: number) {
	for (let i = 0; i < nObjs; i++) {
		models[i].rotation.x = time * 0.11 + i
		models[i].rotation.y = time * 0.12 + i
		models[i].rotation.z = time * 0.13 + i
	}
	lightHolder.rotation.z = time
}

run(update)