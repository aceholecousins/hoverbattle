
import {Asset, AssetConfig} from "../asset"
import {Kind, Registry} from "../../utils"

type ThreeAssetConstructor<K extends Kind> =
	new(
		config: AssetConfig<K>,
		onLoaded:()=>void,
		onError:(err:ErrorEvent)=>void	
	) => Asset<K>

class ThreeAssetFactory{

    private factories: Registry<ThreeAssetConstructor<any>> = {}

    register(kind: string, factory: ThreeAssetConstructor<any>): void {
        this.factories[kind] = factory
    }

    createAsset<K extends Kind>(
		config: AssetConfig<K>,
		onLoaded: ()=>void,
		onError: (err:ErrorEvent)=>void
	): Asset<K> {
        return new this.factories[config.kind](config, onLoaded, onError)
    }
}

export const threeAssetFactory = new ThreeAssetFactory()