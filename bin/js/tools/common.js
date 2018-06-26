/* 当前场景 */
let VIEW = null;
/* 默认立方体的尺寸 */
let CubeSize = { X: 0.8, Y: 0.5, Z: 5 };
/* 初始着力线的尺寸 */
let CylinderMeshCube = { X: .01, Y: 0.01, Z: 8 };
/* 圆周运动参数 */
let GLOB_Circumferential = {
    angularVelocity: 0.001,
    speed: 0.001,
    increment: 0.0001,
};
/* 服务器地址 */
let SERVERURL = "";
/* 立方体贴图 */
let cubeTexture = [
    [
        "res/image/color/stone.jpg",
        "res/image/color/stone2.jpg"
    ]
];
/* 圆柱体贴图 */
let CylinderMeshTexture = [
    "res/image/color/bga_1.png",
    "res/image/color/bgc_2.png"
];
/* 着力点贴图 */
let Circular_point_texture = [
    "res/image/color/bga_1.png"
];
var TOOLS = {
    // 切换场景并清空上级场景
    runScene: (scene, arg = null) => {
        Laya.stage.removeChildren();
        Laya.stage.removeSelf();
        VIEW = new scene(arg);
    },
    // 获取立方体
    pullCube: (texture, pool = false) => {
        if (pool) {
            let cube = Laya.Pool.getItemByCreateFun("cube", () => {
                var box = new Laya.MeshSprite3D(new Laya.BoxMesh(CubeSize.X, CubeSize.Y, CubeSize.Z));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(cubeTexture[texture.Checkpoint][texture.imgType]);
                box.meshRender.material = material;
                return box;
            });
            return cube;
        }
        else {
            var box = new Laya.MeshSprite3D(new Laya.BoxMesh(CubeSize.X, CubeSize.Y, CubeSize.Z));
            var material = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(cubeTexture[texture.Checkpoint][texture.imgType]);
            box.meshRender.material = material;
            return box;
        }
    },
    // 获取圆柱体
    getCylinderMesh: (texture) => {
        let cube = Laya.Pool.getItemByCreateFun("CylinderMesh", () => {
            var box = new Laya.MeshSprite3D(new Laya.CylinderMesh(CylinderMeshCube.X, CylinderMeshCube.Y, CylinderMeshCube.Z));
            var material = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(CylinderMeshTexture[texture]);
            material.albedo = new Laya.Vector4(1, 1, 2, 0.3);
            material.renderMode = Laya.StandardMaterial.RENDERMODE_DEPTHREAD_TRANSPARENTDOUBLEFACE;
            box.meshRender.material = material;
            return box;
        });
        return cube;
    },
    // 对象池回收
    pushCube: (type, target, delet = false) => {
        if (delet) {
            target.destroy();
        }
        else {
            Laya.stage.removeChild(target);
            Laya.Pool.recover(type, target);
        }
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
    // AJAX
    Ajax: (request) => {
        return new Promise((resolve, reject) => {
            let ajax = new XMLHttpRequest();
            ajax.open('GET', request, true);
            ajax.onreadystatechange = () => {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200) {
                        resolve(ajax.response);
                    }
                    else {
                        reject(this.response);
                    }
                }
            };
            ajax.send();
        });
    },
    // 随机算法
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
};
/* 音频管理 */
let AUDIO = {
    play: (type) => {
        let url = null, audio_type = "Musice";
        switch (type) {
            case "bg_1":
                url = "res/audio/01.mp3";
                break;
            case "bg_2":
                url = "res/audio/02.mp3";
                break;
        }
        ;
        if (audio_type === "Musice") {
            Laya.SoundManager.playMusic(url, 0); // 音乐
        }
        else {
            Laya.SoundManager.playSound(url, 1); // 音效
        }
    },
    stop: (url) => {
        Laya.SoundManager.stopSound(url);
    }
};
/**
 *
 *  服务器对接数据格式
 *
 */
let data = {
    Checkpoint: 1,
    data: {}
};
//# sourceMappingURL=common.js.map