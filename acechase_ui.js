!function(t){function e(e){for(var i,o,a=e[0],c=e[1],h=e[2],u=0,p=[];u<a.length;u++)o=a[u],Object.prototype.hasOwnProperty.call(n,o)&&n[o]&&p.push(n[o][0]),n[o]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);for(l&&l(e);p.length;)p.shift()();return r.push.apply(r,h||[]),s()}function s(){for(var t,e=0;e<r.length;e++){for(var s=r[e],i=!0,a=1;a<s.length;a++){var c=s[a];0!==n[c]&&(i=!1)}i&&(r.splice(e--,1),t=o(o.s=s[0]))}return t}var i={},n={2:0},r=[];function o(e){if(i[e])return i[e].exports;var s=i[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=t,o.c=i,o.d=function(t,e,s){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(s,i,function(e){return t[e]}.bind(null,i));return s},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="";var a=window.webpackJsonp=window.webpackJsonp||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var h=0;h<a.length;h++)e(a[h]);var l=c;r.push([71,0]),s()}({12:function(t,e,s){"use strict";s.d(e,"a",(function(){return a}));var i=s(6),n=s(1);const r=new class{constructor(){this.factories={}}register(t,e){this.factories[t]=e}createShape(t){if(!this.factories.hasOwnProperty(t.kind))throw new Error("P2ShapeFactory cannot create a "+t.kind);return new this.factories[t.kind](t)}};class o{constructor(t,e){this.toBeDeleted=!1,this.p2world=t,this.p2body=new i.Body({mass:1}),Object.assign(this,e);for(let t of e.shapes){let e=r.createShape(t);this.p2body.addShape(e.p2shape)}this.p2world.addBody(this.p2body)}set mass(t){this.p2body.mass=t,this.p2body.updateMassProperties()}get mass(){return this.p2body.mass}set position(t){n.b.copy(this.p2body.position,t)}get position(){return n.b.clone(this.p2body.position)}set velocity(t){n.b.copy(this.p2body.velocity,t)}get velocity(){return n.b.clone(this.p2body.velocity)}set damping(t){this.p2body.damping=t}get damping(){return this.p2body.damping}set angle(t){this.p2body.angle=t}get angle(){return this.p2body.angle}set angularVelocity(t){this.p2body.angularVelocity=t}get angularVelocity(){return this.p2body.angularVelocity}set angularDamping(t){this.p2body.angularDamping=t}get angularDamping(){return this.p2body.angularDamping}applyForce(t,e=n.b.fromValues(0,0)){this.p2body.applyForce([t[0],t[1]],[e[0],e[1]])}applyLocalForce(t,e=n.b.fromValues(0,0)){this.p2body.applyForceLocal([t[0],t[1]],[e[0],e[1]])}applyImpulse(t,e=n.b.fromValues(0,0)){this.p2body.applyImpulse([t[0],t[1]],[e[0],e[1]])}applyLocalImpulse(t,e=n.b.fromValues(0,0)){this.p2body.applyImpulseLocal([t[0],t[1]],[e[0],e[1]])}applyTorque(t){this.p2body.angularForce+=t}applyAngularMomentum(t){this.p2body.angularVelocity+=this.p2body.invInertia*t}remove(){this.p2world.removeBody(this.p2body)}}r.register("circle",class extends class{updateP2(){this.p2shape.updateBoundingRadius(),null!==this.p2shape.body&&(this.p2shape.body.aabbNeedsUpdate=!0,this.p2shape.body.updateBoundingRadius())}set offset(t){n.b.copy(this.p2shape.position,t)}get offset(){return n.b.clone(this.p2shape.position)}set offsetAngle(t){this.p2shape.angle=t}get offsetAngle(){return this.p2shape.angle}}{constructor(t){super(),this.p2shape=new i.Circle,Object.assign(this,t)}set radius(t){this.p2shape.radius=t,this.updateP2()}get radius(){return this.p2shape.radius}set boundingRadius(t){this.p2shape.radius=t,this.updateP2()}get boundingRadius(){return this.p2shape.boundingRadius}});class a{constructor(){this.p2world=new i.World({gravity:[0,0]})}addRigidBody(t){return new o(this.p2world,t)}step(t){this.p2world.step(t)}}},71:function(t,e,s){"use strict";s.r(e);const i=new class{constructor(){this.factories={}}register(t,e){this.factories[t]=e}createAsset(t,e,s){if(!this.factories.hasOwnProperty(t.kind))throw new Error("ThreeAssetFactory cannot create a "+t.kind);return new this.factories[t.kind](t,e,s)}};var n=s(52),r=s(1);const o={position:r.c.fromValues(0,0,0),orientation:r.a.fromValues(0,0,0,1),scaling:r.c.fromValues(1,1,1)};new class{constructor(){this.factories={}}register(t,e){this.factories[t]=e}createGraphicsObject(t){return new this.factories[t.kind](t)}};const a=Object.assign(Object.assign({},o),{nearClip:.1,farClip:1e3,verticalAngleOfViewInDeg:40});var c=s(0);class h{set position(t){this.threeObject.position.set(t[0],t[1],t[2])}set orientation(t){this.threeObject.quaternion.set(t[0],t[1],t[2],t[3])}set scaling(t){this.threeObject.scale.set(t[0],t[1],t[2])}remove(){this.threeScene.remove(this.threeObject)}}const l=new class{constructor(){this.factories={}}register(t,e){this.factories[t]=e}createObject(t,e){if(!this.factories.hasOwnProperty(e.kind))throw new Error("ThreeObjectFactory cannot create a "+e.kind);return new this.factories[e.kind](t,e)}};const u=new(s(53).a);i.register("model",class{constructor(t,e,s){this.model=null;const i=this;u.load(t.file,(function(t){i.model=t.scene,e()}),t=>{},s)}});const p=Object.assign(Object.assign({},o),{color:{r:1,g:1,b:1}});l.register("model",class extends h{constructor(t,e){const{kind:s,position:i,orientation:n,scaling:r,asset:o,color:a}=Object.assign(Object.assign({},p),e);super(),this.threeScene=t,this.threeObject=o.model.clone(),Object.assign(this,{kind:s,position:i,orientation:n,scaling:r,color:a}),this.threeScene.add(this.threeObject)}});l.register("camera",class extends h{constructor(t,e){const s=Object.assign(Object.assign({},a),e);super(),this.threeScene=t,this.threeObject=new c.S,Object.assign(this,s),this.threeScene.add(this.threeObject)}set nearClip(t){this.threeObject.near=t,this.threeObject.updateProjectionMatrix()}set farClip(t){this.threeObject.far=t,this.threeObject.updateProjectionMatrix()}set verticalAngleOfViewInDeg(t){this.threeObject.fov=t,this.threeObject.updateProjectionMatrix()}activate(){this.threeScene.userData.activeCamera=this.threeObject}});class d{constructor(t,e){this.note=e,this.check=t}}var g,m=s(12);class b extends class{constructor(t){this.offset=r.b.fromValues(0,0),this.offsetAngle=0,this.kind=t.kind,"offset"in t&&(this.offset=t.offset),"offsetAngle"in t&&(this.offsetAngle=t.offsetAngle)}}{constructor(t){super(t),this.kind="circle",this.radius=1,"radius"in t&&(this.radius=t.radius)}}class y{constructor(t){this.mass=1,this.position=r.b.fromValues(0,0),this.velocity=r.b.fromValues(0,0),this.damping=.1,this.angle=0,this.angularVelocity=0,this.angularDamping=.1,"shapes"in t&&(this.shapes=t.shapes),"mass"in t&&(this.mass=t.mass),"position"in t&&(this.position=t.position),"velocity"in t&&(this.velocity=t.velocity),"damping"in t&&(this.damping=t.damping),"angle"in t&&(this.angle=t.angle),"angularVelocity"in t&&(this.angularVelocity=t.angularVelocity),"angularDamping"in t&&(this.angularDamping=t.angularDamping)}}!function(t){t.UP="KeyW",t.DOWN="KeyS",t.RIGHT="KeyD",t.LEFT="KeyA",t.SHOOT="Space",t.PAUSE="Pause"}(g||(g={}));class f{constructor(){this.shooting=!1,this.currentStrategy=new w,document.addEventListener("keydown",t=>{this.onKeyAction(t,1)}),document.addEventListener("keyup",t=>{this.onKeyAction(t,0)})}getAbsoluteDirection(){return this.currentStrategy.getAbsoluteDirection()}getTurnRate(){return this.currentStrategy.getTurnRate()}getThrust(){return this.currentStrategy.getThrust()}isShooting(){return this.shooting}setPauseCallback(t){throw new Error("Method not implemented.")}onKeyAction(t,e){t.repeat||(this.onGeneralKeyAction(t.code,e),this.currentStrategy.onKeyAction(t.code,e))}onGeneralKeyAction(t,e){t==g.SHOOT&&(this.shooting=0!=e)}}class w{constructor(){this.turnRate=0,this.thrust=0}getAbsoluteDirection(){}getTurnRate(){return this.turnRate}getThrust(){return this.thrust}onKeyAction(t,e){t==g.UP&&(this.thrust=e),this.turnRate=0,t==g.LEFT&&(this.turnRate+=e),t==g.RIGHT&&(this.turnRate-=e)}}let O=new class{constructor(t){this.canvas=t,this.renderer=new c.qb({canvas:t}),this.scene=new c.cb;const e=new c.S(a.verticalAngleOfViewInDeg,1,a.nearClip,a.farClip);e.position.set(0,0,10),this.scene.add(e),this.scene.userData.activeCamera=e,new n.a(e,this.renderer.domElement).screenSpacePanning=!0,this.scene.add(new c.o("white","black")),this.scene.add(new c.b);const s=this,i=()=>{s.renderer.setSize(s.canvas.clientWidth,s.canvas.clientHeight,!1);const e=this.scene.userData.activeCamera;e.aspect=t.clientWidth/t.clientHeight,e.updateProjectionMatrix()};window.addEventListener("resize",i),i()}loadAsset(t,e,s){return i.createAsset(t,e,s)}addObject(t){return l.createObject(this.scene,t)}update(t){this.renderer.render(this.scene,this.scene.userData.activeCamera)}}(document.getElementById("rendertarget")),v=new m.a;class j{constructor(t,e,s){this.thrust=0,this.angularMomentum=0,this.body=v.addRigidBody(t),this.model=O.addObject(e),this.controller=s}update(){this.thrust=10*this.controller.getThrust(),this.body.applyLocalForce(r.b.fromValues(this.thrust,0)),this.angularMomentum=.3*this.controller.getTurnRate(),null!=this.angularMomentum&&this.body.applyAngularMomentum(this.angularMomentum),this.model.position=[this.body.position[0],this.body.position[1],0],this.model.orientation=r.a.fromEuler([0,0,0,0],0,0,this.body.angle/Math.PI*180)}}let S=new class{constructor({onItemCheck:t=(t=>{}),onComplete:e=(()=>{})}={}){this.items=new Set,this.numTotalItems=0,this.onItemCheck=t,this.onComplete=e}newItem({onCheck:t=(()=>{}),note:e}={}){this.numTotalItems++;let s=this,i=new d(()=>{t(),s.onItemCheck(i.note),s.items.delete(i),0==s.items.size&&s.onComplete()},e);return this.items.add(i),i}getProgress(){return 1-this.items.size/this.numTotalItems}reset(){this.items.clear(),this.numTotalItems=0}}({onComplete:function(){const t=new y({shapes:[new b({radius:1})],damping:.7,angularDamping:.99}),e={kind:"model",asset:A,color:{r:1,g:1,b:1}},s=new f;let i=[];for(let n=0;n<50;n++){let n=new j(t,e,s);n.body.position=r.b.fromValues(20*Math.random()-10,20*Math.random()-10),n.body.angle=1e3*Math.random(),i.push(n)}requestAnimationFrame((function t(e){requestAnimationFrame(t);for(let t of i)t.update();v.step(1/60),O.update(e)}))}}).newItem();const A=O.loadAsset({kind:"model",file:"glider/glider.gltf"},S.check)}});
//# sourceMappingURL=acechase_ui.js.map