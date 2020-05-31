
import {ThreeGraphics} from "./graphics/threegraphics/threegraphics"
import {ModelConfig} from "./graphics/model"

let graphics = new ThreeGraphics(document.getElementById("rendertarget") as HTMLCanvasElement)

const gliderAsset = graphics.loadAsset<"model">({kind:"model", file:"glider/glider.gltf"})
const gliderCfg:ModelConfig = {
	kind:"model",
	asset:gliderAsset
}

setTimeout(function(){
	graphics.addObject(gliderCfg)
}, 1000)

function animate(time:number){
	requestAnimationFrame(animate)
	graphics.update(time)
}
requestAnimationFrame(animate)

