
// the obvious way:
//-----------------
function frobnicate0(reqA: number, reqB: number, optC: number = 13, optD: number = 37) {
    console.log(reqA, reqB, optC, optD)
}
frobnicate0(1, 2, 3)
// + super short
// - parameters are not named in call
// - order matters
// - optional parameters cannot be skipped


// the common way:
//----------------
interface Frob1Cfg {
    reqA: number
    reqB: number
    optC?: number
    optD?: number
}
function frobnicate1(cfg: Frob1Cfg) {
    let optC = cfg.optC || 13
    let optD = cfg.optD || 37
    console.log(cfg.reqA, cfg.reqB, optC, optD)
}
frobnicate1({reqA:1, reqB:2, optC:0})
// + pretty short
// - || does not really convey intent to beginners
// - fails unacceptably on falsy arguments!!!


// the elaborate way:
//-------------------
interface Frob2Cfg {
    reqA: number
    reqB: number
    optC?: number
    optD?: number
}
function frobnicate2(cfg: Frob2Cfg) {
    let optC = typeof(cfg.optC) !== "undefined"? cfg.optC : 13
    let optD = typeof(cfg.optD) !== "undefined"? cfg.optD : 37
    console.log(cfg.reqA, cfg.reqB, optC, optD)
}
frobnicate2({reqA:1, reqB:2, optC:0})
// + rock-solid
// - very elaborate and un-DRY-esque
// - if multiple functions want a Frob2Cfg, it's extra repeating


// another idea:
//--------------
class Frob3Cfg{
    reqA: number
    reqB: number
    optC: number = 13
    optD: number = 37
    constructor(cfg: Pick<Frob3Cfg, 'reqA' | 'reqB'> & Partial<Frob3Cfg>){
        Object.assign(this, cfg)
    }
}
function frobnicate3(cfg: Frob3Cfg){
    console.log(cfg.reqA, cfg.reqB, cfg.optC, cfg.optD)
}
frobnicate3(new Frob3Cfg({reqA:1, reqB:2, optC:0}))
// - TypeScript complains that reqA and reqB are not assigned
// - the cfg type in the constructor is somewhat complicated
// + if all parameters are optional it's ok
// - call is elaborate
// + the function can be sure it gets a full cfg which looks very clean
// + and scales very well if more functions require a Frob3Cfg
// + the cfg object can be reused and is completed with defaults
//   only once and not with every function call


// yet another one:
//-----------------
interface Frob4Cfg{
    reqA: number
    reqB: number
    optC?: number
    optD?: number
}
function fillFrob4Cfg(cfg:Frob4Cfg):Required<Frob4Cfg>{
    return Object.assign({}, {optC:13, optD:37}, cfg)
}
function frobnicate4(cfg:Frob4Cfg){
    let fullcfg = fillFrob4Cfg(cfg)
    console.log(fullcfg.reqA, fullcfg.reqB, fullcfg.optC, fullcfg.optD)
}
frobnicate4({reqA:1, reqB:2, optC:3})
// + short function definition, short call
// - extra function necessary
// - defaults are copied and overwritten
// - default values somewhat hidden


// awesome way I found after some googling and that I could have started with
// but I didn't want to spare you all the pain I went through:
//---------------------------------------------------------------------------
function frobnicate9000({reqA, reqB, optC=13, optD=37}:Frob1Cfg){
    console.log(reqA, reqB, optC, optD)
}
frobnicate9000({reqA:1, reqB:2, optC:3})


// final way:
//-----------
interface FrobCfg{
    reqA:number,
    reqB:number,
    optC?:number,
    optD?:number
}
function frobnicate({reqA, reqB, optC=13, optD=37}:FrobCfg){
    console.log(reqA, reqB, optC, optD)
}
frobnicate({reqA:1, reqB:2, optC:3})
// - the only little problem is that each function can define its own defaults