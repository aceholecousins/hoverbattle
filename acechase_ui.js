!function(e){function t(t){for(var r,s,c=t[0],a=t[1],l=t[2],h=0,d=[];h<c.length;h++)s=c[h],Object.prototype.hasOwnProperty.call(o,s)&&o[s]&&d.push(o[s][0]),o[s]=0;for(r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r]);for(u&&u(t);d.length;)d.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,c=1;c<n.length;c++){var a=n[c];0!==o[a]&&(r=!1)}r&&(i.splice(t--,1),e=s(s.s=n[0]))}return e}var r={},o={2:0},i=[];function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=r,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var c=window.webpackJsonp=window.webpackJsonp||[],a=c.push.bind(c);c.push=t,c=c.slice();for(var l=0;l<c.length;l++)t(c[l]);var u=a;i.push([74,0]),n()}({11:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(1),o=n(3);class i{constructor(e={}){this.position=r.d.fromValues(0,0,0),this.orientation=r.b.fromValues(0,0,0,1),this.scaling=r.d.fromValues(1,1,1),this.kind=e.kind,Object(o.b)(this,e,["position","orientation","scaling"])}}},15:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n(11),o=n(3);class i extends r.a{constructor(e={}){super(e),this.kind="camera",this.nearClip=.1,this.farClip=1e3,this.verticalAngleOfViewInDeg=40,this.onAspectChange=function(e){},Object(o.b)(this,e,["nearClip","farClip","verticalAngleOfViewInDeg"])}}},3:function(e,t,n){"use strict";function r(e,t,n){for(const r of n)e[r]=t[r]}function o(e,t,n){for(const r of n)r in t&&(e[r]=t[r])}n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return o}))},5:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));"undefined"!=typeof window&&window;function r(...e){0}function o(e,t){r(JSON.stringify("function"==typeof t?t():t));let n={};function s(){return"function"==typeof t&&(r(e.remoteOtherIndexCounter,JSON.stringify(t())),e.enqueueMsg({kind:"link",path:t()}),t=e.remoteOtherIndexCounter--),t}function c(){e.enqueueMsg({kind:"del",id:s()}),t=void 0}return new Proxy(Object,{set:(t,n,r)=>(e.enqueueMsg({kind:"set",id:s(),prop:n,val:i(e,r)}),!0),get(r,i,a){if("then"!==i)return"__ref__"===i?s():"dispose"===i?c:(i in n||(n[i]=o(e,function(e,t){return function(){return"function"==typeof e?[...e(),t]:[e,t]}}(t,i))),n[i])},apply:(t,n,c)=>(e.enqueueMsg({kind:"call",id:s(),args:i(e,c)}),r(s(),e.remoteOtherIndexCounter),o(e,e.remoteOtherIndexCounter--)),construct:(t,n)=>(e.enqueueMsg({kind:"new",id:s(),args:i(e,n)}),r(s(),e.remoteOtherIndexCounter),o(e,e.remoteOtherIndexCounter--))})}function i(e,t){switch(typeof t){case"undefined":case"number":case"string":case"boolean":return t;case"object":return function(e,t){let n=Array.isArray(t)?[]:{};for(let r in t){let o=i(e,t[r]);"object"==typeof o&&("__cb__"in o&&(n.__cb__=!0),"__ref__"in o&&(n.__ref__=!0)),n[r]=o}return n}(e,t);case"function":return void 0===t.__ref__?function(e,t){if(void 0===t.__cb__){r(e.localOwnIndexCounter),r();let n=e.localOwnIndexCounter++;return t.__cb__=n,e.localRegistry[n]=t,{__cb__:"new"}}return{__cb__:t.__cb__}}(e,t):{__ref__:t.__ref__}}throw new Error("unsendable type: "+typeof t)}function s(e,t){switch(typeof t){case"undefined":case"number":case"string":case"boolean":return t;case"object":return function(e,t){if("__cb__"in t){if("number"==typeof t.__cb__)return o(e,t.__cb__);if("new"===t.__cb__)return r(e.remoteOwnIndexCounter),o(e,e.remoteOwnIndexCounter++);if(!0===t.__cb__){for(let n in t)t[n]=s(e,t[n]);return t}throw new Error("unexpected callback reference type")}if("__ref__"in t){if("number"==typeof t.__ref__||"string"==typeof t.__ref__)return e.localRegistry[t.__ref__];if(!0===t.__ref__){for(let n in t)t[n]=s(e,t[n]);return t}throw new Error("unexpected reference type")}return t}(e,t)}}function c(e,t){switch(t.kind){case"ready":!function(e){e.connected=!0,e.sendWhenConnected&&e.sendAll()}(e);break;case"reg":!function(e,t){if(e.remoteRegistry.add(t.id),t.id in e.pendingProxies){for(let n of e.pendingProxies[t.id])n();delete e.pendingProxies[t.id]}}(e,t);break;case"link":!function(e,t){let n=e.localRegistry;for(let e of t.path){let t=n[e];"function"==typeof t&&(t=t.bind(n)),n=t}if("object"!=typeof n&&"function"!=typeof n)throw new Error("tried to link a field which is not an object or a method: "+t.path);0;e.localRegistry[e.localOtherIndexCounter--]=n}(e,t);break;case"call":!function(e,t){let n=e.localRegistry[t.id](...s(e,t.args));"object"==typeof n||"function"==typeof n?e.localRegistry[e.localOtherIndexCounter--]=n:(void 0!==n&&console.warn("result of remotely called function will be ignored"),e.localOtherIndexCounter--)}(e,t);break;case"new":!function(e,t){let n=new e.localRegistry[t.id](...s(e,t.args));0;e.localRegistry[e.localOtherIndexCounter--]=n}(e,t);break;case"set":!function(e,t){e.localRegistry[t.id][t.prop]=s(e,t.val)}(e,t);break;case"del":!function(e,t){void 0!==e.localRegistry[t.id].dispose&&e.localRegistry[t.id].dispose();delete e.localRegistry[t.id]}(e,t)}}var a=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{a(r.next(e))}catch(e){i(e)}}function c(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,c)}a((r=r.apply(e,t||[])).next())}))};class l{constructor(e){this.worker=void 0,this.connected=!1,this.sendWhenConnected=!1,this.lastSent=0,this.localRegistry={},this.remoteRegistry=new Set,this.pendingProxies={},this.localOwnIndexCounter=1,this.localOtherIndexCounter=-1,this.remoteOwnIndexCounter=1,this.remoteOtherIndexCounter=-1,this.msgQueue=[],void 0!==e?(this.worker=new Worker(e),this.worker.onmessage=this.receive.bind(this)):(onmessage=this.receive.bind(this),this.enqueueMsg({kind:"ready"}),this.sendAll(),this.connected=!0);let t=this;setInterval((function(){(new Date).getTime()/1e3>t.lastSent+.1&&t.sendAll()}))}enqueueMsg(e){this.msgQueue.push(e)}sendAll(){if(this.lastSent=(new Date).getTime()/1e3,0!=this.msgQueue.length){r();for(let e of this.msgQueue)r(JSON.stringify(e));void 0!==this.worker?this.connected?(this.worker.postMessage(this.msgQueue),this.msgQueue=[]):this.sendWhenConnected=!0:(postMessage(this.msgQueue),this.msgQueue=[])}}receive(e){for(let t in e.data){let n=e.data[t];r(),r(),c(this,n)}}register(e,t){r(),this.localRegistry[t]=e,this.enqueueMsg({kind:"reg",id:t})}createProxy(e){return a(this,void 0,void 0,(function*(){if(!isNaN(e))throw new Error("numeric indices are reserved for anonymous objects");if(e in this.remoteRegistry)return o(this,e);{let t=this;return new Promise((function(n){e in t.pendingProxies||(t.pendingProxies[e]=[]),t.pendingProxies[e].push((function(){n(o(t,e))}))}))}}))}}let u;void 0!==window.document?(console.log("loading engine"),u=new l("./acechase_engine.js")):u=new l},74:function(e,t,n){"use strict";n.r(t);var r=n(5),o=n(1),i=n(0),s=n(55),c=n(15);let a=new i.tb({canvas:document.getElementById("rendertarget")});var l=n(56);class u extends class{}{constructor(){super(...arguments),this.threeObject=void 0}}const h=new l.a;class d{load(e,t,n){let r=new u;return h.load(e,(function(e){r.threeObject=e.scene,function e(t){"material"in t&&"normalMapType"in t.material&&(t.material.normalMapType=i.S);for(let n of t.children)e(n)}(r.threeObject);let n=function(e){let t={};for(let n of e.children)if("_"==n.name[0]){let r=[];n.updateMatrixWorld();let s=n.geometry.toNonIndexed(),c=(new i.n).fromBufferGeometry(s).vertices;for(let e=0;e<c.length;e+=3){let t=n.localToWorld(c[e]),i=o.d.fromValues(t.x,t.y,t.z),s=n.localToWorld(c[e+1]),a=o.d.fromValues(s.x,s.y,t.z),l=n.localToWorld(c[e+2]),u=o.d.fromValues(l.x,l.y,t.z);r.push([i,a,u])}t[n.name.substring(1)]=r,e.remove(n),n.geometry.dispose()}return t}(r.threeObject);void 0!==t&&t(n)}),void 0,n),r}}var f=n(3);class g{constructor(e,t,n){this.threeScene=e,this.threeObject=t,e.add(t),Object(f.a)(this,n,["kind","position","orientation","scaling"])}set position(e){this.threeObject.position.set(e[0],e[1],e[2])}set orientation(e){this.threeObject.quaternion.set(e[0],e[1],e[2],e[3])}set scaling(e){this.threeObject.scale.set(e[0],e[1],e[2])}remove(){this.threeScene.remove(this.threeObject)}}class p extends g{constructor(e,t){let n=new i.V;super(e,n,t),Object(f.a)(this,t,["nearClip","farClip","verticalAngleOfViewInDeg","onAspectChange"]);const r=()=>{let e=a.domElement.clientWidth/a.domElement.clientHeight;n.aspect=e,n.updateProjectionMatrix(),this.onAspectChange(e)};window.addEventListener("resize",r),r()}set nearClip(e){this.threeObject.near=e,this.threeObject.updateProjectionMatrix()}set farClip(e){this.threeObject.far=e,this.threeObject.updateProjectionMatrix()}set verticalAngleOfViewInDeg(e){this.threeObject.fov=e,this.threeObject.updateProjectionMatrix()}set onAspectChange(e){this._onAspectChange=e,e(this.threeObject.aspect)}get onAspectChange(){return this._onAspectChange}activate(){this.threeScene.userData.activeCamera=this.threeObject}}class b{constructor(e){this.threeScene=e}create(e){return new p(this.threeScene,e)}}class y extends g{constructor(e,t){super(e,new i.W,t),this.color=t.color}set color(e){this.threeObject.color.setRGB(e.r,e.g,e.b)}}class w extends g{constructor(e,t){super(e,new i.p,t),this.groundColor=t.groundColor,this.skyColor=t.skyColor}set groundColor(e){this.threeObject.groundColor.setRGB(e.r,e.g,e.b)}set skyColor(e){this.threeObject.color.setRGB(e.r,e.g,e.b)}}class m{constructor(e){this.threeScene=e}createPointLight(e){return new y(this.threeScene,e)}createHemisphereLight(e){return new w(this.threeScene,e)}}class v extends g{constructor(e,t,n){super(e,t.clone(),n),Object(f.a)(this,n,["baseColor","accentColor"])}set baseColor(e){!function e(t,n){"Mesh"==t.type&&t.material.color.setRGB(n.r,n.g,n.b);for(let r of t.children)e(r,n)}(this.threeObject,e)}set accentColor(e){!function e(t,n){if("Mesh"==t.type){let e=t.material.emissive;(e.r>0||e.g>0||e.b>0)&&e.setRGB(n.r,n.g,n.b)}for(let r of t.children)e(r,n)}(this.threeObject,e)}}class _{constructor(e){this.threeScene=e}createFromModel(e){let t=new v(this.threeScene,e.asset.threeObject.clone(),e);return function e(t,n){"Mesh"==t.type&&(t.material=n.material.clone());for(let r in t.children)e(t.children[r],n.children[r])}(t.threeObject,e.asset.threeObject),t}}class C{constructor(e){this.graphics=e;const t=()=>{a.setSize(a.domElement.clientWidth,a.domElement.clientHeight,!1)};window.addEventListener("resize",t),t()}setSceneOrientation(e){this.graphics.scene.quaternion.set(e[0],e[1],e[2],e[3])}setEnvironment(e){this.graphics.scene.background=e.threeCubemap,this.graphics.scene.environment=e.threePmrem}update(e){a.render(this.graphics.scene,this.graphics.scene.userData.activeCamera)}}class O extends class{}{constructor(){super(...arguments),this.threeCubemap=void 0,this.threePmrem=void 0}}const x=new i.h,j=new i.U(a);j.compileCubemapShader();class k{load(e,t,n){let r=new O;return x.load([e.replace("*","px"),e.replace("*","nx"),e.replace("*","py"),e.replace("*","ny"),e.replace("*","pz"),e.replace("*","nz")],(function(e){let n=j.fromCubemap(e);r.threeCubemap=e,r.threePmrem=n.texture,t()}),void 0,n),r}}var S;!function(e){e.UP="KeyW",e.DOWN="KeyS",e.RIGHT="KeyD",e.LEFT="KeyA",e.SHOOT="Space",e.PAUSE="Pause",e.SWITCH_MODE="KeyM"}(S||(S={}));class R{constructor(){this.shooting=!1,this.currentStrategy=new A,document.addEventListener("keydown",e=>{this.onKeyAction(e,!0)}),document.addEventListener("keyup",e=>{this.onKeyAction(e,!1)})}getAbsoluteDirection(){return this.currentStrategy.getAbsoluteDirection()}getTurnRate(){return this.currentStrategy.getTurnRate()}getThrust(){return this.currentStrategy.getThrust()}isShooting(){return this.shooting}setPauseCallback(e){throw new Error("Method not implemented.")}onKeyAction(e,t){e.repeat||(this.onGeneralKeyAction(e.code,t),this.currentStrategy.onKeyAction(e.code,t))}onGeneralKeyAction(e,t){switch(e){case S.SHOOT:this.shooting=t;break;case S.SWITCH_MODE:t&&this.switchStrategy()}}switchStrategy(){this.currentStrategy instanceof A?(console.log("Switch to absolute keyboard"),this.currentStrategy=new M):(console.log("Switch to relative keyboard"),this.currentStrategy=new A)}}class A{constructor(){this.turnRate=0,this.thrust=0,this.valueLeft=0,this.valueRight=0}getAbsoluteDirection(){}getTurnRate(){return this.turnRate}getThrust(){return this.thrust}onKeyAction(e,t){e==S.UP&&(this.thrust=t?1:0),e==S.LEFT&&(this.valueLeft=t?1:0),e==S.RIGHT&&(this.valueRight=t?1:0),this.turnRate=this.valueLeft-this.valueRight}}class M{constructor(){this.absoluteDirection=void 0,this.thrust=0,this.valueUp=0,this.valueDown=0,this.valueLeft=0,this.valueRight=0}getAbsoluteDirection(){return this.absoluteDirection}getTurnRate(){}getThrust(){return this.thrust}onKeyAction(e,t){switch(e){case S.UP:this.valueUp=t?1:0;break;case S.DOWN:this.valueDown=t?1:0;break;case S.RIGHT:this.valueRight=t?1:0;break;case S.LEFT:this.valueLeft=t?1:0}let n=this.valueRight-this.valueLeft,r=this.valueUp-this.valueDown;this.absoluteDirection=0!=n||0!=r?Math.atan2(r,n):void 0,this.thrust=0!=n||0!=r?1:0}}var P=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{a(r.next(e))}catch(e){i(e)}}function c(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,c)}a((r=r.apply(e,t||[])).next())}))};class T{constructor(e,t){this.controller=e,this.initProxy(t)}initProxy(e){return P(this,void 0,void 0,(function*(){try{this.controllerBridge=yield r.a.createProxy(e)}catch(t){console.error("Failed to create ControllerBridge proxy for key "+e+". Reason: "+t)}}))}update(){void 0!==this.controllerBridge&&(this.controllerBridge.setAbsoluteDirection(this.controller.getAbsoluteDirection()),this.controllerBridge.setTurnRate(this.controller.getTurnRate()),this.controllerBridge.setThrust(this.controller.getThrust()),this.controllerBridge.setShooting(this.controller.isShooting()))}}var I=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function s(e){try{a(r.next(e))}catch(e){i(e)}}function c(e){try{a(r.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,c)}a((r=r.apply(e,t||[])).next())}))};let D=new class{constructor(){this.scene=new i.fb,window.scene=this.scene,this.model=new d,this.skybox=new k,this.camera=new b(this.scene),this.light=new m(this.scene),this.mesh=new _(this.scene);let e=this.camera.create(new c.a);e.position=o.d.fromValues(0,0,10),e.activate(),e.threeObject.up.set(0,0,1),this.scene.add(e.threeObject);new s.a(e.threeObject,a.domElement).screenSpacePanning=!0,this.control=new C(this)}};var E;E=D,r.a.register(E,"graphicsServer");let B=new class{constructor(e,t){this.newControllerCounter=0,this.controllerMap=new Map,e.addConnectionCallback(this.controllerAdded.bind(this)),this.initProxy(t)}initProxy(e){return I(this,void 0,void 0,(function*(){try{this.controllerManagerBridge=yield r.a.createProxy(e),this.publishAllControllers()}catch(t){console.error("Failed to create ControllerManagerBridge proxy for key "+e+". Reason: "+t)}}))}publishAllControllers(){for(const e of this.controllerMap.keys())this.controllerManagerBridge.controllerAdded(e)}controllerAdded(e){let t=this.createRandomBridgeKey();this.controllerMap.set(t,new T(e,t)),void 0!==this.controllerManagerBridge&&this.controllerManagerBridge.controllerAdded(t)}createRandomBridgeKey(){return"controller"+ ++this.newControllerCounter}update(){for(const e of this.controllerMap.values())e.update()}}(new class{constructor(){this.connectedControllers=new Set,this.connectionCallbacks=new Set,this.initKeyboard()}addConnectionCallback(e){this.connectionCallbacks.add(e);for(const t of this.connectedControllers)e(t)}removeConnectionCallback(e){this.connectionCallbacks.delete(e)}initKeyboard(){this.addController(new R)}addController(e){this.connectedControllers.add(e);for(const t of this.connectionCallbacks)t(e)}},"controllerManager");requestAnimationFrame((function e(t){requestAnimationFrame(e),D.control.update(t),B.update(),r.a.sendAll()}))}});
//# sourceMappingURL=acechase_ui.js.map