import { LoadAssetFunction } from "./asset";
import { Model } from "./model";

export interface SpriteLoader {
	load:LoadAssetFunction<Model>
}