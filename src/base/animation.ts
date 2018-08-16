// 动画与UI类
module WetchGame {
    export class animationUI {
        private maskobj: Laya.Sprite;// 遮罩对象
        constructor(ctx) {
        }

        // 复活倒计时界面
        public CountDown = (data: any = null) => {
            let _size = {
                btn1: { w: Laya.stage.width / 2.5, h: Laya.stage.width / 2.5 },
            }, _time = 500;
            let target: Laya.Sprite = new Laya.Sprite();
            target.size(_size.btn1.w, _size.btn1.h);
            target.pos(Laya.stage.width / 2 - _size.btn1.w / 2, Laya.stage.height / 4 - _size.btn1.h / 2);
            target.zOrder = 101;
            target.alpha = .9;
            var img: Laya.Sprite = new Laya.Sprite();
            img.zOrder = 101;
            img.loadImage("res/image/color/play_again.png");
            img.size(_size.btn1.w, _size.btn1.h / 2);
            img.pos(Laya.stage.width / 2 - _size.btn1.w / 2, Laya.stage.height / 1.5 - _size.btn1.h / 2);
            let mask: Laya.Sprite = new Laya.Sprite();
            mask.alpha = .5;
            mask.zOrder = 99;
            mask.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
            Laya.stage.addChild(img);
            Laya.stage.addChild(target);
            Laya.stage.addChild(mask);
            target.on(Laya.Event.CLICK, this, () => {
                console.log("复活");
            })
            img.on(Laya.Event.CLICK, this, () => {
                console.log("跳过");
            })
            // 圆环转动
            let fun = () => {
                _time -= 1;
                target.graphics.clear();
                target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, "#cccccc");// 背景
                target.graphics.drawPie(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, 0, 360 * (_time / 500), "#1fbb25");// 进度环
                target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2 - 40, "#ffffff");
                target.graphics.fillText("复活", _size.btn1.w / 2, _size.btn1.h / 2.5, "40px SimHei", "#1fbb25", "center");
                if (_time <= 1) {
                    Laya.timer.clear(this, fun);
                    if (!!data && "callback" in data) data.callback();
                    target.offAll(Laya.Event.CLICK);
                    img.offAll(Laya.Event.CLICK);
                    target.destroy();
                    img.destroy();
                    mask.destroy();
                    return;
                }
            };
            Laya.timer.frameLoop(1, this, fun);
        }

        // 3d场景
        public initScene = () => {
            let bgobj = [];
            
            //添加3D场景
            var scene: Laya.Scene = Laya.stage.addChild(new Laya.Scene()) as Laya.Scene;

            //添加摄像机
            var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
            camera.transform.position = new Laya.Vector3(-1, 10, 6);
            camera.transform.localRotationEuler = new Laya.Vector3(-15, -25, 2);
            camera.clearColor = new Laya.Vector4(1, 1, 1, 1);

            //平行光
            var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
            directionLight.direction = new Laya.Vector3(2, -2, -3);

            for (let i = 0; i < 3; i++) {
                //添加背景
                var bottombox: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(bgsize.X, bgsize.Y, bgsize.Z))) as Laya.MeshSprite3D;
                var material: Laya.StandardMaterial = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load("res/image/color/floor.png");
                bottombox.meshRender.material = material;
                bottombox.transform.position = new Laya.Vector3(5 + bgsize.X * i, 0, -10);
                bgobj.push(bottombox);
            }

            //开启雾化效果
            scene.enableFog = true;
            //设置雾化的颜色
            scene.fogColor = new Laya.Vector3(1, 1, 1);
            //设置雾化的起始位置，相对于相机的距离
            scene.fogStart = 10;
            //设置雾化最浓处的距离。
            scene.fogRange = 50;

            return {
                scene: scene,
                camera: camera,
                directionLight: directionLight,
                bgobj: bgobj
            }
        }

        // index界面
        public indexUI = () => {
            let scene = Laya.stage.addChild(new ui.indexUI) as Laya.Scene;
            scene.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
            scene.stage.screenMode = Laya.Stage.SCREEN_NONE;
            scene.zOrder = 100;
            return scene;
        }
    }
}