!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=24)}([,,,function(e,t){
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e,t,n){var o=e.__flags||(e.__flags=Object.create(null));if(3!==arguments.length)return o[t];o[t]=n}},function(e,t,n){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=[];
/*!
 * Chai version
 */t.version="4.2.0",
/*!
 * Assertion Error
 */
t.AssertionError=n(13);
/*!
 * Utils for plugins (not exported)
 */
var r=n(25);t.use=function(e){return~o.indexOf(e)||(e(t,r),o.push(e)),t},
/*!
 * Utility Functions
 */
t.util=r;
/*!
 * Configuration
 */
var i=n(6);t.config=i;
/*!
 * Primary `Assertion` prototype
 */
var s=n(43);t.use(s);
/*!
 * Core Assertions
 */
var a=n(44);t.use(a);
/*!
 * Expect interface
 */
var c=n(45);t.use(c);
/*!
 * Should interface
 */
var u=n(46);t.use(u);
/*!
 * Assert interface
 */
var l=n(47);t.use(l)},function(e,t){
/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e,t,n){var o=e.__flags||(e.__flags=Object.create(null));for(var r in t.__flags||(t.__flags=Object.create(null)),n=3!==arguments.length||n,o)(n||"object"!==r&&"ssfi"!==r&&"lockSsfi"!==r&&"message"!=r)&&(t.__flags[r]=o[r])}},function(e,t){e.exports={includeStack:!1,showDiff:!0,truncateThreshold:40,useProxy:!0,proxyExcludedKeys:["then","catch","inspect","toJSON"]}},function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));class o{constructor(e,t){this.worker=void 0,this.onReady=void 0,this.objectRegistry={},this.localIndexCounter=0,this.remoteIndexCounter=0,this.msgQueue=[],void 0!==e?(this.worker=new Worker(e),this.worker.onmessage=this.receive.bind(this),this.onReady=t):(onmessage=this.receive.bind(this),this.enqueueMsg({kind:"ready"}),this.sendAll())}enqueueMsg(e){this.msgQueue.push(e)}sendAll(){if(void 0!==this.worker){console.log("window -> worker:");for(let e of this.msgQueue)console.log("-> "+JSON.stringify(e));this.worker.postMessage(this.msgQueue)}else{console.log("worker -> window:");for(let e of this.msgQueue)console.log("-> "+JSON.stringify(e));postMessage(this.msgQueue)}this.msgQueue=[]}handleLinkage(e){let t=this.objectRegistry;for(let n of e.path)t=t[n];if("object"!=typeof t&&"function"!=typeof t)throw new Error("tried to link a field which is not an object or a method: "+e.path);this.objectRegistry[this.localIndexCounter++]=t}handleCall(e){let t=this.objectRegistry[e.id](...this.resolveReferences(e.args));"object"==typeof t||"function"==typeof t?this.objectRegistry[this.localIndexCounter++]=t:(void 0!==t&&console.warn("result of remotely called function will be ignored"),this.localIndexCounter++)}handleNew(e){let t=new this.objectRegistry[e.id](...this.resolveReferences(e.args));this.objectRegistry[this.localIndexCounter++]=t}handlePropertySet(e){this.objectRegistry[e.id][e.prop]=this.resolveReferences(e.val)}handleDispose(e){void 0!==this.objectRegistry[e.id].dispose&&this.objectRegistry[e.id].dispose(),delete this.objectRegistry[e.id]}receive(e){for(let t in e.data){let n=e.data[t];switch(n.kind){case"ready":void 0!==this.onReady&&this.onReady();break;case"link":this.handleLinkage(n);break;case"call":this.handleCall(n);break;case"new":this.handleNew(n);break;case"set":this.handlePropertySet(n);break;case"del":this.handleDispose(n)}}}register(e,t){this.objectRegistry[t]=e}createProxy(e){if(!isNaN(e))throw new Error("numeric indices are reserved for anonymous objects");return this._createProxy(e)}_createProxy(e){let t={},n=this;function o(){return"function"==typeof e&&(n.enqueueMsg({kind:"link",path:e()}),e=n.remoteIndexCounter++),e}function r(){n.enqueueMsg({kind:"del",id:o()}),e=void 0}return new Proxy(Object,{set:(e,t,r)=>(n.enqueueMsg({kind:"set",id:o(),prop:t,val:n.referencifyObject(r)}),!0),get:(i,s,a)=>"__ref__"===s?o():"dispose"===s?r:(s in t||(t[s]=n._createProxy(function(e,t){return function(){return"function"==typeof e?[...e(),t]:[e,t]}}(e,s))),t[s]),apply:(e,t,r)=>(n.enqueueMsg({kind:"call",id:o(),args:n.referencifyObject(r)}),n._createProxy(n.remoteIndexCounter++)),construct:(e,t)=>(n.enqueueMsg({kind:"new",id:o(),args:n.referencifyObject(t)}),n._createProxy(n.remoteIndexCounter++))})}referencifyFunction(e){if(void 0===e.__cb__){let t=this.localIndexCounter++;return e.__cb__=t,this.objectRegistry[t]=e,{__cb__:"new"}}return{__cb__:e.__cb__}}referencifyChildren(e){let t=Array.isArray(e)?[]:{};for(let n in e){let o=this.referencifyObject(e[n]);"object"==typeof o&&("__cb__"in o&&(t.__cb__=!0),"__ref__"in o&&(t.__ref__=!0)),t[n]=o}return t}referencifyObject(e){switch(typeof e){case"number":case"string":case"boolean":return e;case"object":return this.referencifyChildren(e);case"function":return void 0===e.__ref__?this.referencifyFunction(e):{__ref__:e.__ref__}}throw new Error("unsendable type: "+typeof e)}resolveReferenceMembers(e){if("__cb__"in e){if("number"==typeof e.__cb__)return this._createProxy(e.__cb__);if("new"===e.__cb__)return this._createProxy(this.remoteIndexCounter++);if(!0===e.__cb__){for(let t in e)e[t]=this.resolveReferences(e[t]);return e}throw new Error("unexpected callback reference type")}if("__ref__"in e){if("number"==typeof e.__ref__||"string"==typeof e.__ref__)return this.objectRegistry[e.__ref__];if(!0===e.__ref__){for(let t in e)e[t]=this.resolveReferences(e[t]);return e}throw new Error("unexpected reference type")}return e}resolveReferences(e){switch(typeof e){case"number":case"string":case"boolean":return e;case"object":return this.resolveReferenceMembers(e)}}}},function(e,t,n){var o=n(6);
/*!
 * Chai - isProxyEnabled helper
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */e.exports=function(){return o.useProxy&&"undefined"!=typeof Proxy&&"undefined"!=typeof Reflect}},function(e,t){var n=Object.getOwnPropertyDescriptor((function(){}),"length");
/*!
 * Chai - addLengthGuard utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */e.exports=function(e,t,o){return n.configurable?(Object.defineProperty(e,"length",{get:function(){if(o)throw Error("Invalid Chai property: "+t+'.length. Due to a compatibility issue, "length" cannot directly follow "'+t+'". Use "'+t+'.lengthOf" instead.');throw Error("Invalid Chai property: "+t+'.length. See docs for proper usage of "'+t+'".')}}),e):e}},function(e,t,n){var o=n(6),r=n(3),i=n(17),s=n(8),a=["__flags","__methods","_obj","assert"];e.exports=function(e,t){return s()?new Proxy(e,{get:function e(n,s){if("string"==typeof s&&-1===o.proxyExcludedKeys.indexOf(s)&&!Reflect.has(n,s)){if(t)throw Error("Invalid Chai property: "+t+"."+s+'. See docs for proper usage of "'+t+'".');var c=null,u=4;throw i(n).forEach((function(e){if(!Object.prototype.hasOwnProperty(e)&&-1===a.indexOf(e)){var t=function(e,t,n){if(Math.abs(e.length-t.length)>=n)return n;for(var o=[],r=0;r<=e.length;r++)o[r]=Array(t.length+1).fill(0),o[r][0]=r;for(var i=0;i<t.length;i++)o[0][i]=i;for(r=1;r<=e.length;r++){var s=e.charCodeAt(r-1);for(i=1;i<=t.length;i++)Math.abs(r-i)>=n?o[r][i]=n:o[r][i]=Math.min(o[r-1][i]+1,o[r][i-1]+1,o[r-1][i-1]+(s===t.charCodeAt(i-1)?0:1))}return o[e.length][t.length]}(s,e,u);t<u&&(c=e,u=t)}})),null!==c?Error("Invalid Chai property: "+s+'. Did you mean "'+c+'"?'):Error("Invalid Chai property: "+s)}return-1!==a.indexOf(s)||r(n,"lockSsfi")||r(n,"ssfi",e),Reflect.get(n,s)}}):e}},function(e,t,n){(function(t){var n;n=function(){"use strict";var e="function"==typeof Promise,n="object"==typeof self?self:t,o="undefined"!=typeof Symbol,r="undefined"!=typeof Map,i="undefined"!=typeof Set,s="undefined"!=typeof WeakMap,a="undefined"!=typeof WeakSet,c="undefined"!=typeof DataView,u=o&&void 0!==Symbol.iterator,l=o&&void 0!==Symbol.toStringTag,f=i&&"function"==typeof Set.prototype.entries,h=r&&"function"==typeof Map.prototype.entries,d=f&&Object.getPrototypeOf((new Set).entries()),p=h&&Object.getPrototypeOf((new Map).entries()),y=u&&"function"==typeof Array.prototype[Symbol.iterator],b=y&&Object.getPrototypeOf([][Symbol.iterator]()),g=u&&"function"==typeof String.prototype[Symbol.iterator],w=g&&Object.getPrototypeOf(""[Symbol.iterator]());return function(t){var o=typeof t;if("object"!==o)return o;if(null===t)return"null";if(t===n)return"global";if(Array.isArray(t)&&(!1===l||!(Symbol.toStringTag in t)))return"Array";if("object"==typeof window&&null!==window){if("object"==typeof window.location&&t===window.location)return"Location";if("object"==typeof window.document&&t===window.document)return"Document";if("object"==typeof window.navigator){if("object"==typeof window.navigator.mimeTypes&&t===window.navigator.mimeTypes)return"MimeTypeArray";if("object"==typeof window.navigator.plugins&&t===window.navigator.plugins)return"PluginArray"}if(("function"==typeof window.HTMLElement||"object"==typeof window.HTMLElement)&&t instanceof window.HTMLElement){if("BLOCKQUOTE"===t.tagName)return"HTMLQuoteElement";if("TD"===t.tagName)return"HTMLTableDataCellElement";if("TH"===t.tagName)return"HTMLTableHeaderCellElement"}}var u=l&&t[Symbol.toStringTag];if("string"==typeof u)return u;var f=Object.getPrototypeOf(t);return f===RegExp.prototype?"RegExp":f===Date.prototype?"Date":e&&f===Promise.prototype?"Promise":i&&f===Set.prototype?"Set":r&&f===Map.prototype?"Map":a&&f===WeakSet.prototype?"WeakSet":s&&f===WeakMap.prototype?"WeakMap":c&&f===DataView.prototype?"DataView":r&&f===p?"Map Iterator":i&&f===d?"Set Iterator":y&&f===b?"Array Iterator":g&&f===w?"String Iterator":null===f?"Object":Object.prototype.toString.call(t).slice(8,-1)}},e.exports=n()}).call(this,n(28))},function(e,t,n){var o=n(16),r=n(17),i=n(31),s=n(6);e.exports=function(e,t,n,o){return a({showHidden:t,seen:[],stylize:function(e){return e}},e,void 0===n?2:n)};function a(e,n,p){if(n&&"function"==typeof n.inspect&&n.inspect!==t.inspect&&(!n.constructor||n.constructor.prototype!==n)){var y=n.inspect(p,e);return"string"!=typeof y&&(y=a(e,y,p)),y}var b,g=function(e,t){switch(typeof t){case"undefined":return e.stylize("undefined","undefined");case"string":var n="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(n,"string");case"number":return 0===t&&1/t==-1/0?e.stylize("-0","number"):e.stylize(""+t,"number");case"boolean":return e.stylize(""+t,"boolean");case"symbol":return e.stylize(t.toString(),"symbol")}if(null===t)return e.stylize("null","null")}(e,n);if(g)return g;if(b=n,"object"==typeof HTMLElement?b instanceof HTMLElement:b&&"object"==typeof b&&"nodeType"in b&&1===b.nodeType&&"string"==typeof b.nodeName){if("outerHTML"in n)return n.outerHTML;try{if(document.xmlVersion)return(new XMLSerializer).serializeToString(n);var w=document.createElementNS("http://www.w3.org/1999/xhtml","_");w.appendChild(n.cloneNode(!1));var m=w.innerHTML.replace("><",">"+n.innerHTML+"<");return w.innerHTML="",m}catch(e){}}var v,x,j=i(n),O=e.showHidden?r(n):j;if(0===O.length||h(n)&&(1===O.length&&"stack"===O[0]||2===O.length&&"description"===O[0]&&"stack"===O[1])){if("function"==typeof n)return x=(v=o(n))?": "+v:"",e.stylize("[Function"+x+"]","special");if(l(n))return e.stylize(RegExp.prototype.toString.call(n),"regexp");if(f(n))return e.stylize(Date.prototype.toUTCString.call(n),"date");if(h(n))return c(n)}var M,_,k="",N=!1,P=!1,S=["{","}"];if("object"==typeof(M=n)&&/\w+Array]$/.test(d(M))&&(P=!0,S=["[","]"]),function(e){return Array.isArray(e)||"object"==typeof e&&"[object Array]"===d(e)}(n)&&(N=!0,S=["[","]"]),"function"==typeof n&&(k=" [Function"+(x=(v=o(n))?": "+v:"")+"]"),l(n)&&(k=" "+RegExp.prototype.toString.call(n)),f(n)&&(k=" "+Date.prototype.toUTCString.call(n)),h(n))return c(n);if(0===O.length&&(!N||0==n.length))return S[0]+k+S[1];if(p<0)return l(n)?e.stylize(RegExp.prototype.toString.call(n),"regexp"):e.stylize("[Object]","special");if(e.seen.push(n),N)_=function(e,t,n,o,r){for(var i=[],s=0,a=t.length;s<a;++s)Object.prototype.hasOwnProperty.call(t,String(s))?i.push(u(e,t,n,o,String(s),!0)):i.push("");return r.forEach((function(r){r.match(/^\d+$/)||i.push(u(e,t,n,o,r,!0))})),i}(e,n,p,j,O);else{if(P)return function(e){for(var t="[ ",n=0;n<e.length;++n){if(t.length>=s.truncateThreshold-7){t+="...";break}t+=e[n]+", "}-1!==(t+=" ]").indexOf(",  ]")&&(t=t.replace(",  ]"," ]"));return t}(n);_=O.map((function(t){return u(e,n,p,j,t,N)}))}return e.seen.pop(),function(e,t,n){if(e.reduce((function(e,t){return e+t.length+1}),0)>60)return n[0]+(""===t?"":t+"\n ")+" "+e.join(",\n  ")+" "+n[1];return n[0]+t+" "+e.join(", ")+" "+n[1]}(_,k,S)}function c(e){return"["+Error.prototype.toString.call(e)+"]"}function u(e,t,n,o,r,i){var s,c,u=Object.getOwnPropertyDescriptor(t,r);if(u&&(u.get?c=u.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):u.set&&(c=e.stylize("[Setter]","special"))),o.indexOf(r)<0&&(s="["+r+"]"),c||(e.seen.indexOf(t[r])<0?(c=a(e,t[r],null===n?null:n-1)).indexOf("\n")>-1&&(c=i?c.split("\n").map((function(e){return"  "+e})).join("\n").substr(2):"\n"+c.split("\n").map((function(e){return"   "+e})).join("\n")):c=e.stylize("[Circular]","special")),void 0===s){if(i&&r.match(/^\d+$/))return c;(s=JSON.stringify(""+r)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+c}function l(e){return"object"==typeof e&&"[object RegExp]"===d(e)}function f(e){return"object"==typeof e&&"[object Date]"===d(e)}function h(e){return"object"==typeof e&&"[object Error]"===d(e)}function d(e){return Object.prototype.toString.call(e)}},function(e,t){
/*!
 * assertion-error
 * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
 * MIT Licensed
 */
/*!
 * Return a function that will copy properties from
 * one object to another excluding any originally
 * listed. Returned function will create a new `{}`.
 *
 * @param {String} excluded properties ...
 * @return {Function}
 */
function n(){var e=[].slice.call(arguments);function t(t,n){Object.keys(n).forEach((function(o){~e.indexOf(o)||(t[o]=n[o])}))}return function(){for(var e=[].slice.call(arguments),n=0,o={};n<e.length;n++)t(o,e[n]);return o}}function o(e,t,r){var i=n("name","message","stack","constructor","toJSON")(t||{});for(var s in this.message=e||"Unspecified AssertionError",this.showDiff=!1,i)this[s]=i[s];if(r=r||o,Error.captureStackTrace)Error.captureStackTrace(this,r);else try{throw new Error}catch(e){this.stack=e.stack}}
/*!
 * Inherit from Error.prototype
 */
/*!
 * Primary Exports
 */
e.exports=o,o.prototype=Object.create(Error.prototype),
/*!
 * Statically set name
 */
o.prototype.name="AssertionError",
/*!
 * Ensure correct constructor
 */
o.prototype.constructor=o,o.prototype.toJSON=function(e){var t=n("constructor","toJSON","stack")({name:this.name},this);return!1!==e&&this.stack&&(t.stack=this.stack),t}},function(e,t){
/*!
 * Chai - getActual utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e,t){return t.length>4?t[4]:e._obj}},function(e,t,n){
/*!
 * Chai - flag utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Module dependencies
 */
var o=n(12),r=n(6);e.exports=function(e){var t=o(e),n=Object.prototype.toString.call(e);if(r.truncateThreshold&&t.length>=r.truncateThreshold){if("[object Function]"===n)return e.name&&""!==e.name?"[Function: "+e.name+"]":"[Function]";if("[object Array]"===n)return"[ Array("+e.length+") ]";if("[object Object]"===n){var i=Object.keys(e);return"{ Object ("+(i.length>2?i.splice(0,2).join(", ")+", ...":i.join(", "))+") }"}return t}return t}},function(e,t,n){"use strict";var o=Function.prototype.toString,r=/\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;e.exports=function(e){if("function"!=typeof e)return null;var t="";if(void 0===Function.prototype.name&&void 0===e.name){var n=o.call(e).match(r);n&&(t=n[1])}else t=e.name;return t}},function(e,t){
/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e){var t=Object.getOwnPropertyNames(e);function n(e){-1===t.indexOf(e)&&t.push(e)}for(var o=Object.getPrototypeOf(e);null!==o;)Object.getOwnPropertyNames(o).forEach(n),o=Object.getPrototypeOf(o);return t}},function(e,t){
/*!
 * Chai - getOwnEnumerablePropertySymbols utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e){return"function"!=typeof Object.getOwnPropertySymbols?[]:Object.getOwnPropertySymbols(e).filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))}},function(e,t,n){e.exports=n(4)},,,,,function(e,t,n){"use strict";n.r(t);var o=n(7),r=n(19);let i=new o.a;console.log("----------------------------"),console.log('let myObj = bridge.createProxy("myObj") as any');let s=i.createProxy("myObj");console.log('myObj now contains a proxy to the remote object registry["myObj"]'),i.sendAll(),console.log("(nothing is sent)"),console.log("----------------------------"),console.log("myObj.property = 5"),s.property=5,i.sendAll(),console.log("----------------------------"),console.log("let toe = myObj.body.leg.foot.toe");let a=s.body.leg.foot.toe;i.sendAll(),console.log("(does not send anything, only creates a new proxy that knows its relation to myObj)"),console.log("----------------------------"),console.log('toe.nail = "short"'),a.nail="short",i.sendAll(),console.log('Now toe gets linked to myObj.body.leg.foot.toe on the remote side.\nBoth sides increase an index counter, the proxy stores the index\nand the remote side creates\nregistry[index] = registry["myObj"].body.leg.foot.toe\nThen we send a message changing registry[index]'),console.log("----------------------------"),console.log('myObj.body.leg.foot.toe.nail = "crazy short"'),s.body.leg.foot.toe.nail="crazy short",i.sendAll(),console.log("as the toe is already linked, only a set message is sent"),console.log("----------------------------"),console.log("let myResult = myObj.method(1, 2, 3)");s.method(1,2,3);function c(e){console.log("----------------------------"),console.log("inside callback:"),console.log("console.log(sound)"),console.log(e),console.log("----------------------------")}i.sendAll(),console.log('remote and local index counter are increased,\nthe local side gets a new proxy with the index, remote side does:\nregistry[index] = registry["myObj"].method(1, 2, 3)'),console.log("----------------------------"),console.log("function ring(sound:string){console.log(sound)}"),console.log("myObj.callMeBack(ring)"),s.callMeBack(c),i.sendAll(),console.log('Each time "call" or "set" are used, the argument\nis scanned for functions, they are stored locally (with a new local index)\nand the remote side receives a proxy.\n{__cb__:"new"} means a new callback (gets a new index)\n{__cb__:27} means that the already known callback with index 27 is used\n{__cb__:true, ...} means that this object has callbacks somewhere nested in it'),console.log("----------------------------"),console.log('myObj.useNestedCallback({child:{age:13, cb:ring}, misc:"0815"})'),s.useNestedCallback({child:{age:13,cb:c},misc:"0815"}),i.sendAll(),console.log("----------------------------"),console.log("myObj.sayTheName(myObj)"),s.sayTheName(s),i.sendAll(),console.log("proxy objects as arguments are resolved"),console.log("----------------------------"),setTimeout((function(){console.log("myObj.dispose()"),s.dispose(),i.sendAll(),Object(r.assert)(void 0===s.__ref__)}),500),console.log("----------------------------"),setTimeout((function(){new(i.createProxy("MyClass"))(3,5).toot(),i.sendAll()}),1e3)},function(e,t,n){
/*!
 * chai
 * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Dependencies that are used for multiple exports are required here only once
 */
var o=n(26);
/*!
 * test utility
 */t.test=n(27),
/*!
 * type utility
 */
t.type=n(11),
/*!
 * expectTypes utility
 */
t.expectTypes=n(29),
/*!
 * message utility
 */
t.getMessage=n(30),
/*!
 * actual utility
 */
t.getActual=n(14),
/*!
 * Inspect util
 */
t.inspect=n(12),
/*!
 * Object Display util
 */
t.objDisplay=n(15),
/*!
 * Flag utility
 */
t.flag=n(3),
/*!
 * Flag transferring utility
 */
t.transferFlags=n(5),
/*!
 * Deep equal utility
 */
t.eql=n(32),
/*!
 * Deep path info
 */
t.getPathInfo=o.getPathInfo,
/*!
 * Check if a property exists
 */
t.hasProperty=o.hasProperty,
/*!
 * Function name
 */
t.getName=n(16),
/*!
 * add Property
 */
t.addProperty=n(33),
/*!
 * add Method
 */
t.addMethod=n(34),
/*!
 * overwrite Property
 */
t.overwriteProperty=n(35),
/*!
 * overwrite Method
 */
t.overwriteMethod=n(36),
/*!
 * Add a chainable method
 */
t.addChainableMethod=n(37),
/*!
 * Overwrite chainable method
 */
t.overwriteChainableMethod=n(38),
/*!
 * Compare by inspect method
 */
t.compareByInspect=n(39),
/*!
 * Get own enumerable property symbols method
 */
t.getOwnEnumerablePropertySymbols=n(18),
/*!
 * Get own enumerable properties method
 */
t.getOwnEnumerableProperties=n(40),
/*!
 * Checks error against a given set of criteria
 */
t.checkError=n(41),
/*!
 * Proxify util
 */
t.proxify=n(10),
/*!
 * addLengthGuard util
 */
t.addLengthGuard=n(9),
/*!
 * isProxyEnabled helper
 */
t.isProxyEnabled=n(8),
/*!
 * isNaN method
 */
t.isNaN=n(42)},function(e,t,n){"use strict";function o(e,t){return null!=e&&t in Object(e)}function r(e){return e.replace(/([^\\])\[/g,"$1.[").match(/(\\\.|[^.]+?)+/g).map((function(e){var t=/^\[(\d+)\]$/.exec(e);return t?{i:parseFloat(t[1])}:{p:e.replace(/\\([.\[\]])/g,"$1")}}))}function i(e,t,n){var o=e,r=null;n=void 0===n?t.length:n;for(var i=0;i<n;i++){var s=t[i];o&&(o=void 0===s.p?o[s.i]:o[s.p],i===n-1&&(r=o))}return r}function s(e,t){var n=r(t),s=n[n.length-1],a={parent:n.length>1?i(e,n,n.length-1):e,name:s.p||s.i,value:i(e,n)};return a.exists=o(a.parent,a.name),a}e.exports={hasProperty:o,getPathInfo:s,getPathValue:function(e,t){return s(e,t).value},setPathValue:function(e,t,n){return function(e,t,n){for(var o=e,r=n.length,i=null,s=0;s<r;s++){var a=null,c=null;if(i=n[s],s===r-1)o[a=void 0===i.p?i.i:i.p]=t;else if(void 0!==i.p&&o[i.p])o=o[i.p];else if(void 0!==i.i&&o[i.i])o=o[i.i];else{var u=n[s+1];a=void 0===i.p?i.i:i.p,c=void 0===u.p?[]:{},o[a]=c,o=o[a]}}}(e,n,r(t)),e}}},function(e,t,n){
/*!
 * Chai - test utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Module dependencies
 */
var o=n(3);e.exports=function(e,t){var n=o(e,"negate"),r=t[0];return n?!r:r}},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){
/*!
 * Chai - expectTypes utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=n(13),r=n(3),i=n(11);e.exports=function(e,t){var n=r(e,"message"),s=r(e,"ssfi");n=n?n+": ":"",e=r(e,"object"),(t=t.map((function(e){return e.toLowerCase()}))).sort();var a=t.map((function(e,n){var o=~["a","e","i","o","u"].indexOf(e.charAt(0))?"an":"a";return(t.length>1&&n===t.length-1?"or ":"")+o+" "+e})).join(", "),c=i(e).toLowerCase();if(!t.some((function(e){return c===e})))throw new o(n+"object tested must be "+a+", but "+c+" given",void 0,s)}},function(e,t,n){
/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Module dependencies
 */
var o=n(3),r=n(14),i=n(15);e.exports=function(e,t){var n=o(e,"negate"),s=o(e,"object"),a=t[3],c=r(e,t),u=n?t[2]:t[1],l=o(e,"message");return"function"==typeof u&&(u=u()),u=(u=u||"").replace(/#\{this\}/g,(function(){return i(s)})).replace(/#\{act\}/g,(function(){return i(c)})).replace(/#\{exp\}/g,(function(){return i(a)})),l?l+": "+u:u}},function(e,t){
/*!
 * Chai - getEnumerableProperties utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e){var t=[];for(var n in e)t.push(n);return t}},function(e,t,n){"use strict";
/*!
 * deep-eql
 * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */var o=n(11);function r(){this._key="chai/deep-eql__"+Math.random()+Date.now()}r.prototype={get:function(e){return e[this._key]},set:function(e,t){Object.isExtensible(e)&&Object.defineProperty(e,this._key,{value:t,configurable:!0})}};var i="function"==typeof WeakMap?WeakMap:r;
/*!
 * Check to see if the MemoizeMap has recorded a result of the two operands
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {MemoizeMap} memoizeMap
 * @returns {Boolean|null} result
*/function s(e,t,n){if(!n||b(e)||b(t))return null;var o=n.get(e);if(o){var r=o.get(t);if("boolean"==typeof r)return r}return null}
/*!
 * Set the result of the equality into the MemoizeMap
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {MemoizeMap} memoizeMap
 * @param {Boolean} result
*/function a(e,t,n,o){if(n&&!b(e)&&!b(t)){var r=n.get(e);r?r.set(t,o):((r=new i).set(t,o),n.set(e,r))}}
/*!
 * Primary Export
 */function c(e,t,n){if(n&&n.comparator)return l(e,t,n);var o=u(e,t);return null!==o?o:l(e,t,n)}function u(e,t){return e===t?0!==e||1/e==1/t:e!=e&&t!=t||!b(e)&&!b(t)&&null}
/*!
 * The main logic of the `deepEqual` function.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Object} [options] (optional) Additional options
 * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
 * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
    complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
    references to blow the stack.
 * @return {Boolean} equal match
*/function l(e,t,n){(n=n||{}).memoize=!1!==n.memoize&&(n.memoize||new i);var r=n&&n.comparator,l=s(e,t,n.memoize);if(null!==l)return l;var b=s(t,e,n.memoize);if(null!==b)return b;if(r){var g=r(e,t);if(!1===g||!0===g)return a(e,t,n.memoize,g),g;var w=u(e,t);if(null!==w)return w}var m=o(e);if(m!==o(t))return a(e,t,n.memoize,!1),!1;a(e,t,n.memoize,!0);var v=function(e,t,n,o){switch(n){case"String":case"Number":case"Boolean":case"Date":return c(e.valueOf(),t.valueOf());case"Promise":case"Symbol":case"function":case"WeakMap":case"WeakSet":case"Error":return e===t;case"Arguments":case"Int8Array":case"Uint8Array":case"Uint8ClampedArray":case"Int16Array":case"Uint16Array":case"Int32Array":case"Uint32Array":case"Float32Array":case"Float64Array":case"Array":return h(e,t,o);case"RegExp":
/*!
 * Compare two Regular Expressions for equality.
 *
 * @param {RegExp} leftHandOperand
 * @param {RegExp} rightHandOperand
 * @return {Boolean} result
 */
return function(e,t){return e.toString()===t.toString()}
/*!
 * Compare two Sets/Maps for equality. Faster than other equality functions.
 *
 * @param {Set} leftHandOperand
 * @param {Set} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */(e,t);case"Generator":
/*!
 * Simple equality for generator objects such as those returned by generator functions.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
return function(e,t,n){return h(p(e),p(t),n)}
/*!
 * Determine if the given object has an @@iterator function.
 *
 * @param {Object} target
 * @return {Boolean} `true` if the object has an @@iterator function.
 */(e,t,o);case"DataView":return h(new Uint8Array(e.buffer),new Uint8Array(t.buffer),o);case"ArrayBuffer":return h(new Uint8Array(e),new Uint8Array(t),o);case"Set":case"Map":return f(e,t,o);default:
/*!
 * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
 * for each enumerable key in the object.
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
return function(e,t,n){var o=y(e),r=y(t);if(o.length&&o.length===r.length)return o.sort(),r.sort(),!1!==h(o,r)&&
/*!
 * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
 * each key. If any value of the given key is not equal, the function will return false (early).
 *
 * @param {Mixed} leftHandOperand
 * @param {Mixed} rightHandOperand
 * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */
function(e,t,n,o){var r=n.length;if(0===r)return!0;for(var i=0;i<r;i+=1)if(!1===c(e[n[i]],t[n[i]],o))return!1;return!0}(e,t,o,n);var i=d(e),s=d(t);if(i.length&&i.length===s.length)return i.sort(),s.sort(),h(i,s,n);if(0===o.length&&0===i.length&&0===r.length&&0===s.length)return!0;return!1}
/*!
 * Returns true if the argument is a primitive.
 *
 * This intentionally returns true for all objects that can be compared by reference,
 * including functions and symbols.
 *
 * @param {Mixed} value
 * @return {Boolean} result
 */(e,t,o)}}(e,t,m,n);return a(e,t,n.memoize,v),v}function f(e,t,n){if(e.size!==t.size)return!1;if(0===e.size)return!0;var o=[],r=[];return e.forEach((function(e,t){o.push([e,t])})),t.forEach((function(e,t){r.push([e,t])})),h(o.sort(),r.sort(),n)}
/*!
 * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
 *
 * @param {Iterable} leftHandOperand
 * @param {Iterable} rightHandOperand
 * @param {Object} [options] (Optional)
 * @return {Boolean} result
 */function h(e,t,n){var o=e.length;if(o!==t.length)return!1;if(0===o)return!0;for(var r=-1;++r<o;)if(!1===c(e[r],t[r],n))return!1;return!0}
/*!
 * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
 * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
 *
 * @param {Object} target
 * @returns {Array} an array of entries from the @@iterator function
 */
function d(e){if(function(e){return"undefined"!=typeof Symbol&&"object"==typeof e&&void 0!==Symbol.iterator&&"function"==typeof e[Symbol.iterator]}(e))try{return p(e[Symbol.iterator]())}catch(e){return[]}return[]}
/*!
 * Gets all entries from a Generator. This will consume the generator - which could have side effects.
 *
 * @param {Generator} target
 * @returns {Array} an array of entries from the Generator.
 */function p(e){for(var t=e.next(),n=[t.value];!1===t.done;)t=e.next(),n.push(t.value);return n}
/*!
 * Gets all own and inherited enumerable keys from a target.
 *
 * @param {Object} target
 * @returns {Array} an array of own and inherited enumerable keys from the target.
 */function y(e){var t=[];for(var n in e)t.push(n);return t}function b(e){return null===e||"object"!=typeof e}e.exports=c,e.exports.MemoizeMap=i},function(e,t,n){
/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=n(4),r=n(3),i=n(8),s=n(5);e.exports=function(e,t,n){n=void 0===n?function(){}:n,Object.defineProperty(e,t,{get:function e(){i()||r(this,"lockSsfi")||r(this,"ssfi",e);var t=n.call(this);if(void 0!==t)return t;var a=new o.Assertion;return s(this,a),a},configurable:!0})}},function(e,t,n){
/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=n(9),r=n(4),i=n(3),s=n(10),a=n(5);e.exports=function(e,t,n){var c=function(){i(this,"lockSsfi")||i(this,"ssfi",c);var e=n.apply(this,arguments);if(void 0!==e)return e;var t=new r.Assertion;return a(this,t),t};o(c,t,!1),e[t]=s(c,t)}},function(e,t,n){
/*!
 * Chai - overwriteProperty utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=n(4),r=n(3),i=n(8),s=n(5);e.exports=function(e,t,n){var a=Object.getOwnPropertyDescriptor(e,t),c=function(){};a&&"function"==typeof a.get&&(c=a.get),Object.defineProperty(e,t,{get:function e(){i()||r(this,"lockSsfi")||r(this,"ssfi",e);var t=r(this,"lockSsfi");r(this,"lockSsfi",!0);var a=n(c).call(this);if(r(this,"lockSsfi",t),void 0!==a)return a;var u=new o.Assertion;return s(this,u),u},configurable:!0})}},function(e,t,n){
/*!
 * Chai - overwriteMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=n(9),r=n(4),i=n(3),s=n(10),a=n(5);e.exports=function(e,t,n){var c=e[t],u=function(){throw new Error(t+" is not a function")};c&&"function"==typeof c&&(u=c);var l=function(){i(this,"lockSsfi")||i(this,"ssfi",l);var e=i(this,"lockSsfi");i(this,"lockSsfi",!0);var t=n(u).apply(this,arguments);if(i(this,"lockSsfi",e),void 0!==t)return t;var o=new r.Assertion;return a(this,o),o};o(l,t,!1),e[t]=s(l,t)}},function(e,t,n){
/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Module dependencies
 */
var o=n(9),r=n(4),i=n(3),s=n(10),a=n(5),c="function"==typeof Object.setPrototypeOf,u=function(){},l=Object.getOwnPropertyNames(u).filter((function(e){var t=Object.getOwnPropertyDescriptor(u,e);return"object"!=typeof t||!t.configurable})),f=Function.prototype.call,h=Function.prototype.apply;e.exports=function(e,t,n,u){"function"!=typeof u&&(u=function(){});var d={method:n,chainingBehavior:u};e.__methods||(e.__methods={}),e.__methods[t]=d,Object.defineProperty(e,t,{get:function(){d.chainingBehavior.call(this);var n=function(){i(this,"lockSsfi")||i(this,"ssfi",n);var e=d.method.apply(this,arguments);if(void 0!==e)return e;var t=new r.Assertion;return a(this,t),t};if(o(n,t,!0),c){var u=Object.create(this);u.call=f,u.apply=h,Object.setPrototypeOf(n,u)}else{Object.getOwnPropertyNames(e).forEach((function(t){if(-1===l.indexOf(t)){var o=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,o)}}))}return a(this,n),s(n)},configurable:!0})}},function(e,t,n){
/*!
 * Chai - overwriteChainableMethod utility
 * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=n(4),r=n(5);e.exports=function(e,t,n,i){var s=e.__methods[t],a=s.chainingBehavior;s.chainingBehavior=function(){var e=i(a).call(this);if(void 0!==e)return e;var t=new o.Assertion;return r(this,t),t};var c=s.method;s.method=function(){var e=n(c).apply(this,arguments);if(void 0!==e)return e;var t=new o.Assertion;return r(this,t),t}}},function(e,t,n){
/*!
 * Chai - compareByInspect utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Module dependencies
 */
var o=n(12);e.exports=function(e,t){return o(e)<o(t)?-1:1}},function(e,t,n){
/*!
 * Chai - getOwnEnumerableProperties utility
 * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
/*!
 * Module dependencies
 */
var o=n(18);e.exports=function(e){return Object.keys(e).concat(o(e))}},function(e,t,n){"use strict";var o=/\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;function r(e){var t="";if(void 0===e.name){var n=String(e).match(o);n&&(t=n[1])}else t=e.name;return t}e.exports={compatibleInstance:function(e,t){return t instanceof Error&&e===t},compatibleConstructor:function(e,t){return t instanceof Error?e.constructor===t.constructor||e instanceof t.constructor:(t.prototype instanceof Error||t===Error)&&(e.constructor===t||e instanceof t)},compatibleMessage:function(e,t){var n="string"==typeof e?e:e.message;return t instanceof RegExp?t.test(n):"string"==typeof t&&-1!==n.indexOf(t)},getMessage:function(e){var t="";return e&&e.message?t=e.message:"string"==typeof e&&(t=e),t},getConstructorName:function(e){var t=e;return e instanceof Error?t=r(e.constructor):"function"==typeof e&&(t=r(e).trim()||r(new e)),t}}},function(e,t){e.exports=Number.isNaN||
/*!
 * Chai - isNaN utility
 * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
 * MIT Licensed
 */
function(e){return e!=e}},function(e,t,n){
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
var o=n(6);e.exports=function(e,t){
/*!
   * Module dependencies.
   */
var n=e.AssertionError,r=t.flag;
/*!
   * Module export.
   */
/*!
   * Assertion Constructor
   *
   * Creates object for chaining.
   *
   * `Assertion` objects contain metadata in the form of flags. Three flags can
   * be assigned during instantiation by passing arguments to this constructor:
   *
   * - `object`: This flag contains the target of the assertion. For example, in
   *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
   *   contain `numKittens` so that the `equal` assertion can reference it when
   *   needed.
   *
   * - `message`: This flag contains an optional custom error message to be
   *   prepended to the error message that's generated by the assertion when it
   *   fails.
   *
   * - `ssfi`: This flag stands for "start stack function indicator". It
   *   contains a function reference that serves as the starting point for
   *   removing frames from the stack trace of the error that's created by the
   *   assertion when it fails. The goal is to provide a cleaner stack trace to
   *   end users by removing Chai's internal functions. Note that it only works
   *   in environments that support `Error.captureStackTrace`, and only when
   *   `Chai.config.includeStack` hasn't been set to `false`.
   *
   * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
   *   should retain its current value, even as assertions are chained off of
   *   this object. This is usually set to `true` when creating a new assertion
   *   from within another assertion. It's also temporarily set to `true` before
   *   an overwritten assertion gets called by the overwriting assertion.
   *
   * @param {Mixed} obj target of the assertion
   * @param {String} msg (optional) custom error message
   * @param {Function} ssfi (optional) starting point for removing stack frames
   * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
   * @api private
   */
function i(e,n,o,s){return r(this,"ssfi",o||i),r(this,"lockSsfi",s),r(this,"object",e),r(this,"message",n),t.proxify(this)}e.Assertion=i,Object.defineProperty(i,"includeStack",{get:function(){return console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead."),o.includeStack},set:function(e){console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead."),o.includeStack=e}}),Object.defineProperty(i,"showDiff",{get:function(){return console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead."),o.showDiff},set:function(e){console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead."),o.showDiff=e}}),i.addProperty=function(e,n){t.addProperty(this.prototype,e,n)},i.addMethod=function(e,n){t.addMethod(this.prototype,e,n)},i.addChainableMethod=function(e,n,o){t.addChainableMethod(this.prototype,e,n,o)},i.overwriteProperty=function(e,n){t.overwriteProperty(this.prototype,e,n)},i.overwriteMethod=function(e,n){t.overwriteMethod(this.prototype,e,n)},i.overwriteChainableMethod=function(e,n,o){t.overwriteChainableMethod(this.prototype,e,n,o)},i.prototype.assert=function(e,i,s,a,c,u){var l=t.test(this,arguments);if(!1!==u&&(u=!0),void 0===a&&void 0===c&&(u=!1),!0!==o.showDiff&&(u=!1),!l){i=t.getMessage(this,arguments);var f=t.getActual(this,arguments);throw new n(i,{actual:f,expected:a,showDiff:u},o.includeStack?this.assert:r(this,"ssfi"))}},
/*!
   * ### ._obj
   *
   * Quick reference to stored `actual` value for plugin developers.
   *
   * @api private
   */
Object.defineProperty(i.prototype,"_obj",{get:function(){return r(this,"object")},set:function(e){r(this,"object",e)}})}},function(e,t){
/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e,t){var n=e.Assertion,o=e.AssertionError,r=t.flag;function i(e,n){n&&r(this,"message",n),e=e.toLowerCase();var o=r(this,"object"),i=~["a","e","i","o","u"].indexOf(e.charAt(0))?"an ":"a ";this.assert(e===t.type(o).toLowerCase(),"expected #{this} to be "+i+e,"expected #{this} not to be "+i+e)}function s(e,n){return t.isNaN(e)&&t.isNaN(n)||e===n}function a(){r(this,"contains",!0)}function c(e,i){i&&r(this,"message",i);var a=r(this,"object"),c=t.type(a).toLowerCase(),u=r(this,"message"),l=r(this,"negate"),f=r(this,"ssfi"),h=r(this,"deep"),d=h?"deep ":"";u=u?u+": ":"";var p=!1;switch(c){case"string":p=-1!==a.indexOf(e);break;case"weakset":if(h)throw new o(u+"unable to use .deep.include with WeakSet",void 0,f);p=a.has(e);break;case"map":var y=h?t.eql:s;a.forEach((function(t){p=p||y(t,e)}));break;case"set":h?a.forEach((function(n){p=p||t.eql(n,e)})):p=a.has(e);break;case"array":p=h?a.some((function(n){return t.eql(n,e)})):-1!==a.indexOf(e);break;default:if(e!==Object(e))throw new o(u+"object tested must be an array, a map, an object, a set, a string, or a weakset, but "+c+" given",void 0,f);var b=Object.keys(e),g=null,w=0;if(b.forEach((function(i){var s=new n(a);if(t.transferFlags(this,s,!0),r(s,"lockSsfi",!0),l&&1!==b.length)try{s.property(i,e[i])}catch(e){if(!t.checkError.compatibleConstructor(e,o))throw e;null===g&&(g=e),w++}else s.property(i,e[i])}),this),l&&b.length>1&&w===b.length)throw g;return}this.assert(p,"expected #{this} to "+d+"include "+t.inspect(e),"expected #{this} to not "+d+"include "+t.inspect(e))}function u(){var e=r(this,"object"),n=t.type(e);this.assert("Arguments"===n,"expected #{this} to be arguments but got "+n,"expected #{this} to not be arguments")}function l(e,t){t&&r(this,"message",t);var n=r(this,"object");if(r(this,"deep")){var o=r(this,"lockSsfi");r(this,"lockSsfi",!0),this.eql(e),r(this,"lockSsfi",o)}else this.assert(e===n,"expected #{this} to equal #{exp}","expected #{this} to not equal #{exp}",e,this._obj,!0)}function f(e,n){n&&r(this,"message",n),this.assert(t.eql(e,r(this,"object")),"expected #{this} to deeply equal #{exp}","expected #{this} to not deeply equal #{exp}",e,this._obj,!0)}function h(e,i){i&&r(this,"message",i);var s,a=r(this,"object"),c=r(this,"doLength"),u=r(this,"message"),l=u?u+": ":"",f=r(this,"ssfi"),h=t.type(a).toLowerCase(),d=t.type(e).toLowerCase(),p=!0;if(c&&"map"!==h&&"set"!==h&&new n(a,u,f,!0).to.have.property("length"),c||"date"!==h||"date"===d)if("number"===d||!c&&"number"!==h)if(c||"date"===h||"number"===h)p=!1;else{s=l+"expected "+("string"===h?"'"+a+"'":a)+" to be a number or a date"}else s=l+"the argument to above must be a number";else s=l+"the argument to above must be a date";if(p)throw new o(s,void 0,f);if(c){var y,b="length";"map"===h||"set"===h?(b="size",y=a.size):y=a.length,this.assert(y>e,"expected #{this} to have a "+b+" above #{exp} but got #{act}","expected #{this} to not have a "+b+" above #{exp}",e,y)}else this.assert(a>e,"expected #{this} to be above #{exp}","expected #{this} to be at most #{exp}",e)}function d(e,i){i&&r(this,"message",i);var s,a=r(this,"object"),c=r(this,"doLength"),u=r(this,"message"),l=u?u+": ":"",f=r(this,"ssfi"),h=t.type(a).toLowerCase(),d=t.type(e).toLowerCase(),p=!0;if(c&&"map"!==h&&"set"!==h&&new n(a,u,f,!0).to.have.property("length"),c||"date"!==h||"date"===d)if("number"===d||!c&&"number"!==h)if(c||"date"===h||"number"===h)p=!1;else{s=l+"expected "+("string"===h?"'"+a+"'":a)+" to be a number or a date"}else s=l+"the argument to least must be a number";else s=l+"the argument to least must be a date";if(p)throw new o(s,void 0,f);if(c){var y,b="length";"map"===h||"set"===h?(b="size",y=a.size):y=a.length,this.assert(y>=e,"expected #{this} to have a "+b+" at least #{exp} but got #{act}","expected #{this} to have a "+b+" below #{exp}",e,y)}else this.assert(a>=e,"expected #{this} to be at least #{exp}","expected #{this} to be below #{exp}",e)}function p(e,i){i&&r(this,"message",i);var s,a=r(this,"object"),c=r(this,"doLength"),u=r(this,"message"),l=u?u+": ":"",f=r(this,"ssfi"),h=t.type(a).toLowerCase(),d=t.type(e).toLowerCase(),p=!0;if(c&&"map"!==h&&"set"!==h&&new n(a,u,f,!0).to.have.property("length"),c||"date"!==h||"date"===d)if("number"===d||!c&&"number"!==h)if(c||"date"===h||"number"===h)p=!1;else{s=l+"expected "+("string"===h?"'"+a+"'":a)+" to be a number or a date"}else s=l+"the argument to below must be a number";else s=l+"the argument to below must be a date";if(p)throw new o(s,void 0,f);if(c){var y,b="length";"map"===h||"set"===h?(b="size",y=a.size):y=a.length,this.assert(y<e,"expected #{this} to have a "+b+" below #{exp} but got #{act}","expected #{this} to not have a "+b+" below #{exp}",e,y)}else this.assert(a<e,"expected #{this} to be below #{exp}","expected #{this} to be at least #{exp}",e)}function y(e,i){i&&r(this,"message",i);var s,a=r(this,"object"),c=r(this,"doLength"),u=r(this,"message"),l=u?u+": ":"",f=r(this,"ssfi"),h=t.type(a).toLowerCase(),d=t.type(e).toLowerCase(),p=!0;if(c&&"map"!==h&&"set"!==h&&new n(a,u,f,!0).to.have.property("length"),c||"date"!==h||"date"===d)if("number"===d||!c&&"number"!==h)if(c||"date"===h||"number"===h)p=!1;else{s=l+"expected "+("string"===h?"'"+a+"'":a)+" to be a number or a date"}else s=l+"the argument to most must be a number";else s=l+"the argument to most must be a date";if(p)throw new o(s,void 0,f);if(c){var y,b="length";"map"===h||"set"===h?(b="size",y=a.size):y=a.length,this.assert(y<=e,"expected #{this} to have a "+b+" at most #{exp} but got #{act}","expected #{this} to have a "+b+" above #{exp}",e,y)}else this.assert(a<=e,"expected #{this} to be at most #{exp}","expected #{this} to be above #{exp}",e)}function b(e,n){n&&r(this,"message",n);var i=r(this,"object"),s=r(this,"ssfi"),a=r(this,"message");try{var c=i instanceof e}catch(n){if(n instanceof TypeError)throw new o((a=a?a+": ":"")+"The instanceof assertion needs a constructor but "+t.type(e)+" was given.",void 0,s);throw n}var u=t.getName(e);null===u&&(u="an unnamed constructor"),this.assert(c,"expected #{this} to be an instance of "+u,"expected #{this} to not be an instance of "+u)}function g(e,n,i){i&&r(this,"message",i);var s=r(this,"nested"),a=r(this,"own"),c=r(this,"message"),u=r(this,"object"),l=r(this,"ssfi"),f=typeof e;if(c=c?c+": ":"",s){if("string"!==f)throw new o(c+"the argument to property must be a string when using nested syntax",void 0,l)}else if("string"!==f&&"number"!==f&&"symbol"!==f)throw new o(c+"the argument to property must be a string, number, or symbol",void 0,l);if(s&&a)throw new o(c+'The "nested" and "own" flags cannot be combined.',void 0,l);if(null==u)throw new o(c+"Target cannot be null or undefined.",void 0,l);var h,d=r(this,"deep"),p=r(this,"negate"),y=s?t.getPathInfo(u,e):null,b=s?y.value:u[e],g="";d&&(g+="deep "),a&&(g+="own "),s&&(g+="nested "),g+="property ",h=a?Object.prototype.hasOwnProperty.call(u,e):s?y.exists:t.hasProperty(u,e),p&&1!==arguments.length||this.assert(h,"expected #{this} to have "+g+t.inspect(e),"expected #{this} to not have "+g+t.inspect(e)),arguments.length>1&&this.assert(h&&(d?t.eql(n,b):n===b),"expected #{this} to have "+g+t.inspect(e)+" of #{exp}, but got #{act}","expected #{this} to not have "+g+t.inspect(e)+" of #{act}",n,b),r(this,"object",b)}function w(e,t,n){r(this,"own",!0),g.apply(this,arguments)}function m(e,n,o){"string"==typeof n&&(o=n,n=null),o&&r(this,"message",o);var i=r(this,"object"),s=Object.getOwnPropertyDescriptor(Object(i),e);s&&n?this.assert(t.eql(n,s),"expected the own property descriptor for "+t.inspect(e)+" on #{this} to match "+t.inspect(n)+", got "+t.inspect(s),"expected the own property descriptor for "+t.inspect(e)+" on #{this} to not match "+t.inspect(n),n,s,!0):this.assert(s,"expected #{this} to have an own property descriptor for "+t.inspect(e),"expected #{this} to not have an own property descriptor for "+t.inspect(e)),r(this,"object",s)}function v(){r(this,"doLength",!0)}function x(e,o){o&&r(this,"message",o);var i,s=r(this,"object"),a=t.type(s).toLowerCase(),c=r(this,"message"),u=r(this,"ssfi"),l="length";switch(a){case"map":case"set":l="size",i=s.size;break;default:new n(s,c,u,!0).to.have.property("length"),i=s.length}this.assert(i==e,"expected #{this} to have a "+l+" of #{exp} but got #{act}","expected #{this} to not have a "+l+" of #{act}",e,i)}function j(e,t){t&&r(this,"message",t);var n=r(this,"object");this.assert(e.exec(n),"expected #{this} to match "+e,"expected #{this} not to match "+e)}function O(e){var n,i,s=r(this,"object"),a=t.type(s),c=t.type(e),u=r(this,"ssfi"),l=r(this,"deep"),f="",h=!0,d=r(this,"message"),p=(d=d?d+": ":"")+"when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";if("Map"===a||"Set"===a)f=l?"deeply ":"",i=[],s.forEach((function(e,t){i.push(t)})),"Array"!==c&&(e=Array.prototype.slice.call(arguments));else{switch(i=t.getOwnEnumerableProperties(s),c){case"Array":if(arguments.length>1)throw new o(p,void 0,u);break;case"Object":if(arguments.length>1)throw new o(p,void 0,u);e=Object.keys(e);break;default:e=Array.prototype.slice.call(arguments)}e=e.map((function(e){return"symbol"==typeof e?e:String(e)}))}if(!e.length)throw new o(d+"keys required",void 0,u);var y=e.length,b=r(this,"any"),g=r(this,"all"),w=e;if(b||g||(g=!0),b&&(h=w.some((function(e){return i.some((function(n){return l?t.eql(e,n):e===n}))}))),g&&(h=w.every((function(e){return i.some((function(n){return l?t.eql(e,n):e===n}))})),r(this,"contains")||(h=h&&e.length==i.length)),y>1){var m=(e=e.map((function(e){return t.inspect(e)}))).pop();g&&(n=e.join(", ")+", and "+m),b&&(n=e.join(", ")+", or "+m)}else n=t.inspect(e[0]);n=(y>1?"keys ":"key ")+n,n=(r(this,"contains")?"contain ":"have ")+n,this.assert(h,"expected #{this} to "+f+n,"expected #{this} to not "+f+n,w.slice(0).sort(t.compareByInspect),i.sort(t.compareByInspect),!0)}function M(e,o,i){i&&r(this,"message",i);var s,a=r(this,"object"),c=r(this,"ssfi"),u=r(this,"message"),l=r(this,"negate")||!1;new n(a,u,c,!0).is.a("function"),(e instanceof RegExp||"string"==typeof e)&&(o=e,e=null);try{a()}catch(e){s=e}var f=void 0===e&&void 0===o,h=Boolean(e&&o),d=!1,p=!1;if(f||!f&&!l){var y="an error";e instanceof Error?y="#{exp}":e&&(y=t.checkError.getConstructorName(e)),this.assert(s,"expected #{this} to throw "+y,"expected #{this} to not throw an error but #{act} was thrown",e&&e.toString(),s instanceof Error?s.toString():"string"==typeof s?s:s&&t.checkError.getConstructorName(s))}if(e&&s){if(e instanceof Error)t.checkError.compatibleInstance(s,e)===l&&(h&&l?d=!0:this.assert(l,"expected #{this} to throw #{exp} but #{act} was thrown","expected #{this} to not throw #{exp}"+(s&&!l?" but #{act} was thrown":""),e.toString(),s.toString()));t.checkError.compatibleConstructor(s,e)===l&&(h&&l?d=!0:this.assert(l,"expected #{this} to throw #{exp} but #{act} was thrown","expected #{this} to not throw #{exp}"+(s?" but #{act} was thrown":""),e instanceof Error?e.toString():e&&t.checkError.getConstructorName(e),s instanceof Error?s.toString():s&&t.checkError.getConstructorName(s)))}if(s&&null!=o){var b="including";o instanceof RegExp&&(b="matching"),t.checkError.compatibleMessage(s,o)===l&&(h&&l?p=!0:this.assert(l,"expected #{this} to throw error "+b+" #{exp} but got #{act}","expected #{this} to throw error not "+b+" #{exp}",o,t.checkError.getMessage(s)))}d&&p&&this.assert(l,"expected #{this} to throw #{exp} but #{act} was thrown","expected #{this} to not throw #{exp}"+(s?" but #{act} was thrown":""),e instanceof Error?e.toString():e&&t.checkError.getConstructorName(e),s instanceof Error?s.toString():s&&t.checkError.getConstructorName(s)),r(this,"object",s)}function _(e,n){n&&r(this,"message",n);var o=r(this,"object"),i=r(this,"itself"),s="function"!=typeof o||i?o[e]:o.prototype[e];this.assert("function"==typeof s,"expected #{this} to respond to "+t.inspect(e),"expected #{this} to not respond to "+t.inspect(e))}function k(e,n){n&&r(this,"message",n);var o=e(r(this,"object"));this.assert(o,"expected #{this} to satisfy "+t.objDisplay(e),"expected #{this} to not satisfy"+t.objDisplay(e),!r(this,"negate"),o)}function N(e,t,i){i&&r(this,"message",i);var s=r(this,"object"),a=r(this,"message"),c=r(this,"ssfi");if(new n(s,a,c,!0).is.a("number"),"number"!=typeof e||"number"!=typeof t)throw new o((a=a?a+": ":"")+"the arguments to closeTo or approximately must be numbers",void 0,c);this.assert(Math.abs(s-e)<=t,"expected #{this} to be close to "+e+" +/- "+t,"expected #{this} not to be close to "+e+" +/- "+t)}function P(e,t,o){o&&r(this,"message",o);var i,s=r(this,"object"),a=r(this,"message"),c=r(this,"ssfi");new n(s,a,c,!0).is.a("function"),t?(new n(e,a,c,!0).to.have.property(t),i=e[t]):(new n(e,a,c,!0).is.a("function"),i=e()),s();var u=null==t?e():e[t],l=null==t?i:"."+t;r(this,"deltaMsgObj",l),r(this,"initialDeltaValue",i),r(this,"finalDeltaValue",u),r(this,"deltaBehavior","change"),r(this,"realDelta",u!==i),this.assert(i!==u,"expected "+l+" to change","expected "+l+" to not change")}function S(e,t,o){o&&r(this,"message",o);var i,s=r(this,"object"),a=r(this,"message"),c=r(this,"ssfi");new n(s,a,c,!0).is.a("function"),t?(new n(e,a,c,!0).to.have.property(t),i=e[t]):(new n(e,a,c,!0).is.a("function"),i=e()),new n(i,a,c,!0).is.a("number"),s();var u=null==t?e():e[t],l=null==t?i:"."+t;r(this,"deltaMsgObj",l),r(this,"initialDeltaValue",i),r(this,"finalDeltaValue",u),r(this,"deltaBehavior","increase"),r(this,"realDelta",u-i),this.assert(u-i>0,"expected "+l+" to increase","expected "+l+" to not increase")}function E(e,t,o){o&&r(this,"message",o);var i,s=r(this,"object"),a=r(this,"message"),c=r(this,"ssfi");new n(s,a,c,!0).is.a("function"),t?(new n(e,a,c,!0).to.have.property(t),i=e[t]):(new n(e,a,c,!0).is.a("function"),i=e()),new n(i,a,c,!0).is.a("number"),s();var u=null==t?e():e[t],l=null==t?i:"."+t;r(this,"deltaMsgObj",l),r(this,"initialDeltaValue",i),r(this,"finalDeltaValue",u),r(this,"deltaBehavior","decrease"),r(this,"realDelta",i-u),this.assert(u-i<0,"expected "+l+" to decrease","expected "+l+" to not decrease")}["to","be","been","is","and","has","have","with","that","which","at","of","same","but","does","still"].forEach((function(e){n.addProperty(e)})),n.addProperty("not",(function(){r(this,"negate",!0)})),n.addProperty("deep",(function(){r(this,"deep",!0)})),n.addProperty("nested",(function(){r(this,"nested",!0)})),n.addProperty("own",(function(){r(this,"own",!0)})),n.addProperty("ordered",(function(){r(this,"ordered",!0)})),n.addProperty("any",(function(){r(this,"any",!0),r(this,"all",!1)})),n.addProperty("all",(function(){r(this,"all",!0),r(this,"any",!1)})),n.addChainableMethod("an",i),n.addChainableMethod("a",i),n.addChainableMethod("include",c,a),n.addChainableMethod("contain",c,a),n.addChainableMethod("contains",c,a),n.addChainableMethod("includes",c,a),n.addProperty("ok",(function(){this.assert(r(this,"object"),"expected #{this} to be truthy","expected #{this} to be falsy")})),n.addProperty("true",(function(){this.assert(!0===r(this,"object"),"expected #{this} to be true","expected #{this} to be false",!r(this,"negate"))})),n.addProperty("false",(function(){this.assert(!1===r(this,"object"),"expected #{this} to be false","expected #{this} to be true",!!r(this,"negate"))})),n.addProperty("null",(function(){this.assert(null===r(this,"object"),"expected #{this} to be null","expected #{this} not to be null")})),n.addProperty("undefined",(function(){this.assert(void 0===r(this,"object"),"expected #{this} to be undefined","expected #{this} not to be undefined")})),n.addProperty("NaN",(function(){this.assert(t.isNaN(r(this,"object")),"expected #{this} to be NaN","expected #{this} not to be NaN")})),n.addProperty("exist",(function(){var e=r(this,"object");this.assert(null!=e,"expected #{this} to exist","expected #{this} to not exist")})),n.addProperty("empty",(function(){var e,n=r(this,"object"),i=r(this,"ssfi"),s=r(this,"message");switch(s=s?s+": ":"",t.type(n).toLowerCase()){case"array":case"string":e=n.length;break;case"map":case"set":e=n.size;break;case"weakmap":case"weakset":throw new o(s+".empty was passed a weak collection",void 0,i);case"function":var a=s+".empty was passed a function "+t.getName(n);throw new o(a.trim(),void 0,i);default:if(n!==Object(n))throw new o(s+".empty was passed non-string primitive "+t.inspect(n),void 0,i);e=Object.keys(n).length}this.assert(0===e,"expected #{this} to be empty","expected #{this} not to be empty")})),n.addProperty("arguments",u),n.addProperty("Arguments",u),n.addMethod("equal",l),n.addMethod("equals",l),n.addMethod("eq",l),n.addMethod("eql",f),n.addMethod("eqls",f),n.addMethod("above",h),n.addMethod("gt",h),n.addMethod("greaterThan",h),n.addMethod("least",d),n.addMethod("gte",d),n.addMethod("below",p),n.addMethod("lt",p),n.addMethod("lessThan",p),n.addMethod("most",y),n.addMethod("lte",y),n.addMethod("within",(function(e,i,s){s&&r(this,"message",s);var a,c=r(this,"object"),u=r(this,"doLength"),l=r(this,"message"),f=l?l+": ":"",h=r(this,"ssfi"),d=t.type(c).toLowerCase(),p=t.type(e).toLowerCase(),y=t.type(i).toLowerCase(),b=!0,g="date"===p&&"date"===y?e.toUTCString()+".."+i.toUTCString():e+".."+i;if(u&&"map"!==d&&"set"!==d&&new n(c,l,h,!0).to.have.property("length"),u||"date"!==d||"date"===p&&"date"===y)if("number"===p&&"number"===y||!u&&"number"!==d)if(u||"date"===d||"number"===d)b=!1;else{a=f+"expected "+("string"===d?"'"+c+"'":c)+" to be a number or a date"}else a=f+"the arguments to within must be numbers";else a=f+"the arguments to within must be dates";if(b)throw new o(a,void 0,h);if(u){var w,m="length";"map"===d||"set"===d?(m="size",w=c.size):w=c.length,this.assert(w>=e&&w<=i,"expected #{this} to have a "+m+" within "+g,"expected #{this} to not have a "+m+" within "+g)}else this.assert(c>=e&&c<=i,"expected #{this} to be within "+g,"expected #{this} to not be within "+g)})),n.addMethod("instanceof",b),n.addMethod("instanceOf",b),n.addMethod("property",g),n.addMethod("ownProperty",w),n.addMethod("haveOwnProperty",w),n.addMethod("ownPropertyDescriptor",m),n.addMethod("haveOwnPropertyDescriptor",m),n.addChainableMethod("length",x,v),n.addChainableMethod("lengthOf",x,v),n.addMethod("match",j),n.addMethod("matches",j),n.addMethod("string",(function(e,o){o&&r(this,"message",o);var i=r(this,"object"),s=r(this,"message"),a=r(this,"ssfi");new n(i,s,a,!0).is.a("string"),this.assert(~i.indexOf(e),"expected #{this} to contain "+t.inspect(e),"expected #{this} to not contain "+t.inspect(e))})),n.addMethod("keys",O),n.addMethod("key",O),n.addMethod("throw",M),n.addMethod("throws",M),n.addMethod("Throw",M),n.addMethod("respondTo",_),n.addMethod("respondsTo",_),n.addProperty("itself",(function(){r(this,"itself",!0)})),n.addMethod("satisfy",k),n.addMethod("satisfies",k),n.addMethod("closeTo",N),n.addMethod("approximately",N),n.addMethod("members",(function(e,o){o&&r(this,"message",o);var i=r(this,"object"),s=r(this,"message"),a=r(this,"ssfi");new n(i,s,a,!0).to.be.an("array"),new n(e,s,a,!0).to.be.an("array");var c,u,l,f=r(this,"contains"),h=r(this,"ordered");f?(u="expected #{this} to be "+(c=h?"an ordered superset":"a superset")+" of #{exp}",l="expected #{this} to not be "+c+" of #{exp}"):(u="expected #{this} to have the same "+(c=h?"ordered members":"members")+" as #{exp}",l="expected #{this} to not have the same "+c+" as #{exp}");var d=r(this,"deep")?t.eql:void 0;this.assert(function(e,t,n,o,r){if(!o){if(e.length!==t.length)return!1;t=t.slice()}return e.every((function(e,i){if(r)return n?n(e,t[i]):e===t[i];if(!n){var s=t.indexOf(e);return-1!==s&&(o||t.splice(s,1),!0)}return t.some((function(r,i){return!!n(e,r)&&(o||t.splice(i,1),!0)}))}))}(e,i,d,f,h),u,l,e,i,!0)})),n.addMethod("oneOf",(function(e,t){t&&r(this,"message",t);var o=r(this,"object"),i=r(this,"message"),s=r(this,"ssfi");new n(e,i,s,!0).to.be.an("array"),this.assert(e.indexOf(o)>-1,"expected #{this} to be one of #{exp}","expected #{this} to not be one of #{exp}",e,o)})),n.addMethod("change",P),n.addMethod("changes",P),n.addMethod("increase",S),n.addMethod("increases",S),n.addMethod("decrease",E),n.addMethod("decreases",E),n.addMethod("by",(function(e,t){t&&r(this,"message",t);var n,o=r(this,"deltaMsgObj"),i=r(this,"initialDeltaValue"),s=r(this,"finalDeltaValue"),a=r(this,"deltaBehavior"),c=r(this,"realDelta");n="change"===a?Math.abs(s-i)===Math.abs(e):c===Math.abs(e),this.assert(n,"expected "+o+" to "+a+" by "+e,"expected "+o+" to not "+a+" by "+e)})),n.addProperty("extensible",(function(){var e=r(this,"object"),t=e===Object(e)&&Object.isExtensible(e);this.assert(t,"expected #{this} to be extensible","expected #{this} to not be extensible")})),n.addProperty("sealed",(function(){var e=r(this,"object"),t=e!==Object(e)||Object.isSealed(e);this.assert(t,"expected #{this} to be sealed","expected #{this} to not be sealed")})),n.addProperty("frozen",(function(){var e=r(this,"object"),t=e!==Object(e)||Object.isFrozen(e);this.assert(t,"expected #{this} to be frozen","expected #{this} to not be frozen")})),n.addProperty("finite",(function(e){var t=r(this,"object");this.assert("number"==typeof t&&isFinite(t),"expected #{this} to be a finite number","expected #{this} to not be a finite number")}))}},function(e,t){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e,t){e.expect=function(t,n){return new e.Assertion(t,n)},e.expect.fail=function(t,n,o,r){throw arguments.length<2&&(o=t,t=void 0),o=o||"expect.fail()",new e.AssertionError(o,{actual:t,expected:n,operator:r},e.expect.fail)}}},function(e,t){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e,t){var n=e.Assertion;function o(){Object.defineProperty(Object.prototype,"should",{set:function(e){Object.defineProperty(this,"should",{value:e,enumerable:!0,configurable:!0,writable:!0})},get:function e(){return this instanceof String||this instanceof Number||this instanceof Boolean||"function"==typeof Symbol&&this instanceof Symbol?new n(this.valueOf(),null,e):new n(this,null,e)},configurable:!0});var t={fail:function(n,o,r,i){throw arguments.length<2&&(r=n,n=void 0),r=r||"should.fail()",new e.AssertionError(r,{actual:n,expected:o,operator:i},t.fail)},equal:function(e,t,o){new n(e,o).to.equal(t)},Throw:function(e,t,o,r){new n(e,r).to.Throw(t,o)},exist:function(e,t){new n(e,t).to.exist},not:{}};return t.not.equal=function(e,t,o){new n(e,o).to.not.equal(t)},t.not.Throw=function(e,t,o,r){new n(e,r).to.not.Throw(t,o)},t.not.exist=function(e,t){new n(e,t).to.not.exist},t.throw=t.Throw,t.not.throw=t.not.Throw,t}e.should=o,e.Should=o}},function(e,t){
/*!
 * chai
 * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */
e.exports=function(e,t){
/*!
   * Chai dependencies.
   */
var n=e.Assertion,o=t.flag,r=e.assert=function(t,o){new n(null,null,e.assert,!0).assert(t,o,"[ negation message unavailable ]")};
/*!
   * Module export.
   */r.fail=function(t,n,o,i){throw arguments.length<2&&(o=t,t=void 0),o=o||"assert.fail()",new e.AssertionError(o,{actual:t,expected:n,operator:i},r.fail)},r.isOk=function(e,t){new n(e,t,r.isOk,!0).is.ok},r.isNotOk=function(e,t){new n(e,t,r.isNotOk,!0).is.not.ok},r.equal=function(e,t,i){var s=new n(e,i,r.equal,!0);s.assert(t==o(s,"object"),"expected #{this} to equal #{exp}","expected #{this} to not equal #{act}",t,e,!0)},r.notEqual=function(e,t,i){var s=new n(e,i,r.notEqual,!0);s.assert(t!=o(s,"object"),"expected #{this} to not equal #{exp}","expected #{this} to equal #{act}",t,e,!0)},r.strictEqual=function(e,t,o){new n(e,o,r.strictEqual,!0).to.equal(t)},r.notStrictEqual=function(e,t,o){new n(e,o,r.notStrictEqual,!0).to.not.equal(t)},r.deepEqual=r.deepStrictEqual=function(e,t,o){new n(e,o,r.deepEqual,!0).to.eql(t)},r.notDeepEqual=function(e,t,o){new n(e,o,r.notDeepEqual,!0).to.not.eql(t)},r.isAbove=function(e,t,o){new n(e,o,r.isAbove,!0).to.be.above(t)},r.isAtLeast=function(e,t,o){new n(e,o,r.isAtLeast,!0).to.be.least(t)},r.isBelow=function(e,t,o){new n(e,o,r.isBelow,!0).to.be.below(t)},r.isAtMost=function(e,t,o){new n(e,o,r.isAtMost,!0).to.be.most(t)},r.isTrue=function(e,t){new n(e,t,r.isTrue,!0).is.true},r.isNotTrue=function(e,t){new n(e,t,r.isNotTrue,!0).to.not.equal(!0)},r.isFalse=function(e,t){new n(e,t,r.isFalse,!0).is.false},r.isNotFalse=function(e,t){new n(e,t,r.isNotFalse,!0).to.not.equal(!1)},r.isNull=function(e,t){new n(e,t,r.isNull,!0).to.equal(null)},r.isNotNull=function(e,t){new n(e,t,r.isNotNull,!0).to.not.equal(null)},r.isNaN=function(e,t){new n(e,t,r.isNaN,!0).to.be.NaN},r.isNotNaN=function(e,t){new n(e,t,r.isNotNaN,!0).not.to.be.NaN},r.exists=function(e,t){new n(e,t,r.exists,!0).to.exist},r.notExists=function(e,t){new n(e,t,r.notExists,!0).to.not.exist},r.isUndefined=function(e,t){new n(e,t,r.isUndefined,!0).to.equal(void 0)},r.isDefined=function(e,t){new n(e,t,r.isDefined,!0).to.not.equal(void 0)},r.isFunction=function(e,t){new n(e,t,r.isFunction,!0).to.be.a("function")},r.isNotFunction=function(e,t){new n(e,t,r.isNotFunction,!0).to.not.be.a("function")},r.isObject=function(e,t){new n(e,t,r.isObject,!0).to.be.a("object")},r.isNotObject=function(e,t){new n(e,t,r.isNotObject,!0).to.not.be.a("object")},r.isArray=function(e,t){new n(e,t,r.isArray,!0).to.be.an("array")},r.isNotArray=function(e,t){new n(e,t,r.isNotArray,!0).to.not.be.an("array")},r.isString=function(e,t){new n(e,t,r.isString,!0).to.be.a("string")},r.isNotString=function(e,t){new n(e,t,r.isNotString,!0).to.not.be.a("string")},r.isNumber=function(e,t){new n(e,t,r.isNumber,!0).to.be.a("number")},r.isNotNumber=function(e,t){new n(e,t,r.isNotNumber,!0).to.not.be.a("number")},r.isFinite=function(e,t){new n(e,t,r.isFinite,!0).to.be.finite},r.isBoolean=function(e,t){new n(e,t,r.isBoolean,!0).to.be.a("boolean")},r.isNotBoolean=function(e,t){new n(e,t,r.isNotBoolean,!0).to.not.be.a("boolean")},r.typeOf=function(e,t,o){new n(e,o,r.typeOf,!0).to.be.a(t)},r.notTypeOf=function(e,t,o){new n(e,o,r.notTypeOf,!0).to.not.be.a(t)},r.instanceOf=function(e,t,o){new n(e,o,r.instanceOf,!0).to.be.instanceOf(t)},r.notInstanceOf=function(e,t,o){new n(e,o,r.notInstanceOf,!0).to.not.be.instanceOf(t)},r.include=function(e,t,o){new n(e,o,r.include,!0).include(t)},r.notInclude=function(e,t,o){new n(e,o,r.notInclude,!0).not.include(t)},r.deepInclude=function(e,t,o){new n(e,o,r.deepInclude,!0).deep.include(t)},r.notDeepInclude=function(e,t,o){new n(e,o,r.notDeepInclude,!0).not.deep.include(t)},r.nestedInclude=function(e,t,o){new n(e,o,r.nestedInclude,!0).nested.include(t)},r.notNestedInclude=function(e,t,o){new n(e,o,r.notNestedInclude,!0).not.nested.include(t)},r.deepNestedInclude=function(e,t,o){new n(e,o,r.deepNestedInclude,!0).deep.nested.include(t)},r.notDeepNestedInclude=function(e,t,o){new n(e,o,r.notDeepNestedInclude,!0).not.deep.nested.include(t)},r.ownInclude=function(e,t,o){new n(e,o,r.ownInclude,!0).own.include(t)},r.notOwnInclude=function(e,t,o){new n(e,o,r.notOwnInclude,!0).not.own.include(t)},r.deepOwnInclude=function(e,t,o){new n(e,o,r.deepOwnInclude,!0).deep.own.include(t)},r.notDeepOwnInclude=function(e,t,o){new n(e,o,r.notDeepOwnInclude,!0).not.deep.own.include(t)},r.match=function(e,t,o){new n(e,o,r.match,!0).to.match(t)},r.notMatch=function(e,t,o){new n(e,o,r.notMatch,!0).to.not.match(t)},r.property=function(e,t,o){new n(e,o,r.property,!0).to.have.property(t)},r.notProperty=function(e,t,o){new n(e,o,r.notProperty,!0).to.not.have.property(t)},r.propertyVal=function(e,t,o,i){new n(e,i,r.propertyVal,!0).to.have.property(t,o)},r.notPropertyVal=function(e,t,o,i){new n(e,i,r.notPropertyVal,!0).to.not.have.property(t,o)},r.deepPropertyVal=function(e,t,o,i){new n(e,i,r.deepPropertyVal,!0).to.have.deep.property(t,o)},r.notDeepPropertyVal=function(e,t,o,i){new n(e,i,r.notDeepPropertyVal,!0).to.not.have.deep.property(t,o)},r.ownProperty=function(e,t,o){new n(e,o,r.ownProperty,!0).to.have.own.property(t)},r.notOwnProperty=function(e,t,o){new n(e,o,r.notOwnProperty,!0).to.not.have.own.property(t)},r.ownPropertyVal=function(e,t,o,i){new n(e,i,r.ownPropertyVal,!0).to.have.own.property(t,o)},r.notOwnPropertyVal=function(e,t,o,i){new n(e,i,r.notOwnPropertyVal,!0).to.not.have.own.property(t,o)},r.deepOwnPropertyVal=function(e,t,o,i){new n(e,i,r.deepOwnPropertyVal,!0).to.have.deep.own.property(t,o)},r.notDeepOwnPropertyVal=function(e,t,o,i){new n(e,i,r.notDeepOwnPropertyVal,!0).to.not.have.deep.own.property(t,o)},r.nestedProperty=function(e,t,o){new n(e,o,r.nestedProperty,!0).to.have.nested.property(t)},r.notNestedProperty=function(e,t,o){new n(e,o,r.notNestedProperty,!0).to.not.have.nested.property(t)},r.nestedPropertyVal=function(e,t,o,i){new n(e,i,r.nestedPropertyVal,!0).to.have.nested.property(t,o)},r.notNestedPropertyVal=function(e,t,o,i){new n(e,i,r.notNestedPropertyVal,!0).to.not.have.nested.property(t,o)},r.deepNestedPropertyVal=function(e,t,o,i){new n(e,i,r.deepNestedPropertyVal,!0).to.have.deep.nested.property(t,o)},r.notDeepNestedPropertyVal=function(e,t,o,i){new n(e,i,r.notDeepNestedPropertyVal,!0).to.not.have.deep.nested.property(t,o)},r.lengthOf=function(e,t,o){new n(e,o,r.lengthOf,!0).to.have.lengthOf(t)},r.hasAnyKeys=function(e,t,o){new n(e,o,r.hasAnyKeys,!0).to.have.any.keys(t)},r.hasAllKeys=function(e,t,o){new n(e,o,r.hasAllKeys,!0).to.have.all.keys(t)},r.containsAllKeys=function(e,t,o){new n(e,o,r.containsAllKeys,!0).to.contain.all.keys(t)},r.doesNotHaveAnyKeys=function(e,t,o){new n(e,o,r.doesNotHaveAnyKeys,!0).to.not.have.any.keys(t)},r.doesNotHaveAllKeys=function(e,t,o){new n(e,o,r.doesNotHaveAllKeys,!0).to.not.have.all.keys(t)},r.hasAnyDeepKeys=function(e,t,o){new n(e,o,r.hasAnyDeepKeys,!0).to.have.any.deep.keys(t)},r.hasAllDeepKeys=function(e,t,o){new n(e,o,r.hasAllDeepKeys,!0).to.have.all.deep.keys(t)},r.containsAllDeepKeys=function(e,t,o){new n(e,o,r.containsAllDeepKeys,!0).to.contain.all.deep.keys(t)},r.doesNotHaveAnyDeepKeys=function(e,t,o){new n(e,o,r.doesNotHaveAnyDeepKeys,!0).to.not.have.any.deep.keys(t)},r.doesNotHaveAllDeepKeys=function(e,t,o){new n(e,o,r.doesNotHaveAllDeepKeys,!0).to.not.have.all.deep.keys(t)},r.throws=function(e,t,i,s){("string"==typeof t||t instanceof RegExp)&&(i=t,t=null);var a=new n(e,s,r.throws,!0).to.throw(t,i);return o(a,"object")},r.doesNotThrow=function(e,t,o,i){("string"==typeof t||t instanceof RegExp)&&(o=t,t=null),new n(e,i,r.doesNotThrow,!0).to.not.throw(t,o)},r.operator=function(i,s,a,c){var u;switch(s){case"==":u=i==a;break;case"===":u=i===a;break;case">":u=i>a;break;case">=":u=i>=a;break;case"<":u=i<a;break;case"<=":u=i<=a;break;case"!=":u=i!=a;break;case"!==":u=i!==a;break;default:throw c=c?c+": ":c,new e.AssertionError(c+'Invalid operator "'+s+'"',void 0,r.operator)}var l=new n(u,c,r.operator,!0);l.assert(!0===o(l,"object"),"expected "+t.inspect(i)+" to be "+s+" "+t.inspect(a),"expected "+t.inspect(i)+" to not be "+s+" "+t.inspect(a))},r.closeTo=function(e,t,o,i){new n(e,i,r.closeTo,!0).to.be.closeTo(t,o)},r.approximately=function(e,t,o,i){new n(e,i,r.approximately,!0).to.be.approximately(t,o)},r.sameMembers=function(e,t,o){new n(e,o,r.sameMembers,!0).to.have.same.members(t)},r.notSameMembers=function(e,t,o){new n(e,o,r.notSameMembers,!0).to.not.have.same.members(t)},r.sameDeepMembers=function(e,t,o){new n(e,o,r.sameDeepMembers,!0).to.have.same.deep.members(t)},r.notSameDeepMembers=function(e,t,o){new n(e,o,r.notSameDeepMembers,!0).to.not.have.same.deep.members(t)},r.sameOrderedMembers=function(e,t,o){new n(e,o,r.sameOrderedMembers,!0).to.have.same.ordered.members(t)},r.notSameOrderedMembers=function(e,t,o){new n(e,o,r.notSameOrderedMembers,!0).to.not.have.same.ordered.members(t)},r.sameDeepOrderedMembers=function(e,t,o){new n(e,o,r.sameDeepOrderedMembers,!0).to.have.same.deep.ordered.members(t)},r.notSameDeepOrderedMembers=function(e,t,o){new n(e,o,r.notSameDeepOrderedMembers,!0).to.not.have.same.deep.ordered.members(t)},r.includeMembers=function(e,t,o){new n(e,o,r.includeMembers,!0).to.include.members(t)},r.notIncludeMembers=function(e,t,o){new n(e,o,r.notIncludeMembers,!0).to.not.include.members(t)},r.includeDeepMembers=function(e,t,o){new n(e,o,r.includeDeepMembers,!0).to.include.deep.members(t)},r.notIncludeDeepMembers=function(e,t,o){new n(e,o,r.notIncludeDeepMembers,!0).to.not.include.deep.members(t)},r.includeOrderedMembers=function(e,t,o){new n(e,o,r.includeOrderedMembers,!0).to.include.ordered.members(t)},r.notIncludeOrderedMembers=function(e,t,o){new n(e,o,r.notIncludeOrderedMembers,!0).to.not.include.ordered.members(t)},r.includeDeepOrderedMembers=function(e,t,o){new n(e,o,r.includeDeepOrderedMembers,!0).to.include.deep.ordered.members(t)},r.notIncludeDeepOrderedMembers=function(e,t,o){new n(e,o,r.notIncludeDeepOrderedMembers,!0).to.not.include.deep.ordered.members(t)},r.oneOf=function(e,t,o){new n(e,o,r.oneOf,!0).to.be.oneOf(t)},r.changes=function(e,t,o,i){3===arguments.length&&"function"==typeof t&&(i=o,o=null),new n(e,i,r.changes,!0).to.change(t,o)},r.changesBy=function(e,t,o,i,s){if(4===arguments.length&&"function"==typeof t){var a=i;i=o,s=a}else 3===arguments.length&&(i=o,o=null);new n(e,s,r.changesBy,!0).to.change(t,o).by(i)},r.doesNotChange=function(e,t,o,i){return 3===arguments.length&&"function"==typeof t&&(i=o,o=null),new n(e,i,r.doesNotChange,!0).to.not.change(t,o)},r.changesButNotBy=function(e,t,o,i,s){if(4===arguments.length&&"function"==typeof t){var a=i;i=o,s=a}else 3===arguments.length&&(i=o,o=null);new n(e,s,r.changesButNotBy,!0).to.change(t,o).but.not.by(i)},r.increases=function(e,t,o,i){return 3===arguments.length&&"function"==typeof t&&(i=o,o=null),new n(e,i,r.increases,!0).to.increase(t,o)},r.increasesBy=function(e,t,o,i,s){if(4===arguments.length&&"function"==typeof t){var a=i;i=o,s=a}else 3===arguments.length&&(i=o,o=null);new n(e,s,r.increasesBy,!0).to.increase(t,o).by(i)},r.doesNotIncrease=function(e,t,o,i){return 3===arguments.length&&"function"==typeof t&&(i=o,o=null),new n(e,i,r.doesNotIncrease,!0).to.not.increase(t,o)},r.increasesButNotBy=function(e,t,o,i,s){if(4===arguments.length&&"function"==typeof t){var a=i;i=o,s=a}else 3===arguments.length&&(i=o,o=null);new n(e,s,r.increasesButNotBy,!0).to.increase(t,o).but.not.by(i)},r.decreases=function(e,t,o,i){return 3===arguments.length&&"function"==typeof t&&(i=o,o=null),new n(e,i,r.decreases,!0).to.decrease(t,o)},r.decreasesBy=function(e,t,o,i,s){if(4===arguments.length&&"function"==typeof t){var a=i;i=o,s=a}else 3===arguments.length&&(i=o,o=null);new n(e,s,r.decreasesBy,!0).to.decrease(t,o).by(i)},r.doesNotDecrease=function(e,t,o,i){return 3===arguments.length&&"function"==typeof t&&(i=o,o=null),new n(e,i,r.doesNotDecrease,!0).to.not.decrease(t,o)},r.doesNotDecreaseBy=function(e,t,o,i,s){if(4===arguments.length&&"function"==typeof t){var a=i;i=o,s=a}else 3===arguments.length&&(i=o,o=null);return new n(e,s,r.doesNotDecreaseBy,!0).to.not.decrease(t,o).by(i)},r.decreasesButNotBy=function(e,t,o,i,s){if(4===arguments.length&&"function"==typeof t){var a=i;i=o,s=a}else 3===arguments.length&&(i=o,o=null);new n(e,s,r.decreasesButNotBy,!0).to.decrease(t,o).but.not.by(i)}
/*!
   * ### .ifError(object)
   *
   * Asserts if value is not a false value, and throws if it is a true value.
   * This is added to allow for chai to be a drop-in replacement for Node's
   * assert class.
   *
   *     var err = new Error('I am a custom error');
   *     assert.ifError(err); // Rethrows err!
   *
   * @name ifError
   * @param {Object} object
   * @namespace Assert
   * @api public
   */,r.ifError=function(e){if(e)throw e},r.isExtensible=function(e,t){new n(e,t,r.isExtensible,!0).to.be.extensible},r.isNotExtensible=function(e,t){new n(e,t,r.isNotExtensible,!0).to.not.be.extensible},r.isSealed=function(e,t){new n(e,t,r.isSealed,!0).to.be.sealed},r.isNotSealed=function(e,t){new n(e,t,r.isNotSealed,!0).to.not.be.sealed},r.isFrozen=function(e,t){new n(e,t,r.isFrozen,!0).to.be.frozen},r.isNotFrozen=function(e,t){new n(e,t,r.isNotFrozen,!0).to.not.be.frozen},r.isEmpty=function(e,t){new n(e,t,r.isEmpty,!0).to.be.empty},r.isNotEmpty=function(e,t){new n(e,t,r.isNotEmpty,!0).to.not.be.empty},
/*!
   * Aliases.
   */
function e(t,n){return r[n]=r[t],e}("isOk","ok")("isNotOk","notOk")("throws","throw")("throws","Throw")("isExtensible","extensible")("isNotExtensible","notExtensible")("isSealed","sealed")("isNotSealed","notSealed")("isFrozen","frozen")("isNotFrozen","notFrozen")("isEmpty","empty")("isNotEmpty","notEmpty")}}]);
//# sourceMappingURL=worker.js.map