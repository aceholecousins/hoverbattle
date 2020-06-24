
import {Asset, AssetConfig} from "../../../domain/graphics/asset"
import {Kind, Registry} from "../../../utils"

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
		if(!this.factories.hasOwnProperty(config.kind)){
			throw new Error("ThreeAssetFactory cannot create a " + config.kind)
		}
        return new this.factories[config.kind](config, onLoaded, onError)
    }
}

export const threeAssetFactory = new ThreeAssetFactory()