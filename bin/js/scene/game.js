/**
 * 路由
 * 1.利用当前路由数据下标奇偶性来判断是上部方块还是下部方块 偶数在下 奇数在上
 *
 */
var WetchGame;
(function (WetchGame) {
    class gameScene {
        constructor() {
            this.Cube_number = 0; // 位置
            this.Router_game = null; // 游戏的路由表
            this.cube_bg_type = true; // 贴图控制
            this.Lead_cube = null; // 主角模型
            this.Circular_obj = null; // 着力点对象
            this.FourcePointRouter = []; //着力点路由表
            this.FoucePointIndex = 0; // 记录当前着力点的下标
            this.accelerate = false; // 圆周运动开关
            this.whereabouts = false; // 斜抛运动开关
            this.LeadLoop = true; // 单摆运动开关
            this.collision = false; //碰撞检测开关
            this.eventControl = true; //事件控制开关
            this.Leaddirection = true; // 单摆运动方向控制
            this.pollctr = 0; //控制方块的生成
            this.bgctr = 0; //控制背景的轮播
            this.bgobj = []; // 背景节点数组
            this.gamestatus = true; //控制分数
            this._Fraction = "0"; //当前分数
            // 圆周运动
            this.Circumferential = {
                angularVelocity: GLOB_Circumferential.angularVelocity,
                angle: 0,
                speed: GLOB_Circumferential.speed,
                increment: GLOB_Circumferential.increment,
                radius: 0,
                Circular_point: 0 // 圆心坐标
            };
            // 斜抛运动
            this.SlantingThrow = {
                pos: null,
                gravity: 7,
                v0: 5,
                acceleration: 0,
                angle: 45,
                time: 0,
            };
            /**
             *
             *  main
             *
             */
            /* 远程获取Router表 */
            this.Main2D = () => {
                let data = this.configure();
                if (data.status) {
                    // 远程请求
                    console.log("请求配置表成功");
                    this.Router_game = Array.from(data.data);
                    this.Main3D();
                }
                else {
                    // 本地请求
                    Laya.loader.load("res/router/Router.json", Laya.Handler.create(this, () => {
                        this.Router_game = Array.from(Laya.Loader.getRes('res/router/Router.json').data);
                        this.Main3D();
                    }));
                }
            };
            /* 绘制3D场景 */
            this.Main3D = () => {
                let self = this;
                /* 渲染开放数据域场景 */
                //self.renderCanvas();
                /* 绘制3D场景 */
                self.initScene();
                /* 创建主角 */
                self.Lead();
                /* 初始化着力点 */
                self.Circular_point_obj();
                /* 初始着力线 */
                self.ForceLineMain("init");
                /* 渲染初始立方体 */
                self.RenderCube(20);
                /* 渲染第一条着力线 */
                self.forceLine();
                /* update */
                self.updata();
                /* 全局对象 */
                self.Global_obj();
                // 执行摄像机动画并绘制2d场景
                this.cameraAnimation(() => {
                    let scene = Laya.stage.addChild(new ui.indexUI);
                    this.scene2D = scene;
                    scene.stage.scaleMode = Laya.Stage.SCALE_EXACTFIT;
                    scene.stage.screenMode = Laya.Stage.SCREEN_NONE;
                    console.log(scene);
                    scene.zOrder = 100;
                    this.loadAdn(); //开场动画
                    this.animation2D(); // 字体动画
                    this.startGame(); // 开始游戏按钮
                });
                /* 播放背景音乐 */
                AUDIO.play(TOOLS.getRandomInt(0, 2) ? "bg_1" : "bg_2");
                /* 关闭全部运动 */
                this.accelerate = this.whereabouts = false;
                //倒计时
                this.CountDown(() => { });
                //new yftools.YFWindow("https://shop.yunfanshidai.com/xcxht/slyxhz/api/getothergamelist.php?gameid=4&openid=test");
            };
            /**
             *
             * 2d场景操作
             *
             */
            this.startGame = () => {
                let setup = this.scene2D.getChildByName("home").getChildByName("btn_groug").getChildByName("setup");
                let btn = this.scene2D.getChildByName("home").getChildByName("btn_groug").getChildByName("start");
                // 开始游戏
                btn.on(Laya.Event.CLICK, this, (e) => {
                    btn.offAll(); // 防止重复点击
                    e.stopPropagation();
                    let leadpos = new Laya.Vector3(0.8, 7, 0); // 默认主角位置
                    let pos = this.Lead_cube.transform.position; // 当前主角位置
                    var x = pos.x - leadpos.x, y = pos.y - leadpos.y; // 主角位置偏移
                    var a = 0, b = 0, time = 100;
                    // x轴偏移
                    var xb = window.setInterval(() => {
                        b += Math.abs(x / time);
                        if (b >= Math.abs(x)) {
                            window.clearInterval(xb);
                        }
                        this.camera.transform.translate(new Laya.Vector3(x / time, 0, 0));
                    }, Math.abs(x / time));
                    // y轴偏移
                    var yb = window.setInterval(() => {
                        a += Math.abs(y / time);
                        if (a >= Math.abs(y)) {
                            window.clearInterval(yb);
                        }
                        this.camera.transform.translate(new Laya.Vector3(y / time, 0, 0));
                    }, Math.abs(y / time));
                    this.LeadLoop = false; //关闭主角自转
                    this.ForceLineMain("end"); // 回收着力线
                    this.eventSwitch(); // 开启游戏控制
                    var _ = this.scene2D.getChildByName("home");
                    _.destroy();
                    this.collision = true; //开启碰撞检测
                    this.fractoinatr(); // 开始递增分数
                });
                // // 排行榜
                // setup.on(Laya.Event.CLICK,this,(e)=>{
                // })
            };
            /**
             *
             * 动画
             *
             */
            // 开场动画
            this.loadAdn = () => {
                let btn_ground = this.scene2D.getChildByName("home").getChildByName("btn_groug");
                // let left_a = this.scene2D.getChildByName("home").getChildByName("left_a") as Laya.Image;
                // let left_b = this.scene2D.getChildByName("home").getChildByName("left_b") as Laya.Image;
                // let left_c = this.scene2D.getChildByName("home").getChildByName("left_c") as Laya.Image;
                // let left_d = this.scene2D.getChildByName("home").getChildByName("left_d") as Laya.Image;
                // let right_a = this.scene2D.getChildByName("home").getChildByName("right_a") as Laya.Image;
                // let right_b = this.scene2D.getChildByName("home").getChildByName("right_b") as Laya.Image;
                // let right_c = this.scene2D.getChildByName("home").getChildByName("right_c") as Laya.Image;
                let logo = this.scene2D.getChildByName("home").getChildByName("logo");
                animation.move(btn_ground, "y", 700, 500, 0);
                // animation.move(left_a,"x",0,500,200);
                // animation.move(left_b,"x",0,500,400);
                // animation.move(left_c,"x",200,500,600);
                // animation.move(left_d,"x",0,500,0);
                // animation.move(right_a,"x",510,500,200);
                // animation.move(right_b,"x",520,500,400);
                // animation.move(right_c,"x",550,500,0);
                animation.scale(logo, 1, 1, 1000, 0);
            };
            // 广告
            this.Advertisement = (type) => {
                if (window["wx"])
                    return;
                let bannerAd = window["wx"].createBannerAd({
                    adUnitId: 'adunit-d707f0634076fb0b',
                    style: {
                        left: 0,
                        top: window.innerHeight,
                        width: window.innerWidth
                    }
                });
                bannerAd.show();
                setTimeout(data => { bannerAd.style.top = window.innerHeight - bannerAd.style.realHeight; }, 1000);
            };
            // 倒计时
            this.CountDown = (callback) => {
                let _size = {
                    btn1: { w: Laya.stage.width / 2.5, h: Laya.stage.width / 2.5 },
                    btn2: { w: Laya.stage.width / 2.5, h: Laya.stage.width / 1 }
                }, _time = 500;
                // 圆环
                let target = new Laya.Sprite();
                Laya.stage.addChild(target);
                target.size(_size.btn1.w, _size.btn1.h);
                target.pos(Laya.stage.width / 2 - _size.btn1.w / 2, Laya.stage.height / 4 - _size.btn1.h / 2);
                target.zOrder = 101;
                target.on(Laya.Event.CLICK, this, () => {
                    console.log("hahah ");
                });
                // 按钮
                let btn = new Laya.Sprite();
                Laya.stage.addChild(btn);
                btn.size(_size.btn2.w, _size.btn2.h);
                btn.pos(Laya.stage.width / 2 - _size.btn2.w / 2 - 5, Laya.stage.height / 1.2 - _size.btn2.h / 2);
                btn.zOrder = 101;
                btn.on(Laya.Event.CLICK, this, () => {
                    console.log("btn ");
                });
                var path = [
                    ["moveTo", 30, 0],
                    ["arcTo", 300, 0, 300, 30, 30],
                    ["arcTo", 300, 100, 270, 100, 30],
                    ["arcTo", 0, 100, 0, 70, 30],
                    ["arcTo", 0, 0, 30, 0, 30],
                ];
                //绘制圆角矩形
                btn.graphics.drawPath(0, 0, path, { fillStyle: "#ffffff" }, { "strokeStyle": "#1fbb25", "lineWidth": "10" });
                btn.graphics.fillText("重新开始", _size.btn2.w / 2, _size.btn2.h / 2.5 - 300 + 35, "40px SimHei", "#1fbb25", "center");
                // 圆环转动
                let fun = () => {
                    _time -= 1;
                    target.graphics.clear();
                    target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, "#cccccc"); // 背景
                    target.graphics.drawPie(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, 0, 360 * (_time / 500), "#1fbb25"); // 进度环
                    target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2 - 40, "#ffffff");
                    target.graphics.fillText("复活", _size.btn1.w / 2, _size.btn1.h / 2.5, "40px SimHei", "#1fbb25", "center");
                    if (_time <= 1) {
                        Laya.timer.clear(this, fun);
                        console.log("结束");
                        if (callback)
                            callback();
                        //target.destroy();
                        //btn.destroy();
                        return;
                    }
                };
                Laya.timer.frameLoop(1, this, fun);
            };
            // 字体动画
            this.animation2D = () => {
                let _ = this.scene2D;
                let title = _.getChildByName("home").getChildByName("title");
                let status = true;
                let alphaanim = () => {
                    if (status) {
                        Laya.Tween.to(title, { alpha: 0 }, 1000, Laya.Ease.quartOut, Laya.Handler.create(this, () => {
                            alphaanim();
                        }));
                    }
                    else {
                        Laya.Tween.to(title, { alpha: 1 }, 1000, Laya.Ease.quartOut, Laya.Handler.create(this, () => {
                            alphaanim();
                        }));
                    }
                    status = !status;
                };
                alphaanim();
            };
            /**
             *
             *  微信开放数据域
             *
             */
            // 初始化开放域
            this.renderCanvas = () => {
                if (!Laya.Browser.window.wx)
                    return;
                // 获取缩放矩阵
                // var form: Laya.Matrix = Laya.stage._canvasTransform;
                // var form_arr = [form.a,form.b,form.c,form.d,form.tx,form.ty];
                // if(!window["pushScore"]){
                //     // 初始化开放域canvas
                //     Laya.timer.once(100, this, function():void{
                //         // 创建canvas
                //         Laya.Browser.window.sharedCanvas.width = Laya.stage.width;
                //         Laya.Browser.window.sharedCanvas.height = Laya.stage.height;
                //         let openDataContext = Laya.Browser.window.wx.getOpenDataContext();
                //         // openDataContext.postMessage({
                //         //     type: 1,
                //         //     data:{
                //         //             score_v_x:50,
                //         //             score_v_y:200,
                //         //             rk_v_x:50,
                //         //             rk_v_y:100,
                //         //             form_arr:form_arr
                //         //         }
                //         //     })  
                //     });
                // }else{
                //    window["pushScore"](1,{
                //                     score_v_x:50,
                //                     score_v_y:200,
                //                     rk_v_x:50,
                //                     rk_v_y:100,
                //                     form_arr:form_arr
                //                 });
                //                 console.log("存在puahscore函数");
                // }
            };
            // 渲染开放域
            this.Wxcanvas = (target) => {
                if (!Laya.Browser.window.wx)
                    return;
                // 渲染主域的canvas
                Laya.timer.once(500, this, function () {
                    var sprite = new Laya.Sprite();
                    sprite.pos(0, 0);
                    var texture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                    sprite.graphics.drawTexture(texture, 0, 0, texture.width, texture.height);
                    target.addChild(sprite);
                });
                // 打开分数排行榜
                console.log("获得分数", this._Fraction);
                window["pushScore"](2, this._Fraction);
            };
            /**
             *
             * 场景绘制
             *
             */
            // 绘制初始场景
            this.initScene = () => {
                //添加3D场景
                var scene = Laya.stage.addChild(new Laya.Scene());
                this.Game_scene = scene;
                //添加摄像机
                var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
                camera.transform.translate(new Laya.Vector3(-1, 10, 6), false);
                camera.transform.localRotationEuler = new Laya.Vector3(-15, -25, 2);
                camera.clearColor = new Laya.Vector4(1, 1, 1, 1);
                this.camera = camera;
                //平行光
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.direction = new Laya.Vector3(2, -2, -3);
                this.directionLight = directionLight;
                for (let i = 0; i < 3; i++) {
                    //添加背景
                    var bottombox = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(bgsize.X, bgsize.Y, bgsize.Z)));
                    var material = new Laya.StandardMaterial();
                    material.diffuseTexture = Laya.Texture2D.load("res/image/color/floor.png");
                    bottombox.meshRender.material = material;
                    bottombox.transform.position = new Laya.Vector3(5 + bgsize.X * i, 0, -10);
                    // bottombox.transform.localRotationEuler = new Laya.Vector3(0,0,0);
                    this.bgobj.push(bottombox);
                }
                //开启雾化效果
                scene.enableFog = true;
                //设置雾化的颜色
                scene.fogColor = new Laya.Vector3(1, 1, 1);
                //设置雾化的起始位置，相对于相机的距离
                scene.fogStart = 10;
                //设置雾化最浓处的距离。
                scene.fogRange = 50;
            };
            /**
             *
             * 事件
             *
             */
            this.eventSwitch = () => {
                // 鼠标按下
                Laya.stage.on(Laya.Event.MOUSE_DOWN, this, () => {
                    if (this.eventControl) {
                        this.ForceLineMain("start"); //绘制着力线
                    }
                });
                // 鼠标松开
                Laya.stage.on(Laya.Event.MOUSE_UP, this, () => {
                    if (this.eventControl) {
                        this.ForceLineMain("end"); //回收着力线
                    }
                });
            };
            /**
             *
             * 着力点与着力线
             *
             */
            // 着力线入口
            this.ForceLineMain = (status) => {
                if (status === "init") {
                    let target = TOOLS.getCylinderMesh(0);
                    this.Game_scene.addChild(target);
                    this.ForceLineObj = target;
                    target.transform.pivot = new Laya.Vector3(0, CylinderMeshCube.Y / 2, 0);
                    this.accelerate = this.whereabouts = false;
                }
                else if (status === "start") {
                    this.forceLine();
                }
                else if (status === "end") {
                    this.deleteFoce();
                }
            };
            // 关闭着力线
            this.deleteFoce = () => {
                //console.log("角速度",this.Circumferential.angularVelocity);
                let Leadpos = this.Lead_cube.transform.position; // 主角位置
                this.SlantingThrow.pos = Leadpos;
                //console.log("主角坐标",Leadpos);
                // 斜抛运动参数
                this.SlantingThrow.v0 = this.Circumferential.angularVelocity * this.Circumferential.radius; // 线速度
                let angle = 90 - (360 - (this.Circumferential.angle - Math.round(this.Circumferential.angle / 360) * 360)); // 斜抛角度
                this.SlantingThrow.angle = angle; // 斜抛角度
                //console.log("斜抛角度为",angle,"线速度为",this.SlantingThrow.v0);
                let target = this.ForceLineObj;
                target.transform.scale = new Laya.Vector3(1, 1, 1);
                this.accelerate = false; // 关闭圆周运动
                this.whereabouts = true; // 开启斜抛运动
                this.Circumferential.speed = GLOB_Circumferential.speed; // 加速度
                //this.Circumferential.time = GLOB_Circumferential.time;// 时间
            };
            // 控制着力点
            this.Rend_Circular_point = (pos) => {
                this.Circular_obj.transform.position = new Laya.Vector3(pos.x, pos.y, 0);
            };
            // 获取信息
            this._getFocecontent = (index) => {
                if (index <= 0) {
                    index = 0;
                }
                let pos;
                if (!!this.FourcePointRouter[index]) {
                    pos = new Laya.Vector3(this.FourcePointRouter[index].point.x, this.FourcePointRouter[index].point.y);
                }
                else {
                    pos = new Laya.Vector3(this.FourcePointRouter[index - 1].point.x, this.FourcePointRouter[index - 1].point.y);
                    this.RenderCube(2); // 创建方块
                }
                return pos;
            };
            // 绘制着力线
            this.forceLine = () => {
                this.SlantingThrow.time = 0; // 清空斜抛运动的时间
                this.whereabouts = false; // 关闭斜抛运动
                var LeadPosition = this.Lead_cube.transform.position; // 主角
                var FoucePosition = this._FocusPoint(LeadPosition); // 着力点
                this.foucePos = FoucePosition; //当前着力坐标
                let angleData = this._quadrant(LeadPosition, FoucePosition); // 角度
                let target = this.ForceLineObj;
                let target_height = TOOLS.getline(FoucePosition, LeadPosition);
                let target_scale = target_height / CylinderMeshCube.Y;
                let angleLead = angleData.angleLead;
                this.Circumferential.angle = angleData.angleLead + 270;
                this.Circumferential.Circular_point = FoucePosition;
                this.Circumferential.radius = target_height; // 圆半径
                target.transform.position = new Laya.Vector3(FoucePosition.x, FoucePosition.y, 0);
                target.transform.scale = new Laya.Vector3(1, target_scale, 1);
                target.transform.localRotationEuler = new Laya.Vector3(0, 0, angleLead);
                this.Rend_Circular_point(FoucePosition);
                this.Circumferential.angularVelocity = this.SlantingThrow.v0 / target_height; // 计算角速度
                this.accelerate = true; // 开启圆周运动
            };
            // 着力点的选取 
            this._FocusPoint = (LeadPosition) => {
                let value = null; // 值
                let pos = this._getFocecontent(this.FoucePointIndex); // 下一个着力点坐标
                let beforePos = this._getFocecontent(this.FoucePointIndex - 1); // 上一个着力点坐标
                let size = TOOLS.getline(pos, LeadPosition); // 计算主角和着力点的距离
                if (LeadPosition.x <= (beforePos.x + (CubeSize.X / 2))) {
                    // 未超过上一个着力点
                    value = beforePos;
                }
                else if (LeadPosition.x >= pos.x || pos.x - LeadPosition.x <= (CubeSize.X / 2)) {
                    // 超过着力点
                    this.FoucePointIndex++;
                    var a = this._FocusPoint(LeadPosition);
                    //console.log(a);
                    value = a;
                }
                else {
                    this.FoucePointIndex++;
                    value = pos; // 正常情况
                }
                return value;
            };
            // 连接主角
            this.FoceAnimation = (pos) => {
                let LeadPosition = pos; // 主角坐标
                let FoucePosition = this.foucePos; // 着力点坐标
                let angleLead = this._quadrant(LeadPosition, FoucePosition).angleLead; // 计算角度
                this.ForceLineObj.transform.localRotationEuler = new Laya.Vector3(0, 0, angleLead);
            };
            // 创建着力点
            this.Circular_point_obj = () => {
                var box = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
                box.meshRender.material = material;
                box.transform.position = new Laya.Vector3(0, 0, 0);
                this.Circular_obj = box;
                //console.log(this.FourcePointRouter);
            };
            /**
             *
             * 摄像机
             *
             */
            // 摄像机动画
            this.cameraAnimation = (call) => {
                this.camera.transform.translate((new Laya.Vector3(0, 0, 20)), false);
                var a = 0;
                let anim = () => {
                    if (a >= 20) {
                        Laya.timer.clear(this, anim);
                        window.setTimeout(() => {
                            call(); //执行回调
                        }, 300);
                    }
                    ;
                    this.camera.transform.translate(new Laya.Vector3(0, 0, -0.2), false);
                    a += 0.2;
                };
                Laya.timer.loop(1, this, anim);
            };
            // 背景无限轮播
            this.bgInfiniteRelay = (val) => {
                this.bgctr += val;
                if (this.bgctr >= bgsize.X) {
                    var pos = this.bgobj[2].transform.position;
                    var target = this.bgobj.shift(); //取第一个
                    target.transform.translate(new Laya.Vector3(pos.x + bgsize.X, 0, 0));
                    this.bgobj.push(target); //排入最后
                    this.bgctr = 0;
                }
            };
            /**
             *
             *  1.立方体生成
             *  2.配置表解析
             *
             */
            // 方块回收与创建
            this.cubectr = (val) => {
                this.pollctr += val;
                if (this.pollctr >= CubeSize.X) {
                    if (Laya.stage._childs[0]._childs.length >= 40) {
                        for (let i = 10; i--;) {
                            Laya.stage._childs[0]._childs[8].destroy();
                        }
                    }
                    this.RenderCube(2); // 创建方块
                    this.pollctr = 0;
                }
            };
            // 远程配置表管理
            this.configure = () => {
                let _ = { data: null, status: null };
                if (!!SERVERURL || !!window["SERVERURL"]) {
                    var data = TOOLS.Ajax(SERVERURL);
                    data.then(res => {
                        _.data = res;
                        _.status = true;
                    }).catch(err => {
                        _.status = false;
                    });
                }
                else {
                    _.status = false;
                }
                ;
                return _; // 返回状态
            };
            // 立方体生成
            this.RenderCube = (size) => {
                let self = this;
                //console.log(self.Cube_number);
                for (let i = size; i--;) {
                    if (self.Cube_number >= self.Router_game.length || !self.Router_game[self.Cube_number]) {
                        /* 配置读取完毕 */
                        console.log(self.Cube_number, "配置读取完毕");
                        let data = this.configure();
                        if (data.status) {
                            // 远程请求
                            this.Router_game = this.Router_game.concat(data.data);
                        }
                        else {
                            // 合并本地数据
                            this.Router_game = this.Router_game.concat(this.Router_game);
                        }
                        this.RenderCube(i);
                    }
                    else {
                        (self.Cube_number % 2 === 0)
                            ?
                                self.AddBox(0, self.Cube_number) // 偶数在下
                            :
                                self.AddBox(1, self.Cube_number); // 奇数在上
                        self.Cube_number++;
                    }
                }
            };
            // 单个立方体
            this.AddBox = (type = null, index) => {
                let box = TOOLS.pullCube({ Checkpoint: 0, imgType: (this.cube_bg_type) ? 0 : 1 }); //从对象池请求立方体
                this.Game_scene.addChild(box); //添加立方体
                //console.log(this.Router_game[index]);
                let height = Number(this.Router_game[index].hp); // 获取立方体高度
                if (type === 0) {
                    // 下部
                    let Box_X = (index + 2) / 2 * CubeSize.X;
                    let Box_Y = (CubeSize.Z / 2) + height;
                    box.transform.translate(new Laya.Vector3(Box_X, Box_Y, 0));
                    this.cube_bg_type = !this.cube_bg_type;
                }
                else {
                    // 上部
                    let targetIndex = (index + 1) / 2; //计算当前数据为第几位奇数
                    let Box_X = targetIndex * CubeSize.X;
                    let Box_Y = CubeSize.Z + height + ((CubeSize.Z / 2) + Number(this.Router_game[index - 1].hp));
                    // 判断当前立方体是否有着力点
                    if (!!this.Router_game[index].skill && Number(this.Router_game[index].skill) === 1) {
                        this.FourcePointRouter.push({
                            point: { x: Box_X, y: Box_Y - (CubeSize.Z / 2) },
                            data_index: index,
                        });
                    }
                    ;
                    box.transform.translate(new Laya.Vector3(Box_X, Box_Y, 0));
                }
            };
            /**
             *
             * 主角控制
             *
             */
            // 创建主角
            this.Lead = () => {
                // let target_cube = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.15, 8, 8))) as Laya.MeshSprite3D;
                // var material: Laya.StandardMaterial = new Laya.StandardMaterial();
                // material.diffuseTexture = Laya.Texture2D.load("res/image/color/football.jpg");
                // target_cube.meshRender.material = material;
                // target_cube.transform.position = new Laya.Vector3(0.8,7,0);
                // // material.albedo=new Laya.Vector4(1,1,2,0.3);
                // // material.renderMode = Laya.StandardMaterial.RENDERMODE_DEPTHREAD_TRANSPARENTDOUBLEFACE;
                // this.Lead_cube = target_cube;
                let target = new WetchGame.npc(this.Game_scene, []);
                this.Lead_cube = target.init(this.Game_scene);
            };
            /**
             *
             * 分数递增
             *
             */
            this.fractoinatr = () => {
                // 分数控制逻辑
                var _ = (this.scene2D.getChildByName("game").getChildByName("Fraction"));
                _.visible = true;
                window.setInterval(() => {
                    if (this.gamestatus) {
                        let text = Number(_.value);
                        _.value = String(text += 1);
                        //Number()
                    }
                    ;
                }, 500);
            };
            /* 加载2d资源 */
            Laya.loader.load([
                "res/atlas/index.atlas"
            ], Laya.Handler.create(this, this.Main2D));
        }
        // 坐标象限
        _quadrant(LeadPosition, FoucePosition) {
            let quadrant, angleLead = TOOLS.getRad(LeadPosition.x, LeadPosition.y, FoucePosition.x, FoucePosition.y);
            if (LeadPosition.x >= FoucePosition.x && LeadPosition.y <= FoucePosition.y) {
                quadrant = 0;
                angleLead = 90 - angleLead;
            }
            else if (LeadPosition.x >= FoucePosition.x && LeadPosition.y >= FoucePosition.y) {
                quadrant = 1;
                angleLead = 90 + angleLead;
            }
            else if (LeadPosition.x <= FoucePosition.x && LeadPosition.y >= FoucePosition.y) {
                quadrant = 2;
                angleLead = 270 - angleLead;
            }
            else if (LeadPosition.x <= FoucePosition.x && LeadPosition.y <= FoucePosition.y) {
                quadrant = 3;
                angleLead = 270 + angleLead;
            }
            ;
            // 90°角特殊情况
            if (angleLead === 0) {
                angleLead = quadrant * 90;
            }
            return { quadrant, angleLead };
        }
        /**
         *
         * 运动函数
         *
         */
        // 圆周运动
        circularMotion(angle, pos) {
            let before_pos = pos;
            let target_X = this.Circumferential.Circular_point.x + this.Circumferential.radius * Math.cos(this.Circumferential.angle * Math.PI / 180);
            let target_Y = this.Circumferential.Circular_point.y + this.Circumferential.radius * Math.sin(this.Circumferential.angle * Math.PI / 180);
            this.Lead_cube.transform.position = new Laya.Vector3(target_X, target_Y, 0);
            return { x: target_X - before_pos.x, y: target_Y - before_pos.y, pos: { x: target_X, y: target_Y } };
        }
        // 斜抛运动
        SlantingMotion(angle, time, speed, scale = 1) {
            let X, Y;
            X = speed * Math.cos(angle * Math.PI / 180) * time; // 水平距离
            Y = speed * Math.sin(angle * Math.PI / 180) * time - (this.SlantingThrow.gravity * (time * time)) / 2; // 垂直距离
            X = X * scale;
            Y = Y * scale;
            return { X, Y };
        }
        /**
         *
         *  碰撞检测
         *
         */
        collisionDetection(pos) {
            let i = Math.round(pos.x / CubeSize.X);
            if (i <= 0)
                i = 1;
            let top = 2 * i - 1; //上方数据索引
            let bottom = top - 1; //下方数据索引
            let max = Number(this.Router_game[top].hp); // 上部数据
            let min = Number(this.Router_game[bottom].hp); // 下部数据
            let toppos = new Laya.Vector3(0, CubeSize.Z + max + ((CubeSize.Z / 2) + min), 0);
            let bottompos = new Laya.Vector3(0, (CubeSize.Z / 2) + min, 0);
            let max_height = toppos.y - (CubeSize.Z / 2); // 最高高度 上部
            let min_height = bottompos.y + (CubeSize.Z / 2); // 最低高度 下部
            if (pos.y >= max_height || pos.y <= min_height) {
                // console.log(`第${i}个    ${top}    ${bottom}  ${toppos}   ${bottompos}`);
                // 结束游戏
                this.accelerate = false; // 关闭圆周运动
                this.whereabouts = false; // 关闭斜抛运动
                this.collision = false; // 关闭碰撞检测
                this.eventControl = false; // 关闭事件监听
                this.ForceLineObj.transform.scale = new Laya.Vector3(1, 1, 1); // 关闭着力线
                this.gamestatus = false; //关闭分数递增
                this._RankingList(); //场景排行榜
            }
        }
        /**
         *
         *  创建游戏结束场景
         *
         */
        _RankingList() {
            // 保存分数
            var _ = (this.scene2D.getChildByName("game").getChildByName("Fraction"));
            this._Fraction = _.value;
            this.scene2D.destroy(); //清空index场景
            let scene = Laya.stage.addChild(new ui.alertUI);
            this.scene2D = scene;
            scene.zOrder = 999;
            this.Wxcanvas(scene); //创建排行榜 
            let btn = scene.getChildByName("reset");
            let share = scene.getChildByName("share");
            btn.on(Laya.Event.CLICK, this, () => {
                TOOLS.runScene(WetchGame.gameScene); //重新开始
            });
            share.on(Laya.Event.CLICK, this, () => {
                window["share"](); //分享
            });
        }
        /**
         *
         *  updata
         *
         */
        updata(type = null) {
            let self = this;
            let callback = () => {
                // 主角位置
                let pos = this.Lead_cube.transform.position;
                // 圆周运动
                if (self.accelerate) {
                    let office = self.circularMotion(self.Circumferential.angle, pos); // 根据角度移动主角
                    self.FoceAnimation(office.pos); // 绘制着力线
                    self.Circumferential.angle += ((Laya.timer.delta / 1000 * self.Circumferential.angularVelocity) * 180 / Math.PI); // 计算角度
                    self.Circumferential.angularVelocity += self.Circumferential.speed; // 递增角速度
                    self.camera.transform.translate(new Laya.Vector3(office.x, office.y, 0), false);
                    self.cubectr(office.x); //控制方块生成
                    self.bgInfiniteRelay(office.x); //控制背景轮播
                }
                // 斜抛运动
                if (self.whereabouts) {
                    let _ = self.SlantingMotion(self.SlantingThrow.angle, self.SlantingThrow.time, self.SlantingThrow.v0, 1);
                    self.SlantingThrow.time += (Laya.timer.delta / 1000);
                    let vect3 = new Laya.Vector3(this.SlantingThrow.pos.x + _.X, this.SlantingThrow.pos.y + _.Y, 0); // 位移向量
                    this.camera.transform.translate(new Laya.Vector3(vect3.x - pos.x, vect3.y - pos.y), false);
                    self.cubectr(vect3.x - pos.x); //控制方块生成
                    self.bgInfiniteRelay(vect3.x - pos.x); //控制背景轮播
                    this.Lead_cube.transform.position = vect3;
                    self.Circumferential.angularVelocity -= self.Circumferential.speed; // 递减角速度
                }
                // 单摆运动
                if (self.LeadLoop) {
                    if (self.Circumferential.angle >= 310) {
                        self.Leaddirection = false;
                    }
                    else if (self.Circumferential.angle <= 230) {
                        self.Leaddirection = true;
                    }
                    ;
                    if (self.Leaddirection) {
                        // 顺时针
                        self.Circumferential.angle++;
                    }
                    else {
                        // 逆时针
                        self.Circumferential.angle--;
                    }
                    let office = self.circularMotion(self.Circumferential.angle, pos); // 改变主角位置
                    self.FoceAnimation(office.pos);
                }
                // 碰撞检测
                if (self.collision) {
                    this.collisionDetection(pos);
                }
                // 主角动画
                this.Lead_cube.transform.rotate(new Laya.Vector3(.1, .1, .1));
            };
            Laya.timer.frameLoop(1, this, callback);
        }
        /**
         *
         * 接口暴露
         *
         */
        // 全局变量转换接口
        Global_obj() {
            window['Lead'] = this.Lead_cube; // 主角
            window["camera"] = this.camera; // 摄像机
            window["foce"] = this.ForceLineObj; //着力线
            window["focepoivet"] = this.Circular_obj; // 着力点
            window["directionLight"] = this.directionLight; //灯光
            window["scene2D"] = this.scene2D; //2d场景
            window["move"] = this.SlantingMotion; //斜抛算法
            window["add"] = this.RenderCube; // 方块生成
        }
    }
    WetchGame.gameScene = gameScene;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=game.js.map