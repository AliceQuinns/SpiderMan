var WetchGame;
(function (WetchGame) {
    var gameScene = /** @class */ (function () {
        function gameScene() {
            //添加3D场景
            var scene = Laya.stage.addChild(new Laya.Scene());
            // 添加雾化
            scene.enableFog = true; //开启雾化
            scene.fogColor = new Laya.Vector3(0, 0, 0.8);
            scene.fogStart = 1; //雾化起始位置
            scene.fogRange = 40; //雾化范围
            //添加照相机
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 3, 3));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            //camera.clearColor = new Laya.Vector4(0,0.1,0.4,1);
            window["ab"] = camera;
            //添加方向光
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.direction = new Laya.Vector3(1, -1, 0);
            //添加自定义模型
            var box = scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(1, 1, 1)));
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var material = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load("res/layabox.png");
            box.meshRender.material = material;
            // 旋转逻辑
            var vect = new Laya.Vector3(1, 1, 0); //旋转向量
            // Laya.timer.loop(10,null,()=>{
            //     box.transform.rotate(vect,true,false);
            //     //box.transform.translate(vect,false);
            //     camera.transform.rotate(new Laya.Vector3(1, 1, 1), true, false);
            // });
        }
        return gameScene;
    }());
    WetchGame.gameScene = gameScene;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=game.js.map