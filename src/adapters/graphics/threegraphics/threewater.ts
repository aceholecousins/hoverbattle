
import * as THREE from "three"
import { renderer } from "./threerenderer"
import { Water } from "game/graphics/water"
import { Vector3 } from "math"
import { broker } from "broker"

export class ThreeWater implements Water {

	public sceneHasWater: boolean = false
	public normalTextureUniform: { value: THREE.Texture }
	public resolutionUniform: { value: THREE.Vector2 }

	private normalTarget: THREE.WebGLRenderTarget
	private normalScene: THREE.Scene
	private squareGeometry: THREE.PlaneGeometry
	private minusMaterial: THREE.MeshBasicMaterial
	private plusMaterial: THREE.MeshBasicMaterial

	private ripples: {
		minusSquare: THREE.Mesh,
		plusSquare: THREE.Mesh,
		strength: number
	}[] = []
	private renderOrder = 0

	constructor() {

		let w = renderer.domElement.width
		let h = renderer.domElement.height
		this.resolutionUniform = { value: new THREE.Vector2(w, h) }
		this.normalTarget = new THREE.WebGLRenderTarget(w, h);
		this.normalTarget.texture.colorSpace = THREE.NoColorSpace;
		this.normalTextureUniform = { value: this.normalTarget.texture };

		this.normalScene = new THREE.Scene()
		this.normalScene.background = new THREE.Color(0.5, 0.5, 0.5)
		this.squareGeometry = new THREE.PlaneGeometry(1, 1);

		this.minusMaterial = new THREE.MeshBasicMaterial({
			color: new THREE.Color(0.5, 0.5, 0.5),
			blending: THREE.CustomBlending,
			blendEquation: THREE.ReverseSubtractEquation,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.OneFactor,
			blendEquationAlpha: THREE.AddEquation,
			depthTest: false,
			depthWrite: false,
			transparent: true,
			side: THREE.DoubleSide
		});

		let textureLoader = new THREE.TextureLoader();
		let texture = textureLoader.load('assets/sprites/ripple.png');
		this.plusMaterial = new THREE.MeshBasicMaterial({
			map: texture,
			blending: THREE.CustomBlending,
			blendEquation: THREE.AddEquation,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.OneFactor,
			depthTest: false,
			depthWrite: false,
			transparent: true,
			side: THREE.DoubleSide
		});

		broker.update.addHandler((e: any) => { this.updateRipples(e.dt) })
	}

	makeRipple(position: Vector3, size: number, strength: number) {
		let minusSquare = new THREE.Mesh(this.squareGeometry, this.minusMaterial.clone());
		this.normalScene.add(minusSquare);
		minusSquare.renderOrder = this.renderOrder++
		minusSquare.position.copy(position)
		minusSquare.scale.set(size, size, 1)

		let plusSquare = new THREE.Mesh(this.squareGeometry, this.plusMaterial.clone());
		this.normalScene.add(plusSquare);
		plusSquare.renderOrder = this.renderOrder++
		plusSquare.position.copy(position)
		plusSquare.scale.set(size, size, 1)

		this.ripples.push({ minusSquare, plusSquare, strength })
	}

	updateRipples(dt: number) {
		for (let ripple of this.ripples) {
			ripple.strength -= dt
			ripple.minusSquare.scale.x += 7 * dt
			ripple.minusSquare.scale.y += 7 * dt;
			(ripple.minusSquare.material as THREE.MeshBasicMaterial).opacity = Math.min(ripple.strength, 1)
			ripple.plusSquare.scale.x += 7 * dt
			ripple.plusSquare.scale.y += 7 * dt;
			(ripple.plusSquare.material as THREE.MeshBasicMaterial).opacity = Math.min(ripple.strength, 1)
			if (ripple.strength <= 0) {
				this.normalScene.remove(ripple.minusSquare)
				this.normalScene.remove(ripple.plusSquare)
				this.ripples.splice(this.ripples.indexOf(ripple), 1)
			}
		}
	}

	setSize(width: number, height: number) {
		this.normalTarget.setSize(width, height)
		this.resolutionUniform.value.set(width, height)
	}

	render(camera: THREE.Camera) {
		if (this.sceneHasWater) {
			let previousParent = camera.parent
			if (previousParent) {
				camera.removeFromParent()
			}
			renderer.setRenderTarget(this.normalTarget);
			this.normalScene.add(camera)
			renderer.render(this.normalScene, camera);
			this.normalScene.remove(camera)
			if (previousParent) {
				previousParent.add(camera)
			}
			renderer.setRenderTarget(null);
		}
	}

}
