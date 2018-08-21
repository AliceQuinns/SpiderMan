// 动画与UI类
var WetchGame;
(function (WetchGame) {
    class animationUI {
        constructor(ctx) {
            this.shakeadmin = null; // 抖动对象
            // 复活倒计时界面
            this.CountDown = (data = null) => {
                let _size = {
                    btn1: { w: Laya.stage.width / 2.5, h: Laya.stage.width / 2.5 },
                }, _time = 500;
                let target = new Laya.Sprite();
                target.size(_size.btn1.w, _size.btn1.h);
                target.pos(Laya.stage.width / 2 - _size.btn1.w / 2, Laya.stage.height / 4 - _size.btn1.h / 2);
                target.zOrder = 101;
                target.alpha = .9;
                var img = new Laya.Sprite();
                img.zOrder = 101;
                img.loadImage("res/image/color/play_again.png");
                img.size(_size.btn1.w, _size.btn1.h / 2);
                img.pos(Laya.stage.width / 2 - _size.btn1.w / 2, Laya.stage.height / 1.5 - _size.btn1.h / 2);
                let mask = new Laya.Sprite();
                mask.alpha = .5;
                mask.zOrder = 99;
                mask.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
                let label = new Laya.Text();
                label.text = "跳过";
                label.fontSize = 50;
                label.color = "#ffffff";
                label.x = Laya.stage.width / 2 - 50;
                label.y = Laya.stage.height / 2.3;
                label.zOrder = 101;
                Laya.stage.addChild(img);
                Laya.stage.addChild(target);
                Laya.stage.addChild(label);
                Laya.stage.addChild(mask);
                target.on(Laya.Event.CLICK, this, () => {
                    Laya.timer.clear(this, fun);
                    this.ctx.wx.videoAd.shadow();
                });
                img.on(Laya.Event.CLICK, this, () => {
                    this.ctx.Controller("start"); // 进入游戏    
                    target.destroy();
                    Laya.timer.clear(this, fun);
                    target.offAll(Laya.Event.CLICK);
                    img.offAll(Laya.Event.CLICK);
                    label.offAll(Laya.Event.CLICK);
                    target.destroy();
                    img.destroy();
                    mask.destroy();
                    label.destroy();
                    return;
                });
                label.on(Laya.Event.CLICK, this, () => {
                    // this.ctx.Controller("start");// 进入游戏    
                    target.destroy();
                    Laya.timer.clear(this, fun);
                    target.offAll(Laya.Event.CLICK);
                    img.offAll(Laya.Event.CLICK);
                    label.offAll(Laya.Event.CLICK);
                    target.destroy();
                    img.destroy();
                    mask.destroy();
                    label.destroy();
                    if (!!data && "callback" in data)
                        data.callback();
                    return;
                });
                // 圆环转动
                var fun = () => {
                    _time -= 1;
                    target.graphics.clear();
                    target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, "#cccccc"); // 背景
                    target.graphics.drawPie(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, 0, 360 * (_time / 500), "#1fbb25"); // 进度环
                    target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2 - 40, "#ffffff");
                    target.graphics.fillText("复活", _size.btn1.w / 2, _size.btn1.h / 2.5, "40px SimHei", "#1fbb25", "center");
                    if (_time <= 1) {
                        Laya.timer.clear(this, fun);
                        if (!!data && "callback" in data)
                            data.callback();
                        target.offAll(Laya.Event.CLICK);
                        img.offAll(Laya.Event.CLICK);
                        target.destroy();
                        img.destroy();
                        mask.destroy();
                        label.destroy();
                        return;
                    }
                };
                Laya.timer.frameLoop(1, this, fun);
            };
            // 3d场景
            this.initScene = () => {
                let bgobj = [];
                //添加3D场景
                var scene = Laya.stage.addChild(new Laya.Scene());
                //添加摄像机
                var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
                camera.transform.position = new Laya.Vector3(-1, 10, 6);
                camera.transform.localRotationEuler = new Laya.Vector3(-15, -25, 2);
                camera.clearColor = new Laya.Vector4(0.2, 0.5, 0.6, 1);
                //平行光
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.direction = new Laya.Vector3(2, -2, -3);
                directionLight.shadow = false;
                // for (let i = 0; i < 3; i++) {
                //     //添加背景
                //     var bottombox: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(bgsize.X, bgsize.Y, bgsize.Z))) as Laya.MeshSprite3D;
                //     var material: Laya.StandardMaterial = new Laya.StandardMaterial();
                //     material.diffuseTexture = Laya.Texture2D.load("res/image/color/floor.png");
                //     bottombox.meshRender.material = material;
                //     bottombox.transform.position = new Laya.Vector3(5 + bgsize.X * i, 0, -10);
                //     bgobj.push(bottombox);
                // }
                //开启雾化效果
                scene.enableFog = true;
                //设置雾化的颜色
                scene.fogColor = new Laya.Vector3(0.2, 0.5, 0.6);
                //设置雾化的起始位置，相对于相机的距离
                scene.fogStart = 10;
                //设置雾化最浓处的距离。
                scene.fogRange = 30;
                return {
                    scene: scene,
                    camera: camera,
                    directionLight: directionLight,
                    bgobj: bgobj
                };
            };
            // index界面
            this.indexUI = () => {
                let scene = Laya.stage.addChild(new ui.indexUI);
                scene.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
                scene.stage.screenMode = Laya.Stage.SCREEN_NONE;
                scene.zOrder = 100;
                return scene;
            };
            this._a = () => {
                this.ctx.Lead_cube.transform.rotate(new Laya.Vector3(0, -.01, 0));
            };
            // 商城界面
            this.shopping = () => {
                this.ctx.Lead_cube.timerLoop(10, this, this._a);
                let scene = Laya.stage.addChild(new ui.shoppingUI);
                scene.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
                scene.stage.screenMode = Laya.Stage.SCREEN_NONE;
                scene.zOrder = 101;
                var sure = scene.getChildByName("Sure");
                var returnbtn = scene.getChildByName("return");
                sure.on(Laya.Event.CLICK, this, () => {
                    this.ctx.camera.transform.position = new Laya.Vector3(-1, 10, 6);
                    this.ctx.camera.transform.localRotationEuler = new Laya.Vector3(-15, -25, 2);
                    this.ctx.Lead_cube.transform.position = new Laya.Vector3(0.8, 7, 0);
                    scene.destroy();
                    this.ctx.Lead_cube.clearTimer(this, this._a);
                    // this.ctx.Controller("start");
                    this.ctx.scene2D = this.indexUI();
                    this.ctx.loadAdn();
                    this.ctx.startGame();
                    this.ctx.Propobj.halo("add", (new Laya.Vector3(0.8, 7, 0)), 0);
                });
                returnbtn.on(Laya.Event.CLICK, this, () => {
                    this.ctx.camera.transform.position = new Laya.Vector3(-1, 10, 6);
                    this.ctx.camera.transform.localRotationEuler = new Laya.Vector3(-15, -25, 2);
                    this.ctx.Lead_cube.transform.position = new Laya.Vector3(0.8, 7, 0);
                    scene.destroy();
                    this.ctx.Lead_cube.clearTimer(this, this._a);
                    // this.ctx.Controller("start");         
                    this.ctx.scene2D = this.indexUI();
                    this.ctx.loadAdn();
                    this.ctx.startGame();
                });
                return scene;
            };
            // 摄像机抖动
            this.shake = (target, frequency, callback = null) => {
                let pos = target.transform.position;
                let a = true, _frequency = 0;
                let admin = window.setInterval(() => {
                    if (_frequency >= frequency) {
                        window.clearInterval(admin);
                        target.transform.position = pos;
                        if (!!callback)
                            callback();
                    }
                    ;
                    a = !a;
                    _frequency += 1;
                    if (a) {
                        target.transform.translate(new Laya.Vector3(0.1, 0.1, 0));
                    }
                    else {
                        target.transform.translate(new Laya.Vector3(-0.1, -0.1, 0));
                    }
                }, 6);
            };
            // 位移动画函数
            this.moveto = (target, value, time, callback = null) => {
                let pos = target.transform.position;
                // 速度
                let speed_X = Math.abs(value.x - pos.x) / time, speed_Y = Math.abs(value.y - pos.y) / time, speed_Z = Math.abs(value.z - pos.z) / time;
                // 单位时间移动量
                let office_X = (value.x - pos.x) / time * 0.006;
                let office_Y = (value.y - pos.y) / time * 0.006;
                let office_Z = (value.z - pos.z) / time * 0.006;
                window.setTimeout(() => {
                    window.clearInterval(a);
                    console.log("停止动画");
                    if (!!callback)
                        callback();
                }, time * 1000);
                var a = window.setInterval(() => {
                    target.transform.translate(new Laya.Vector3(office_X, office_Y, office_Z));
                }, 6);
            };
            this.ctx = ctx;
        }
    }
    WetchGame.animationUI = animationUI;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=animation.js.map