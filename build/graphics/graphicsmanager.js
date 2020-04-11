import * as THREE from '../libs/three.module.js';
var GraphicsManager = /** @class */ (function () {
    function GraphicsManager(canvasId) {
        this.canvas = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.canvas = document.getElementById(canvasId);
        window.addEventListener('resize', this.resize.bind(this));
    }
    GraphicsManager.prototype.setup = function () {
        this.renderer = new THREE.WebGLRenderer(this.canvas);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 100);
        this.resize();
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
    return GraphicsManager;
}());
export { GraphicsManager };
//# sourceMappingURL=graphicsmanager.js.map