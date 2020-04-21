
import {GraphicsManager} from "./graphics/graphicsmanager"
import * as THREE from 'three'

let gm = new GraphicsManager("rendertarget")

gm.setup()
gm.setBackground(new THREE.Color("skyblue"))

let cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial())
gm.addToScene(cube)

function animate(){
	requestAnimationFrame(animate)
	cube.rotation.x += 0.01
	cube.rotation.y += 0.02
	cube.rotation.z += 0.03
	gm.render()
}
animate()

