// Interface
//----------
interface FrobCfg{
    reqA:number
    reqB:number
    optC?:number
    optD?:number
}
const frobDefaults:Optionals<FrobCfg> = {
    optC:13,
    optD:37
}
type Frobnicator = (cfg: FrobCfg) => void

// Implementation
//---------------
const frobnicate:Frobnicator = (cfg: FrobCfg) => {
    const {reqA, reqB, optC, optD}:Required<FrobCfg> =
        {...frobDefaults, ...cfg}
    
    console.log(reqA, reqB, optC, optD)
}

// Call
//-----
frobnicate({reqA:1, reqB:2, optC:3})


// Generics Utilities
// https://stackoverflow.com/a/49579497/3825996

type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

type OptionalKeys<T> = { [K in keyof T]-?:
  ({} extends { [P in K]: T[K] } ? K : never)
}[keyof T]

type Optionals<T> = Required<Pick<T, OptionalKeys<T>>>