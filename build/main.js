import { GraphicsManager } from "./graphics/graphicsmanager.js";
import * as THREE from './libs/three.module.js';
var gm = new GraphicsManager("rendertarget");
gm.setup();
gm.setBackground(new THREE.Color("skyblue"));
gm.addToScene(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial()));
gm.animate();
//# sourceMappingURL=main.js.map