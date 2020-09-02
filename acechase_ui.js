!function(t){function e(e){for(var r,o,a=e[0],c=e[1],h=e[2],u=0,p=[];u<a.length;u++)o=a[u],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&p.push(i[o][0]),i[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(t[r]=c[r]);for(l&&l(e);p.length;)p.shift()();return n.push.apply(n,h||[]),s()}function s(){for(var t,e=0;e<n.length;e++){for(var s=n[e],r=!0,a=1;a<s.length;a++){var c=s[a];0!==i[c]&&(r=!1)}r&&(n.splice(e--,1),t=o(o.s=s[0]))}return t}var r={},i={2:0},n=[];function o(e){if(r[e])return r[e].exports;var s=r[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=t,o.c=r,o.d=function(t,e,s){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(s,r,function(e){return t[e]}.bind(null,r));return s},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="";var a=window.webpackJsonp=window.webpackJsonp||[],c=a.push.bind(a);a.push=e,a=a.slice();for(var h=0;h<a.length;h++)e(a[h]);var l=c;n.push([71,0]),s()}({12:function(t,e,s){"use strict";s.d(e,"a",(function(){return a}));var r=s(6),i=s(1);const n=new class{constructor(){this.constructors={}}register(t,e){this.constructors[t]=e}createShape(t){if(!this.constructors.hasOwnProperty(t.kind))throw new Error("P2ShapeFactory cannot create a "+t.kind);return new this.constructors[t.kind](t)}};class o{constructor(t,e){this.toBeDeleted=!1,this.p2world=t,this.p2body=new r.Body({mass:1}),Object.assign(this,e);for(let t of e.shapes){let e=n.createShape(t);this.p2body.addShape(e.p2shape)}this.p2world.addBody(this.p2body)}set mass(t){this.p2body.mass=t,this.p2body.updateMassProperties()}get mass(){return this.p2body.mass}set position(t){i.b.copy(this.p2body.position,t)}get position(){return i.b.clone(this.p2body.position)}set velocity(t){i.b.copy(this.p2body.velocity,t)}get velocity(){return i.b.clone(this.p2body.velocity)}set damping(t){this.p2body.damping=t}get damping(){return this.p2body.damping}set angle(t){this.p2body.angle=t}get angle(){return this.p2body.angle}set angularVelocity(t){this.p2body.angularVelocity=t}get angularVelocity(){return this.p2body.angularVelocity}set angularDamping(t){this.p2body.angularDamping=t}get angularDamping(){return this.p2body.angularDamping}applyForce(t,e=i.b.fromValues(0,0)){this.p2body.applyForce([t[0],t[1]],[e[0],e[1]])}applyLocalForce(t,e=i.b.fromValues(0,0)){this.p2body.applyForceLocal([t[0],t[1]],[e[0],e[1]])}applyImpulse(t,e=i.b.fromValues(0,0)){this.p2body.applyImpulse([t[0],t[1]],[e[0],e[1]])}applyLocalImpulse(t,e=i.b.fromValues(0,0)){this.p2body.applyImpulseLocal([t[0],t[1]],[e[0],e[1]])}applyTorque(t){this.p2body.angularForce+=t}applyAngularMomentum(t){this.p2body.angularVelocity+=this.p2body.invInertia*t}remove(){this.p2world.removeBody(this.p2body)}}n.register("circle",class extends class{updateP2(){this.p2shape.updateBoundingRadius(),null!==this.p2shape.body&&(this.p2shape.body.aabbNeedsUpdate=!0,this.p2shape.body.updateBoundingRadius())}set offset(t){i.b.copy(this.p2shape.position,t)}get offset(){return i.b.clone(this.p2shape.position)}set offsetAngle(t){this.p2shape.angle=t}get offsetAngle(){return this.p2shape.angle}}{constructor(t){super(),this.p2shape=new r.Circle,Object.assign(this,t)}set radius(t){this.p2shape.radius=t,this.updateP2()}get radius(){return this.p2shape.radius}set boundingRadius(t){this.p2shape.radius=t,this.updateP2()}get boundingRadius(){return this.p2shape.boundingRadius}});class a{constructor(){this.p2world=new r.World({gravity:[0,0]})}addRigidBody(t){return new o(this.p2world,t)}step(t){this.p2world.step(t)}}},71:function(t,e,s){"use strict";s.r(e);var r=s(1),i=s(0),n=s(52);function o(t,e,s){for(const r of s)t[r]=e[r]}function a(t,e,s){for(const r of s)r in e&&(t[r]=e[r])}class c{constructor(t={}){this.position=r.c.fromValues(0,0,0),this.orientation=r.a.fromValues(0,0,0,1),this.scaling=r.c.fromValues(1,1,1),this.kind=t.kind,a(this,t,["position","orientation","scaling"])}}class h extends c{constructor(t={}){super(t),this.kind="camera",this.nearClip=.1,this.farClip=1e3,this.verticalAngleOfViewInDeg=40,a(this,t,["nearClip","farClip","verticalAngleOfViewInDeg"])}}var l=s(53);class u extends class{}{constructor(){super(...arguments),this.threeObject=void 0}}const p=new l.a;class d{load(t,e,s){let r=new u;return p.load(t,(function(t){r.threeObject=t.scene,e()}),void 0,s),r}}class g{constructor(t,e,s){this.threeScene=t,this.threeObject=e,t.add(e),o(this,s,["kind","position","orientation","scaling"])}set position(t){this.threeObject.position.set(t[0],t[1],t[2])}set orientation(t){this.threeObject.quaternion.set(t[0],t[1],t[2],t[3])}set scaling(t){this.threeObject.scale.set(t[0],t[1],t[2])}remove(){this.threeScene.remove(this.threeObject)}}class b extends g{constructor(t,e){super(t,new i.S,e),o(this,e,["nearClip","farClip","verticalAngleOfViewInDeg"])}set nearClip(t){this.threeObject.near=t,this.threeObject.updateProjectionMatrix()}set farClip(t){this.threeObject.far=t,this.threeObject.updateProjectionMatrix()}set verticalAngleOfViewInDeg(t){this.threeObject.fov=t,this.threeObject.updateProjectionMatrix()}activate(){this.threeScene.userData.activeCamera=this.threeObject}}class y{constructor(t){this.threeScene=t}create(t){return new b(this.threeScene,t)}}class m extends g{constructor(t,e){super(t,new i.T,e),this.color=e.color}set color(t){this.threeObject.color.setRGB(t.r,t.g,t.b)}}class f extends g{constructor(t,e){super(t,new i.o,e),this.groundColor=e.groundColor,this.skyColor=e.skyColor}set groundColor(t){this.threeObject.groundColor.setRGB(t.r,t.g,t.b)}set skyColor(t){this.threeObject.color.setRGB(t.r,t.g,t.b)}}class w{constructor(t){this.threeScene=t}createPointLight(t){return new m(this.threeScene,t)}createHemisphereLight(t){return new f(this.threeScene,t)}}function v(t,e){"mesh"==t.type&&t.material.color.setRGB(e.r,e.g,e.b);for(let s of t.children)v(s,e)}class O extends g{constructor(t,e,s){super(t,e.clone(),s),o(this,s,["baseColor","accentColor"])}set baseColor(t){v(this.threeObject,t)}set accentColor(t){v(this.threeObject,t)}}class S{constructor(t){this.threeScene=t}createFromModel(t){return new O(this.threeScene,t.asset.threeObject.clone(),t)}}class j{constructor(t){this.graphics=t;const e=()=>{t.renderer.setSize(t.canvas.clientWidth,t.canvas.clientHeight,!1);const e=t.scene.userData.activeCamera;e.aspect=t.canvas.clientWidth/t.canvas.clientHeight,e.updateProjectionMatrix()};window.addEventListener("resize",e),e()}update(t){this.graphics.renderer.render(this.graphics.scene,this.graphics.scene.userData.activeCamera)}}class C extends c{constructor(t={}){super(t),this.kind="mesh",a(this,t,["baseColor","accentColor"])}}class D extends C{constructor(t){super(t),this.asset=t.asset}}class k{constructor(t,e){this.note=e,this.check=t}}var P,T=s(12);class M extends class{constructor(t){this.offset=r.b.fromValues(0,0),this.offsetAngle=0,this.kind=t.kind,a(this,t,["offset","offsetAngle"])}}{constructor(t){super(t),this.kind="circle",this.radius=1,a(this,t,["radius"])}}class A{constructor(t){this.mass=1,this.position=r.b.fromValues(0,0),this.velocity=r.b.fromValues(0,0),this.damping=.1,this.angle=0,this.angularVelocity=0,this.angularDamping=.1,a(this,t,["shapes","mass","position","velocity","damping","angle","angularVelocity","angularDamping"])}}!function(t){t.UP="KeyW",t.DOWN="KeyS",t.RIGHT="KeyD",t.LEFT="KeyA",t.SHOOT="Space",t.PAUSE="Pause",t.SWITCH_MODE="KeyM"}(P||(P={}));class I{constructor(){this.shooting=!1,this.currentStrategy=new R,document.addEventListener("keydown",t=>{this.onKeyAction(t,!0)}),document.addEventListener("keyup",t=>{this.onKeyAction(t,!1)})}getAbsoluteDirection(){return this.currentStrategy.getAbsoluteDirection()}getTurnRate(){return this.currentStrategy.getTurnRate()}getThrust(){return this.currentStrategy.getThrust()}isShooting(){return this.shooting}setPauseCallback(t){throw new Error("Method not implemented.")}onKeyAction(t,e){t.repeat||(this.onGeneralKeyAction(t.code,e),this.currentStrategy.onKeyAction(t.code,e))}onGeneralKeyAction(t,e){switch(t){case P.SHOOT:this.shooting=e;break;case P.SWITCH_MODE:e&&this.switchStrategy()}}switchStrategy(){this.currentStrategy instanceof R?(console.log("Switch to absolute keyboard"),this.currentStrategy=new V):(console.log("Switch to relative keyboard"),this.currentStrategy=new R)}}class R{constructor(){this.turnRate=0,this.thrust=0,this.valueLeft=0,this.valueRight=0}getAbsoluteDirection(){}getTurnRate(){return this.turnRate}getThrust(){return this.thrust}onKeyAction(t,e){t==P.UP&&(this.thrust=e?1:0),t==P.LEFT&&(this.valueLeft=e?1:0),t==P.RIGHT&&(this.valueRight=e?1:0),this.turnRate=this.valueLeft-this.valueRight}}class V{constructor(){this.absoluteDirection=void 0,this.thrust=0,this.valueUp=0,this.valueDown=0,this.valueLeft=0,this.valueRight=0}getAbsoluteDirection(){return this.absoluteDirection}getTurnRate(){}getThrust(){return this.thrust}onKeyAction(t,e){switch(t){case P.UP:this.valueUp=e?1:0;break;case P.DOWN:this.valueDown=e?1:0;break;case P.RIGHT:this.valueRight=e?1:0;break;case P.LEFT:this.valueLeft=e?1:0}let s=this.valueRight-this.valueLeft,r=this.valueUp-this.valueDown;this.absoluteDirection=0!=s||0!=r?Math.atan2(r,s):void 0,this.thrust=0!=s||0!=r?1:0}}function x(t,e=Math.PI){let s=(t-e)/2/Math.PI;return 2*(s-Math.floor(s)-1)*Math.PI+e}let L=new class{constructor(t){this.canvas=t,this.renderer=new i.qb({canvas:t}),this.scene=new i.cb,this.model=new d,this.camera=new y(this.scene),this.light=new w(this.scene),this.mesh=new S(this.scene);let e=this.camera.create(new h);e.position=r.c.fromValues(0,0,10),e.activate();new n.a(e.threeObject,this.renderer.domElement).screenSpacePanning=!0,this.scene.add(new i.o("white","black")),this.scene.add(new i.b),this.control=new j(this)}}(document.getElementById("rendertarget")),E=new T.a,F=new class{constructor({onItemCheck:t=(t=>{}),onComplete:e=(()=>{})}={}){this.items=new Set,this.numTotalItems=0,this.onItemCheck=t,this.onComplete=e}newItem({onCheck:t=(()=>{}),note:e}={}){this.numTotalItems++;let s=this,r=new k(()=>{t(),s.onItemCheck(r.note),s.items.delete(r),0==s.items.size&&s.onComplete()},e);return this.items.add(r),r}getProgress(){return 1-this.items.size/this.numTotalItems}reset(){this.items.clear(),this.numTotalItems=0}}({onComplete:function(){const t=new A({shapes:[new M({radius:1})],damping:.7,angularDamping:.99}),e=new D({asset:B}),s=new I;let i=[];for(let n=0;n<50;n++){let n=new K(t,e,s);n.body.position=r.b.fromValues(20*Math.random()-10,20*Math.random()-10),n.body.angle=1e3*Math.random(),i.push(n)}requestAnimationFrame((function t(e){requestAnimationFrame(t);for(let t of i)t.update();E.step(1/60),L.control.update(e)}))}}).newItem();const B=L.model.load("glider/glider.gltf",F.check);class K{constructor(t,e,s){this.thrust=0,this.body=E.addRigidBody(t),this.mesh=L.mesh.createFromModel(e),this.controller=s}update(){this.thrust=10*this.controller.getThrust(),this.body.applyLocalForce(r.b.fromValues(this.thrust,0));const t=this.controller.getTurnRate();null!=t&&this.body.applyAngularMomentum(.3*t);const e=this.controller.getAbsoluteDirection();null!=e&&this.turnToDirection(e),this.mesh.position=[this.body.position[0],this.body.position[1],0],this.mesh.orientation=r.a.fromEuler([0,0,0,0],0,0,this.body.angle/Math.PI*180)}turnToDirection(t){let e=x(this.body.angle),s=x(e-t);if(Math.abs(s)>1e-4){let t=Math.sign(s);this.body.applyAngularMomentum(.3*-t)}}}}});
//# sourceMappingURL=acechase_ui.js.map