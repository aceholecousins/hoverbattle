
import {GraphicsManager} from "src/graphics/graphicsmanager.js"
import * as THREE from 'src/libs/three.module.js'

let gm = new GraphicsManager("rendertarget")

gm.setup()
gm.setBackground(new THREE.Color("skyblue"))
gm.addToScene(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial()))
gm.animate()
