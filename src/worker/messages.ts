import { Kind } from "utils";
import { ID, Key, Path } from "./path";

// generic message
interface Msg<K extends Kind>{
	kind:K
}

/**
 * hand shake
 */
export interface ReadyMsg extends Msg<"ready">{}

/**
 * {kind:"link", path:["myObj", "a", "b", "c"]} means \
 * registry[indexCounter++] = registry["myObj"].a.b.c \
 * so a proxy that was before only related to its remote target through its parent
 * now gets its own entry in the remote registry
 */
export interface LinkMsg extends Msg<"link">{
	path:Path
}

/**
 * registry[id].prop = val \
 * if the value contains any callbacks, they will be registered
 */
export interface SetMsg extends Msg<"set">{
	id:ID
	prop:ID
	val:any
}

/**
 * registry[indexCounter++] = registry[id]([...args])
 * if the args contain any callbacks, they will be registered
 */
export interface CallMsg extends Msg<"call">{
	id:ID
	args:any[]
}

/**
 * registry[indexCounter++] = new registry[id]([...args])
 */
export interface NewMsg extends Msg<"new">{
	id:ID
	args:any[]
}

/**
 * registry[id].dispose() // if defined
 * delete registry[id]
 */
export interface DisposeMsg extends Msg<"del">{
	id:ID
}

/**
 * inform the other side that a new object has been registered
 */
export interface RegisterMsg extends Msg<"reg">{
	id:Key
}

export type BridgeMsg = ReadyMsg | LinkMsg | SetMsg | CallMsg | NewMsg | RegisterMsg | DisposeMsg