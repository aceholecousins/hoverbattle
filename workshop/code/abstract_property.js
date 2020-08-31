var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PropBase = /** @class */ (function () {
    function PropBase() {
    }
    return PropBase;
}());
var PropChild = /** @class */ (function (_super) {
    __extends(PropChild, _super);
    function PropChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PropChild;
}(PropBase));
var Base = /** @class */ (function () {
    function Base(p) {
        this.p = p;
    }
    return Base;
}());
var Child = /** @class */ (function (_super) {
    __extends(Child, _super);
    //p: PropChild
    function Child(p) {
        var _this = _super.call(this, p) || this;
        console.log(_this.p);
        return _this;
    }
    return Child;
}(Base));
var c = new Child({ a: 111, b: 222 });
console.log(c);
