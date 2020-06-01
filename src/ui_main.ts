
import {ThreeGraphics} from "./graphics/threegraphics/threegraphics"
import {ModelConfig} from "./graphics/model"
import {Checklist} from "./checklist"

let graphics = new ThreeGraphics(document.getElementById("rendertarget") as HTMLCanvasElement)

function start(){

	const gliderCfg:ModelConfig = {
		kind:"model",
		asset:gliderAsset
	}

	graphics.addObject(gliderCfg)

	function animate(time:number){
		requestAnimationFrame(animate)
		graphics.update(time)
	}
	requestAnimationFrame(animate)
	
}

let checklist = new Checklist({onComplete:start})

let loadGlider = checklist.newItem()
const gliderAsset = graphics.loadAsset<"model">(
	{kind:"model", file:"glider/glider.gltf"},
	loadGlider.check
)
