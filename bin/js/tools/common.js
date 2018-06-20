/* 当前场景 */
let VIEW = null;
/* 默认立方体的尺寸 */
let CubeSize = { X: 0.8, Y: 0.5, Z: 5 };
/* 初始着力线的尺寸 */
let CylinderMeshCube = { X: .02, Y: 0.1, Z: 8 };
/* 圆周运动参数 */
let GLOB_Circumferential = {
    angularVelocity: 0.001,
    speed: 0.001,
    increment: 0.0001,
};
/* 立方体贴图 */
let cubeTexture = [
    [
        "res/image/color/bgc_1.png",
        "res/image/color/bgc_2.png"
    ]
];
/* 圆柱体贴图 */
let CylinderMeshTexture = [
    "res/image/color/bga_1.png",
    "res/image/color/bgc_2.png"
];
/* 着力点贴图 */
let Circular_point_texture = [
    "res/image/color/bgc_1.png"
];
var TOOLS = {
    // 切换场景并清空上级场景
    runScene: (scene, arg = null) => {
        Laya.stage.removeChildren();
        Laya.stage.removeSelf();
        VIEW = new scene(arg);
    },
    // 获取立方体
    pullCube: (texture) => {
        let cube = Laya.Pool.getItemByCreateFun("cube", () => {
            var box = new Laya.MeshSprite3D(new Laya.BoxMesh(CubeSize.X, CubeSize.Y, CubeSize.Z));
            var material = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(cubeTexture[texture.Checkpoint][texture.imgType]);
            box.meshRender.material = material;
            /* 添加盒碰撞组件 */
            var boxCollider = box.addComponent(Laya.BoxCollider);
            boxCollider.setFromBoundBox(box.meshFilter.sharedMesh.boundingBox);
            return box;
        });
        return cube;
    },
    // 获取圆柱体
    getCylinderMesh: (texture) => {
        let cube = Laya.Pool.getItemByCreateFun("CylinderMesh", () => {
            var box = new Laya.MeshSprite3D(new Laya.CylinderMesh(CylinderMeshCube.X, CylinderMeshCube.Y, CylinderMeshCube.Z));
            var material = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(CylinderMeshTexture[texture]);
            box.meshRender.material = material;
            return box;
        });
        return cube;
    },
    // 对象池回收
    pushCube: (type, target) => {
        Laya.stage.removeChild(target);
        Laya.Pool.recover(type, target);
    },
    // 获取两个坐标间的距离
    getline: (coordinateA, coordinateB) => {
        let point = new laya.maths.Point(coordinateA.x, coordinateA.y);
        return point.distance(coordinateB.x, coordinateB.y);
    },
    // 获取两点之间角度
    getRad: (x1, y1, x2, y2) => {
        var x = Math.abs(x1 - x2);
        var y = Math.abs(y1 - y2);
        var z = Math.sqrt(x * x + y * y);
        return Math.round((Math.asin(y / z) / Math.PI * 180));
    },
    // 根据弧长计算角度
    getAngle: (radian, radius) => {
        return radian / (Math.PI * radius) * 180;
    },
    // 弧度与角度互转
    getAngleTransform: (value, type) => {
        if (type === "ang") {
            // 弧度转角度 返回角度
            return value * (180 / Math.PI);
        }
        else if (type === "rad") {
            // 角度转弧度 返回弧度
            return value * (Math.PI / 180);
        }
    },
};
//# sourceMappingURL=common.js.map