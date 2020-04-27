
import * as THREE from '../node_modules/three/build/three.module.js'
import Stats from '../node_modules/stats-js/src/Stats.js'

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

let canvas = <HTMLCanvasElement>document.getElementById("rendertarget")
let renderer = new THREE.WebGLRenderer({canvas:canvas})
let scene = new THREE.Scene()
scene.background = new THREE.Color("skyblue")
let camera = new THREE.PerspectiveCamera(50, 1.0, 0.1, 100)
camera.position.set(0, 0, 10)
scene.add(camera)

function resize(){
	if(renderer !== null){
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
	}
	if(camera !== null && camera instanceof THREE.PerspectiveCamera){
		let perspectiveCamera = camera as THREE.PerspectiveCamera
		perspectiveCamera.aspect = canvas.clientWidth / canvas.clientHeight
		perspectiveCamera.updateProjectionMatrix()
	}
}

window.addEventListener('resize', resize)
resize()

function run(update:(time:number) => void){
	let animate = function(millisecs:number){
		stats.update()
		requestAnimationFrame(animate)
		update(millisecs/1000.0)
		renderer.render(scene, camera)
	}
	animate(performance.now())
}

export {renderer, scene, camera, run}