import * as THREE from '../libs/three.module.js';
var GraphicsManager = /** @class */ (function () {
    function GraphicsManager(canvasId) {
        this.canvas = null;
        this.renderer = null;
        //private scene:THREE.Scene|null = null
        this.scene = null;
        //private camera:THREE.Camera|null = null
        this.camera = null;
        this.running = false;
        this.canvas = document.getElementById(canvasId);
        window.addEventListener('resize', this.resize.bind(this));
    }
    GraphicsManager.prototype.setup = function () {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 100);
        this.camera.position.set(0, 0, 10);
        this.scene.add(this.camera);
        this.resize();
    };
    //setBackground(background:THREE.Color|THREE.Texture){
    GraphicsManager.prototype.setBackground = function (background) {
        this.scene.background = background;
    };
    GraphicsManager.prototype.setCamera = function (camera) {
        this.camera = camera;
        this.resize();
    };
    GraphicsManager.prototype.addToScene = function (object) {
        this.scene.add(object);
    };
    GraphicsManager.prototype.removeFromScene = function (object) {
        this.scene.remove(object);
    };
    GraphicsManager.prototype.animate = function () {
        this.running = true;
        this.renderLoop();
    };
    GraphicsManager.prototype.stop = function () {
        this.running = false;
    };
    GraphicsManager.prototype.resize = function () {
        if (this.renderer !== null) {
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        }
        if (this.camera !== null) {
            this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
    };
    GraphicsManager.prototype.cleanup = function () {
        this.camera = null;
        this.renderer.dispose();
        this.renderer = null;
        this.scene = null;
    };
    GraphicsManager.prototype.renderLoop = function () {
        if (this.running) {
            if (this.renderer === null || this.scene === null || this.camera === null) {
                throw new Error("cannot render");
            }
            requestAnimationFrame(this.renderLoop.bind(this));
            this.renderer.render(this.scene, this.camera);
        }
    };
    return GraphicsManager;
}());
export { GraphicsManager };
//# sourceMappingURL=graphicsmanager.js.map