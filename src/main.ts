
import {GraphicsManager} from "./graphics/graphicsmanager"
import * as THREE from "three"
import * as Stats from "stats.js"

let gm = new GraphicsManager("rendertarget")

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

gm.setup()
gm.setBackground(new THREE.Color("skyblue"))

let cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial())
gm.addToScene(cube)

function animate(time:number){
	requestAnimationFrame(animate)
	cube.rotation.x += 0.01
	cube.rotation.y += 0.02
	cube.rotation.z += 0.03
	gm.render()
	stats.update()
}
animate(0)

