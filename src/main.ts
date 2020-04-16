
import {GraphicsManager} from "./graphics/graphicsmanager"
import * as THREE from 'three'

let gm = new GraphicsManager("rendertarget")

gm.setup()
gm.setBackground(new THREE.Color("skyblue"))
gm.addToScene(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial()))
gm.animate()
