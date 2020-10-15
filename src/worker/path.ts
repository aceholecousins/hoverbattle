export type Key = string // for explicitly registered objects
export type Index = number // for automatically registered objects
export type ID = Key | Index // for all objects
export type Path = ID[] // for relating a proxy via its parent (or grandparent etc.)
export type LazyPath = ()=>Path // for lazy evaluation
export type Reference = ID | LazyPath

export function makeLazyPath(parent: Reference, prop: string){
	// a lazy path is a function that returns a path when it's called
	return function(){
		if(typeof(parent) === "function"){ // the parent is itself a lazy path
			return [...parent(), prop]
		}
		else{ // the parent is already a directly linked reference
			return [parent, prop]
		}
	}
}