var window=self;importScripts("./acechase_lib.js"),function(e){function t(t){for(var o,n,i=t[0],p=t[1],l=t[2],d=0,c=[];d<i.length;d++)n=i[d],Object.prototype.hasOwnProperty.call(r,n)&&r[n]&&c.push(r[n][0]),r[n]=0;for(o in p)Object.prototype.hasOwnProperty.call(p,o)&&(e[o]=p[o]);for(u&&u(t);c.length;)c.shift()();return a.push.apply(a,l||[]),s()}function s(){for(var e,t=0;t<a.length;t++){for(var s=a[t],o=!0,i=1;i<s.length;i++){var p=s[i];0!==r[p]&&(o=!1)}o&&(a.splice(t--,1),e=n(n.s=s[0]))}return e}var o={},r={1:0},a=[];function n(t){if(o[t])return o[t].exports;var s=o[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=o,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(s,o,function(t){return e[t]}.bind(null,o));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="";var i=window.webpackJsonp=window.webpackJsonp||[],p=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var u=p;a.push([70,0]),s()}({12:function(e,t,s){"use strict";s.d(t,"a",(function(){return i}));var o=s(6),r=s(1);const a=new class{constructor(){this.factories={}}register(e,t){this.factories[e]=t}createShape(e){if(!this.factories.hasOwnProperty(e.kind))throw new Error("P2ShapeFactory cannot create a "+e.kind);return new this.factories[e.kind](e)}};class n{constructor(e,t){this.toBeDeleted=!1,this.p2world=e,this.p2body=new o.Body({mass:1}),Object.assign(this,t);for(let e of t.shapes){let t=a.createShape(e);this.p2body.addShape(t.p2shape)}this.p2world.addBody(this.p2body)}set mass(e){this.p2body.mass=e,this.p2body.updateMassProperties()}get mass(){return this.p2body.mass}set position(e){r.b.copy(this.p2body.position,e)}get position(){return r.b.clone(this.p2body.position)}set velocity(e){r.b.copy(this.p2body.velocity,e)}get velocity(){return r.b.clone(this.p2body.velocity)}set damping(e){this.p2body.damping=e}get damping(){return this.p2body.damping}set angle(e){this.p2body.angle=e}get angle(){return this.p2body.angle}set angularVelocity(e){this.p2body.angularVelocity=e}get angularVelocity(){return this.p2body.angularVelocity}set angularDamping(e){this.p2body.angularDamping=e}get angularDamping(){return this.p2body.angularDamping}applyForce(e,t=r.b.fromValues(0,0)){this.p2body.applyForce([e[0],e[1]],[t[0],t[1]])}applyLocalForce(e,t=r.b.fromValues(0,0)){this.p2body.applyForceLocal([e[0],e[1]],[t[0],t[1]])}applyImpulse(e,t=r.b.fromValues(0,0)){this.p2body.applyImpulse([e[0],e[1]],[t[0],t[1]])}applyLocalImpulse(e,t=r.b.fromValues(0,0)){this.p2body.applyImpulseLocal([e[0],e[1]],[t[0],t[1]])}applyTorque(e){this.p2body.angularForce+=e}applyAngularMomentum(e){this.p2body.angularVelocity+=this.p2body.invInertia*e}remove(){this.p2world.removeBody(this.p2body)}}a.register("circle",class extends class{updateP2(){this.p2shape.updateBoundingRadius(),null!==this.p2shape.body&&(this.p2shape.body.aabbNeedsUpdate=!0,this.p2shape.body.updateBoundingRadius())}set offset(e){r.b.copy(this.p2shape.position,e)}get offset(){return r.b.clone(this.p2shape.position)}set offsetAngle(e){this.p2shape.angle=e}get offsetAngle(){return this.p2shape.angle}}{constructor(e){super(),this.p2shape=new o.Circle,Object.assign(this,e)}set radius(e){this.p2shape.radius=e,this.updateP2()}get radius(){return this.p2shape.radius}set boundingRadius(e){this.p2shape.radius=e,this.updateP2()}get boundingRadius(){return this.p2shape.boundingRadius}});class i{constructor(){this.p2world=new o.World({gravity:[0,0]})}addRigidBody(e){return new n(this.p2world,e)}step(e){this.p2world.step(e)}}},70:function(e,t,s){"use strict";s.r(t);var o=s(12);const r=self;let a=new class{constructor(){this.physics=new o.a}update(e){this.physics.step(e)}};setInterval(()=>{a.update(.01)},.01),r.onmessage=function(e){console.log(e.data)}}});
//# sourceMappingURL=acechase_engine.js.map