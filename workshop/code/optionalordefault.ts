// modify an object by assigning fields either from a defaults object
// or if present from an optionals object
export function assignOptionalOrDefault<U extends Object, T extends U>(
	target: T, optionals: U, defaults: Required<U>
){
    for (let key in defaults) {
        (<any>target)[key] = optionals.hasOwnProperty(key)? optionals[key] : defaults[key]
    }
    return target
}