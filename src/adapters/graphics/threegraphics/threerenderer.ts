
import * as THREE from "three"

// resources like textures can not be shared across renderers
// so we need one global renderer for all scenes and texture generators and the water and so on
export let renderer = new THREE.WebGLRenderer(
	{canvas:document.getElementById("rendertarget") as HTMLCanvasElement}
)