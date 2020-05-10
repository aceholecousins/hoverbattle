
let groupId = 0
function makeGroupId() {
    return groupId++
}

class Entity{
    id = 0
    kind = "entity"
}

function newColliderMixin(){
    return class{
        collisionGroup=5
    }
}

class Damagee extends newColliderMixin(){
    hull = 0
}

class Damager extends newColliderMixin(){
    damage = 0
    fart(){}
}

class Glider extends Entity{
    constructor(){
        super()
        this.kind = "glider"
    }
}
interface Glider extends Damagee, Damager{}
applyColliderMixins(Glider, [Damagee, Damager])

type Constructor<T = {}> = new (...args: any[]) => T

function applyColliderMixins(Ent: Constructor, Mixins: Constructor[]) {
    Mixins.forEach(Mixin => {
        Object.getOwnPropertyNames(Mixin.prototype).forEach(name => {
            Object.defineProperty(
                Ent.prototype,
                name,
                Object.getOwnPropertyDescriptor(Mixin.prototype, name) as PropertyDescriptor
            );
            console.log(name)
        });
    });
}



