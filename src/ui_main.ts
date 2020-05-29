/*
import {GraphicsManager} from "../workshop/code/graphicsmanager"
import * as THREE from "three"
import * as Stats from "stats.js"

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

let graphicsManager = new GraphicsManager("rendertarget")
graphicsManager.setup()
graphicsManager.setBackground(new THREE.Color("skyblue"))

let worker = new Worker('acechase_engine.js')

worker.onmessage = function(e){

}
worker.postMessage(1)

function animate(time:number){	
	requestAnimationFrame(animate)
	graphicsManager.render()
	stats.update()
}
requestAnimationFrame(animate)
*/
