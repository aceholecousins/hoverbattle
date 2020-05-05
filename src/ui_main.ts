
import {GraphicsManager} from "./graphics/graphicsmanager"
import * as THREE from "three"
import * as Stats from "stats.js"
import {Rotation} from './rotation'

let gm = new GraphicsManager("rendertarget")

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

gm.setup()
gm.setBackground(new THREE.Color("skyblue"))

let cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial())
gm.addToScene(cube)

let worker = new Worker('acechase_engine.js')

worker.onmessage = function(e) {
	cube.rotation.x = e.data.x;
	cube.rotation.y = e.data.y;
	cube.rotation.z = e.data.z;
}

function animate(time:number){	
	requestAnimationFrame(animate)
	worker.postMessage(new Rotation(cube.rotation))
	gm.render()
	stats.update()
}
animate(0)

