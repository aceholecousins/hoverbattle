import { ModelMeshConfig } from "game/graphics/mesh"
import { Engine } from "game/match"
import { RigidBodyConfig } from "game/physics/rigidbody"
import { TriangleConfig } from "game/physics/triangle"
import { triangle3to2 } from "utilities/math_utils"
import { Entity } from "../entity"

export async function loadArena(
    engine:Engine,
    modelFile:string,
    processMeta:(meta:any)=>void = ()=>{}
){
    return new Promise<Entity>((resolve)=>{

        let arenaAsset = engine.graphics.model.load(
            modelFile,
            function(meta){
                let arenaActor = new Entity()

                for(let tri of meta.collision){
                    engine.physics.addRigidBody(
                        new RigidBodyConfig({
                            actor:arenaActor,
                            mass:Infinity,
                            shapes:[new TriangleConfig({corners:triangle3to2(tri)})]
                        })
                    )
                }
                
                engine.graphics.mesh.createFromModel(new ModelMeshConfig({
                    asset:arenaAsset
                }))
                
                processMeta(meta)

                resolve(arenaActor)
            }
        )
    
    })
}