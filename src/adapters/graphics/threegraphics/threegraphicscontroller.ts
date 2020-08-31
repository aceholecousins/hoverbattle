
import {SceneInfo} from "./sceneinfo"
import {ThreeGraphics} from "./threegraphics"
import {GraphicsController} from "domain/graphics/graphicscontroller"

export class ThreeGraphicsController implements GraphicsController{

	graphics:ThreeGraphics

	constructor(graphics:ThreeGraphics){
		this.graphics = graphics

		const resize = ()=>{
			graphics.renderer.setSize(
				graphics.canvas.clientWidth,
				graphics.canvas.clientHeight,
				false
			)

			const cam = (graphics.scene.userData as SceneInfo).activeCamera
			cam.aspect = graphics.canvas.clientWidth / graphics.canvas.clientHeight
			cam.updateProjectionMatrix()
		}
		
		window.addEventListener('resize', resize)
		resize()
	}

	update(time: number){
		this.graphics.renderer.render(
			this.graphics.scene, 
			(this.graphics.scene.userData as SceneInfo).activeCamera
		)
	}
}