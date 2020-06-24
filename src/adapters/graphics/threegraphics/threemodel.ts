
import {Model, ModelConfig, modelDefaults} from "domain/graphics/model"
import {ThreeGraphicsObject, threeObjectFactory} from "./threegraphicsobject"
import * as THREE from "three"
import { Color } from "utils"
import { ThreeModelAsset } from "./threemodelasset"

export class ThreeModel extends ThreeGraphicsObject<"model"> implements Model{

	color:Color // TODO: use color
	threeObject:THREE.Object3D

	constructor(scene:THREE.Scene, config:ModelConfig){
		const {kind, position, orientation, scaling,
			asset, color}:Required<ModelConfig> =
			{...modelDefaults, ...config}
		super()

		this.threeScene = scene
		this.threeObject = (asset as ThreeModelAsset).model.clone()

		Object.assign(this, {kind, position, orientation, scaling, color})

		this.threeScene.add(this.threeObject)
	}

}

threeObjectFactory.register("model", ThreeModel)