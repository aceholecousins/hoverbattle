var window=self;importScripts("./acechase_lib.js"),function(e){function t(t){for(var a,n,s=t[0],l=t[1],p=t[2],c=0,d=[];c<s.length;c++)n=s[c],Object.prototype.hasOwnProperty.call(i,n)&&i[n]&&d.push(i[n][0]),i[n]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);for(u&&u(t);d.length;)d.shift()();return r.push.apply(r,p||[]),o()}function o(){for(var e,t=0;t<r.length;t++){for(var o=r[t],a=!0,s=1;s<o.length;s++){var l=o[s];0!==i[l]&&(a=!1)}a&&(r.splice(t--,1),e=n(n.s=o[0]))}return e}var a={},i={1:0},r=[];function n(t){if(a[t])return a[t].exports;var o=a[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=a,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="";var s=window.webpackJsonp=window.webpackJsonp||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var p=0;p<s.length;p++)t(s[p]);var u=l;r.push([72,0]),o()}({72:function(e,t,o){"use strict";o.r(t);var a=o(17),i=o(2);let r={kind:void 0,offset:i.a.fromValues(0,0),offsetAngle:0};const n=new class{constructor(){this.factories={}}register(e,t){this.factories[e]=t}createShape(e){return new this.factories[e.kind](e)}};let s={shapes:[Object.assign({},r,{kind:"circle",radius:1})],mass:1,position:i.a.fromValues(0,0),velocity:i.a.fromValues(0,0),damping:1,angle:0,angularVelocity:0,angularDamping:1};function l(e,t){return void 0!==e?e:t}class p{constructor(e){this.toBeDeleted=!1,this.p2body=new a.Body,this.mass=l(e.mass,s.mass),this.position=l(e.position,s.position),this.velocity=l(e.velocity,s.velocity),this.damping=l(e.damping,s.damping),this.angle=l(e.angle,s.angle),this.angularVelocity=l(e.angularVelocity,s.angularVelocity),this.angularDamping=l(e.angularDamping,s.angularDamping);for(let t of e.shapes){let e=n.createShape(t);this.shapes.push(e),this.p2body.addShape(e.p2shape)}}set mass(e){this.p2body.mass=e}get mass(){return this.p2body.mass}set position(e){i.a.copy(this.p2body.position,e)}get position(){return i.a.clone(this.p2body.position)}set velocity(e){i.a.copy(this.p2body.velocity,e)}get velocity(){return i.a.clone(this.p2body.velocity)}set damping(e){this.p2body.damping=e}get damping(){return this.p2body.damping}set angle(e){this.p2body.angle=e}get angle(){return this.p2body.angle}set angularVelocity(e){this.p2body.angularVelocity=e}get angularVelocity(){return this.p2body.angularVelocity}set angularDamping(e){this.p2body.angularDamping=e}get angularDamping(){return this.p2body.angularDamping}applyForce(e,t=i.a.fromValues(0,0)){this.p2body.applyForce([e[0],e[1]],[t[0],t[1]])}applyLocalForce(e,t=i.a.fromValues(0,0)){this.p2body.applyForceLocal([e[0],e[1]],[t[0],t[1]])}applyImpulse(e,t=i.a.fromValues(0,0)){this.p2body.applyImpulse([e[0],e[1]],[t[0],t[1]])}applyLocalImpulse(e,t=i.a.fromValues(0,0)){this.p2body.applyImpulseLocal([e[0],e[1]],[t[0],t[1]])}applyTorque(e){this.p2body.angularForce+=e}applyAngularMomentum(e){this.p2body.angularVelocity+=this.p2body.invInertia*e}}class u{constructor(){this.p2world=new a.World({gravity:[0,0]})}addRigidBody(e){let t=new p(e);return this.p2world.addBody(t.p2body),t}removeRigidBody(e){this.rigidBodies=this.rigidBodies.filter(t=>t!==e),this.p2world.removeBody(e.p2body)}step(e){this.p2world.step(e)}}const c=self;let d=new class{constructor(){this.physics=new u}update(e){this.physics.step(e)}};setInterval(()=>{d.update(.01)},.01),c.onmessage=function(e){console.log(e.data)}}});
//# sourceMappingURL=acechase_engine.js.map