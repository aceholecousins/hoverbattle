
import * as THREE from "./libs/threejs/src/Three.js"
import {GraphicsManager} from "./graphics/graphicsmanager.js"

let gm = new GraphicsManager("rendertarget")

gm.setup()
gm.setBackground(new THREE.Color("skyblue"))
gm.addToScene(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial()))
gm.animate()
