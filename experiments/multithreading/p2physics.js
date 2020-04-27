class P2Body {
    constructor() {
        this.handle = new p2.Body({
            position: [0, 0],
            velocity: [0, 0],
            damping: 0,
            angle: 0,
            angularVelocity: 0,
            angularDamping: 0,
            mass: 1,
        });
    }
    getHandle() {
        return this.handle;
    }
    setPosition(position) {
        this.handle.position[0] = position.x;
        this.handle.position[1] = position.y;
        return this;
    }
    getPosition() {
        return {
            x: this.handle.position[0],
            y: this.handle.position[1]
        };
    }
    setVelocity(velocity) {
        this.handle.velocity[0] = velocity.x;
        this.handle.velocity[1] = velocity.y;
        return this;
    }
    getVelocity() {
        return {
            x: this.handle.velocity[0],
            y: this.handle.velocity[1]
        };
    }
    /*
        setDamping(damping:number):RigidBody{
            this.handle.damping = damping
            return this
        }
    
        getDamping():number{
            return this.handle.damping
        }
    
        setAngle(angle:number):RigidBody{
            this.handle.angle = angle
            return this
        }
    
        getAngle():number{
            return this.handle.angle
        }
    
        setAngularVelocity(angularVelocity:number):RigidBody
        getAngularVelocity():number
        setAngularDamping(angularDamping:number):RigidBody
        getAngularDamping():number
    
        setMass(mass:number):RigidBody
        getMass():number
        */
    setShape(shape) {
        for (var i = this.handle.shapes.length; i >= 0; --i) {
            this.handle.removeShape(this.handle.shapes[i]);
        }
        switch (shape.kind) {
            case "box": {
                this.handle.addShape(new p2.Box({
                    width: shape.width,
                    height: shape.height
                }));
                break;
            }
            case "circle": {
                this.handle.addShape(new p2.Circle({
                    radius: shape.radius
                }));
                break;
            }
        }
        return this;
    }
    /*
    getShape():Shape
    */
    applyForce(force) {
        this.handle.applyForce([force.x, force.y]);
        return this;
    }
}
class P2Physics {
    constructor() {
        this.world = new p2.World({ gravity: [0, 0] });
        this.world.defaultContactMaterial.friction = 0.01;
        this.world.defaultContactMaterial.restitution = 0.999;
        this.world.defaultContactMaterial.stiffness = 1e9;
    }
    createBody() {
        let body = new P2Body();
        this.world.addBody(body.getHandle());
        return body;
    }
    step(dt) {
        this.world.step(dt);
    }
}
