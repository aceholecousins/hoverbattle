
// type helpers
type Kind = string // the runtime type id
export type Registry<T> = { [index: string]: T }

// https://stackoverflow.com/a/49579497/3825996
type OptionalKeys<T> = { [K in keyof T]-?:
  ({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]
export type Optionals<T> = Required<Pick<T, OptionalKeys<T>>>

/////////////////////////////////////
// base class, factory and manager //
/////////////////////////////////////

// the base class of all things
abstract class Thing<K extends Kind>{
	kind:K
	generalProp:number = 1
}

// a configuration for a kind of thing
// it carries with it the kind and also the type of the thing
// it's configuring so the factory can return that type
interface ThingConfig<K extends Kind, T extends Thing<K>>{
	kind:K
	basicValue:number
	addonValue?:number
}

// default values for all optional fields in the config
let thingDefaults:Optionals<ThingConfig<any, any>> = {
	addonValue:0
}

// an entry in the thing factory
type ThingConstructor<K extends Kind, T extends Thing<K>> =
	new(config: ThingConfig<K, T>) => T

// the thing factory
class ThingFactory{

    private factories: Registry<ThingConstructor<any, any>> = {}

    register(kind: string, factory: ThingConstructor<any, any>): void {
        this.factories[kind] = factory
    }

    createObject<K extends Kind, T extends Thing<K>>(
		config: ThingConfig<K, T>
	): T {
		if(!this.factories.hasOwnProperty(config.kind)){
			throw new Error("ThingFactory cannot create a " + config.kind)
		}
        return new this.factories[config.kind](config)
    }
}

// the global thing factory where every thing module registers the thing it can create
const thingFactory = new ThingFactory()


class ThingManager{ // graphics / physics / etc

	// create a thing and add it to the world that is managed
	addThing<K extends Kind, T extends Thing<K>>(config:ThingConfig<K, T>):T{
		return thingFactory.createObject(config)
	}

	update(){
		// ...
	}
}

/////////////////////////////
// a concrete thing module //
/////////////////////////////

class CustomThing extends Thing<"custom">{
	kind:"custom"
	customProp:number
	constructor(config:CustomThingConfig){
		super()
		const fullConfig = {...customDefaults, ...config}
		
		this.generalProp = fullConfig.basicValue + fullConfig.addonValue
		this.customProp = fullConfig.customValue
	}
}

interface CustomThingConfig extends ThingConfig<"custom", CustomThing>{
	kind:"custom"
	customValue?:number
}

const customDefaults:Optionals<CustomThingConfig> = {
	...thingDefaults,
	customValue:1337
}

thingFactory.register("custom", CustomThing)

///////////////////////////////////////////
// using the manager with a custom thing //
///////////////////////////////////////////

const myManager = new ThingManager()

const myCustomConfig:CustomThingConfig = {
	"kind":"custom",
	basicValue:12,
	customValue:13
}

let myCustomThing = myManager.addThing(myCustomConfig)
// doesn't work, type not inferred :/
//myCustomThing.customProp

