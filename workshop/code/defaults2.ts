

type Optionalize<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

class Config{
    reqA:number
    reqB:number
    optC:number = 13
    optD:number = 37

}
