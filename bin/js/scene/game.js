var WetchGame;
(function (WetchGame) {
    class gameScene {
        constructor() {
            this.Router_game = null; // 路由表
            this.cube_bg_type = true; // 贴图控制
            this.Lead_cube = null; // 主角模型
            this.FourcePointRouter = []; // 着力点路由表
            this._Fraction = "0"; // 当前分数
            this.dataform = 1; // 当前使用配置表id
            this.dataInfoArray = []; // 激光点信息表
            this._index = 0; // 激光表读取 index 
            this.rendelist = []; // 渲染队列
            this.Recordspot = 0; // 当前主角使用激光点 index 值
            this.scoreCalculation = true; // 分数计算开关
            this.Scorevalue = 0; // 当前分数
            // 临时变量
            this.TemporaryVariable = {
                cleateBoxStatus: true // 对象创建控制
            };
            this.main = () => {
                this.animationobj = new WetchGame.animationUI(this);
                this.Propobj = new WetchGame.Propobj(this);
                this.npc = new WetchGame.npc(this);
                this.Shopping = new WetchGame.Shopping(this);
                this.wx = new WetchGame.Wetch(this);
                let request = TOOLS.Ajax(`https://shop.yunfanshidai.com/xcxht/pqxcx/conf/${this.dataform}1.json`);
                request.then(data => {
                    let _data = JSON.parse(Object(data)).data;
                    this.Router_game = _data;
                    this.dataFormat(_data);
                    this.Main3D();
                    this.dataform += 1;
                });
                request.catch(err => {
                    Laya.loader.load("res/router/Router2.json", Laya.Handler.create(this, () => {
                        let _data = Array.from(Laya.Loader.getRes('res/router/Router2.json').data);
                        this.Router_game = _data;
                        this.dataFormat(_data);
                        this.Main3D();
                    }));
                });
            };
            this.Main3D = () => {
                let self = this;
                let _ = this.animationobj.initScene();
                this.Game_scene = _.scene; // 3D场景
                this.camera = _.camera;
                this.npc.init({
                    scene: _.scene,
                    skin: 0,
                });
                this.Lead_cube = this.npc.ME;
                this.Propobj.init();
                this.Propobj.halo("add", (new Laya.Vector3(0.8, 7, 0)), 0); // 光环            
                this.ForceLineObj = this.Propobj.Laserline; // 激光线
                this.Controller("start"); // 进入游戏    
                this.Global_obj();
                console.log(this.dataInfoArray);
                console.log(this.Router_game);
                // 更多游戏跳转
                // this.animationobj.mask({type:1});
                // this.animationobj.mask({type:1});
                //this.CountDown(()=>{});
                new yftools.YFWindow("https://shop.yunfanshidai.com/xcxht/slyxhz/api/getothergamelist.php?gameid=4&openid=test");
            };
            // 开始游戏
            this.startGame = () => {
                let setup = this.scene2D
                    .getChildByName("home")
                    .getChildByName("btn_groug")
                    .getChildByName("setup");
                let btn = this.scene2D
                    .getChildByName("home")
                    .getChildByName("btn_groug")
                    .getChildByName("start");
                let skin = this.scene2D
                    .getChildByName("home")
                    .getChildByName("btn_groug")
                    .getChildByName("skin");
                setup.offAll();
                btn.offAll();
                skin.offAll();
                btn.on(Laya.Event.CLICK, this, (e) => {
                    btn.offAll();
                    e.stopPropagation();
                    var _ = this.scene2D.getChildByName("home");
                    _.destroy();
                    // this.Propobj.halo("delete");
                    this.fractoinatr(); // 分数控制
                    this.rendelist = [this._whereabouts, this.collisionDetection.bind(this)]; // 开启抛物
                    this.updata();
                    this.eventSwitch();
                });
                setup.on(Laya.Event.CLICK, this, (e) => {
                    let target = this.scene2D.getChildByName("home");
                    target.visible = false;
                    let sure = this.scene2D.getChildByName("sure");
                    sure.visible = true;
                    this.wx.list();
                    sure.on(Laya.Event.CLICK, this, () => {
                        this.wx.off();
                        sure.visible = false;
                        target.visible = true;
                    });
                    console.log("好友排行榜");
                });
                // 皮肤
                skin.on(Laya.Event.CLICK, this, (e) => {
                    this.scene2D.destroy();
                    this.Shopping.renderUI(null, () => {
                        this.Propobj.halo("add", (new Laya.Vector3(-4.6, 30.5, 7)), 0);
                        this.Lead_cube.transform.position = new Laya.Vector3(-4.6, 31.1, 7);
                        this.camera.transform.position = new Laya.Vector3(-6.4, 32, 10.6);
                        this.scene2D = this.animationobj.shopping();
                    });
                });
            };
            // 状态控制
            this.Controller = data => {
                if (data === "start") {
                    if (!!this.scene2D)
                        this.scene2D.destroy();
                    this._index = 0;
                    this.Recordspot = 0;
                    this.rendelist = "end"; // 清空渲染队列
                    Laya.stage.offAll();
                    this.camera.transform.position = new Laya.Vector3(-1, 10, 6);
                    this.camera.transform.localRotationEuler = new Laya.Vector3(-15, -25, 2);
                    this.Lead_cube.transform.position = new Laya.Vector3(0.8, 7, 0);
                    this.Lead_cube.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                    this.Circumferential = {
                        angularVelocity: GLOB_Circumferential.angularVelocity,
                        angle: 0,
                        speed: GLOB_Circumferential.speed,
                        increment: GLOB_Circumferential.increment,
                        radius: 0,
                        Circular_point: new Laya.Vector3(0.8, 8, 0) // 圆心坐标
                    };
                    this.SlantingThrow = {
                        pos: new Laya.Vector3(0.8, 7, 0),
                        gravity: 8,
                        v0: 5,
                        acceleration: 0,
                        angle: 45,
                        time: 0,
                    };
                    this.RenderCube(3);
                    this.cameraAnimation(() => {
                        this.scene2D = this.animationobj.indexUI();
                        this.loadAdn();
                        this.Propobj.halo("add", (new Laya.Vector3(0.8, 7, 0)), 0);
                        this.npc.comeout(this.Lead_cube, () => {
                            this.circumference(new Laya.Vector3(0.79, 7, 0)); // 绘制激光线
                            this.rendelist = [];
                        });
                        this.startGame(); // 开始游戏按钮
                    });
                    AUDIO.play(TOOLS.getRandomInt(0, 2) ? "bg_1" : "bg_2");
                }
                else if (data === "Restart") {
                }
            };
            // 筛取下一个激光点
            this.Choicespot = data => {
                let pos, index = 1;
                let _before = this.dataInfoArray[this.Recordspot][this.dataInfoArray[this.Recordspot].length - 1].pos;
                let _after = this.dataInfoArray[this.Recordspot + index][this.dataInfoArray[this.Recordspot + index].length - 1].pos;
                let callback = () => {
                    if (data.x > _before.x && data.x < _after.x) {
                        pos = _after;
                    }
                    else if (data.x > _after.x) {
                        index += 1;
                        _after = this.dataInfoArray[this.Recordspot + index][this.dataInfoArray[this.Recordspot + index].length - 1].pos;
                        callback();
                    }
                    else {
                        pos = _before;
                    }
                };
                callback();
                this.Recordspot += index;
                return new Laya.Vector3(pos.x, pos.y, 0);
            };
            // 控制激光线
            this.Renderingline = (type, angle = null, length = null, pos = null) => {
                let target = this.ForceLineObj;
                if (type === true) {
                    target.transform.position = pos;
                    target.transform.localRotationEuler = new Laya.Vector3(0, 0, angle + 90);
                    target._childs[0]._childs[0].transform.localScale = new Laya.Vector3(5, length * 95, 5);
                }
                else if (type === false) {
                    target.transform.position = new Laya.Vector3(0, 0, 0);
                }
            };
            // 计算圆周运动参数
            this.circumference = pos => {
                let FoucePosition = this.Choicespot(pos); // 激光点
                let angle = TOOLS._getAngle(FoucePosition.x, FoucePosition.y, pos.x, pos.y); // 标准角度
                let length = TOOLS.getline(FoucePosition, pos); // 标准距离
                // 开启激光线
                this.Renderingline(true, angle, length, FoucePosition);
                // 圆周运动参数
                this.SlantingThrow.time = 0; // 清空斜抛运动的时间
                this.Circumferential.angle = angle; // 当前角度
                this.Circumferential.Circular_point = FoucePosition; // 圆心
                this.Circumferential.radius = length; // 圆半径
                this.Circumferential.angularVelocity = this.SlantingThrow.v0 / length; // 计算角速度
                // 开启圆周运动
                this.rendelist = [this._accelerate, this.collisionDetection.bind(this)];
            };
            // 计算抛物运动参数
            this.parabolic = data => {
                this.SlantingThrow.pos = data; // 主角坐标
                this.SlantingThrow.v0 = this.Circumferential.angularVelocity * this.Circumferential.radius; // 线速度
                this.SlantingThrow.angle = 90 - (360 - (this.Circumferential.angle - Math.round(this.Circumferential.angle / 360) * 360)); // 斜抛角度
                this.Circumferential.speed = GLOB_Circumferential.speed; // 加速度
                this.rendelist = [this._whereabouts, this.collisionDetection.bind(this)]; // 开启抛物
                this.Renderingline(false); //关闭激光线
            };
            // 数据格式化
            this.dataFormat = data => {
                let _ = [], count = 0;
                // 存在已用数据时叠加index下标
                if (this.dataInfoArray.length > 0) {
                    let _ = this.dataInfoArray[this.dataInfoArray.length - 1];
                    count = _[_.length - 1].index + 1;
                }
                ;
                data.forEach((element, index) => {
                    element.index = index + count;
                    _.push(element);
                    if (!!element.skill && element.skill === "1") {
                        element.pos = { x: (index + count + 1) / 2 * 0.8, y: (this.Propobj.CubeSize.Z / 2) + Number(element.hp) };
                        this.dataInfoArray.push(_);
                        _ = [];
                    }
                    ;
                });
            };
            // 摄像机矫正
            this._camareCorrect = () => {
                let leadpos = new Laya.Vector3(0.8, 7, 0); // 主角初始位置
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
            };
            // ui动画
            this.loadAdn = () => {
                let btn_ground = this.scene2D.getChildByName("home").getChildByName("btn_groug");
                let logo = this.scene2D.getChildByName("home").getChildByName("logo");
                animation.move(btn_ground, "y", 700, 500, 0);
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
            // 事件
            this.eventSwitch = () => {
                Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.Event_DOWN);
                Laya.stage.on(Laya.Event.MOUSE_UP, this, this.Event_UP);
            };
            this.Event_DOWN = event => {
                let pos = this.Lead_cube.transform.position;
                this.circumference(pos); // 计算参数
            };
            this.Event_UP = event => {
                this.rendelist = [];
                let pos = this.Lead_cube.transform.position;
                this.parabolic(pos); // 计算参数
            };
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
            this.RenderCube = (size) => {
                if (this.dataInfoArray.length - (this._index + size) <= 5) {
                    let request = TOOLS.Ajax(`https://shop.yunfanshidai.com/xcxht/pqxcx/conf/${this.dataform}.json`);
                    request.then(data => {
                        let _data = JSON.parse(Object(data)).data;
                        this.Router_game = _data;
                        this.dataFormat(_data);
                        this.dataform += 1;
                    });
                    request.catch(err => {
                        Laya.loader.load("res/router/Router2.json", Laya.Handler.create(this, () => {
                            let data = Array.from(Laya.Loader.getRes('res/router/Router2.json').data);
                            this.Router_game = data;
                            this.dataFormat(data);
                        }));
                    });
                }
                for (let i = size; i--;) {
                    let data;
                    if (this._index >= this.dataInfoArray.length) {
                        data = this.dataInfoArray[this.dataInfoArray.length - 1];
                        this.dataInfoArray[this.dataInfoArray.length - 1].index += 1;
                    }
                    else {
                        data = this.dataInfoArray[this._index];
                    }
                    data.forEach(element => {
                        this.AddBox(element);
                    });
                    this._index += 1;
                }
                this.TemporaryVariable.cleateBoxStatus = true;
            };
            this.AddBox = data => {
                let box = this.Propobj.pullcube((this.cube_bg_type) ? "top" : "bottom"), index = data.index, height = Number(data.hp);
                this.Game_scene.addChild(box);
                if (!box)
                    console.log("无法从对象池请求对象");
                if (index % 2 === 0) { // 下部
                    let Box_X = (index + 2) / 2 * this.Propobj.CubeSize.X;
                    let Box_Y = (this.Propobj.CubeSize.Z / 2) + height;
                    box.transform.translate(new Laya.Vector3(Box_X, Box_Y, 0));
                    this.cube_bg_type = !this.cube_bg_type;
                }
                else {
                    let Box_X = ((index + 1) / 2) * this.Propobj.CubeSize.X;
                    let Box_Y = (this.Propobj.CubeSize.Z / 2) + height;
                    // 道具
                    if (!!data.drop) {
                        let top = height;
                        let bottom = this.Propobj.CubeSize.Z + Number(this.Router_game[data.index - 1].hp);
                        let pos = new Laya.Vector3(Box_X, (top - bottom) / 2 + bottom, 0);
                        if (data.drop === "1") {
                            this.Propobj.getProp(0, pos);
                        }
                        else if (data.drop === "2") {
                            this.Propobj.getProp(1, pos);
                        }
                        else if (data.drop === "3") {
                            this.Propobj.getProp(2, pos);
                        }
                    }
                    box.transform.translate(new Laya.Vector3(Box_X, Box_Y, 0));
                }
            };
            this.fractoinatr = () => {
                // 分数控制逻辑
                var _ = (this.scene2D.getChildByName("game").getChildByName("Fraction"));
                _.visible = true;
                window.setInterval(() => {
                    if (this.scoreCalculation) {
                        this._Fraction = _.value = String(this.Scorevalue += 1);
                    }
                    ;
                }, 1500);
            };
            // 圆周运动
            this._accelerate = data => {
                let self = this, pos = data.pos;
                let office = self.circularMotion(self.Circumferential.angle, pos, this.Circumferential.Circular_point, this.Circumferential.radius, this.Lead_cube);
                let tg = ((Laya.timer.delta / 1000 * self.Circumferential.angularVelocity) * 180 / Math.PI); // 角度增量    
                self.Circumferential.angle += tg; // 计算角度
                self.Circumferential.angularVelocity += self.Circumferential.speed; // 递增角速度
                this.Lead_cube.transform.rotate(new Laya.Vector3(0, 0.05, 0));
                this.ForceLineObj.transform.localRotationEuler = new Laya.Vector3(0, 0, self.Circumferential.angle + 90);
                self.camera.transform.translate(new Laya.Vector3(office.x, office.y, 0), false);
            };
            // 斜抛运动
            this._whereabouts = data => {
                let self = this, pos = data.pos;
                let _ = self.SlantingMotion(self.SlantingThrow.angle, self.SlantingThrow.time, self.SlantingThrow.v0, 1);
                self.SlantingThrow.time += (Laya.timer.delta / 1000);
                let vect3 = new Laya.Vector3(this.SlantingThrow.pos.x + _.X, this.SlantingThrow.pos.y + _.Y, 0); // 位移向量
                this.camera.transform.translate(new Laya.Vector3(vect3.x - pos.x, vect3.y - pos.y), false);
                this.Lead_cube.transform.position = vect3;
                this.Lead_cube.transform.rotate(new Laya.Vector3(0, 0.1, 0));
                self.Circumferential.angularVelocity -= self.Circumferential.speed; // 递减角速度
            };
            Laya.loader.load([
                "res/atlas/index.atlas"
            ], Laya.Handler.create(this, this.main));
        }
        // 圆周运动算法
        circularMotion(angle, pos, contercircle, radius, target) {
            let target_X = contercircle.x + radius * Math.cos(angle * Math.PI / 180);
            let target_Y = contercircle.y + radius * Math.sin(angle * Math.PI / 180);
            target.transform.position = new Laya.Vector3(target_X, target_Y, 0);
            return { x: target_X - pos.x, y: target_Y - pos.y, pos: { x: target_X, y: target_Y } };
        }
        // 斜抛运动算法
        SlantingMotion(angle, time, speed, scale = 1) {
            let X, Y;
            X = speed * Math.cos(angle * Math.PI / 180) * time; // 水平距离
            Y = speed * Math.sin(angle * Math.PI / 180) * time - (this.SlantingThrow.gravity * (time * time)) / 2; // 垂直距离
            X = X * scale;
            Y = Y * scale;
            return { X, Y };
        }
        // 碰撞检测
        collisionDetection(target) {
            let pos = target.pos;
            let Targetpoint = this.dataInfoArray[this._index - 1][this.dataInfoArray[this._index - 1].length - 1].pos; // 当前页面已渲染且最远距离的激光点坐标
            let i = Math.round(pos.x / this.Propobj.CubeSize.X);
            if (i <= 0)
                i = 1;
            let top = 2 * i - 1; //上方数据索引
            let bottom = top - 1; //下方数据索引
            let max = Number(this.Router_game[top].hp); // 上部数据
            let min = Number(this.Router_game[bottom].hp); // 下部数据
            let max_height = max; // 最高高度
            let min_height = min + this.Propobj.CubeSize.Z; // 最低高度 
            if (pos.y >= max_height || pos.y <= min_height) {
                this.rendelist = "end";
                this.scoreCalculation = false;
                Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.Event_DOWN);
                Laya.stage.off(Laya.Event.MOUSE_UP, this, this.Event_UP);
                this.animationobj.shake(this.camera, 100, () => {
                    this.ForceLineObj.transform.position = new Laya.Vector3(-5, 0, 0);
                    this.animationobj.CountDown({
                        callback: () => {
                            this.gameover();
                        }
                    });
                });
            }
            if ("drop" in this.Router_game[top] && this.Router_game[top].drop.length > 0) {
                let topY = Number(this.Router_game[top].hp);
                let bottomY = this.Propobj.CubeSize.Z + Number(this.Router_game[bottom].hp);
                let dropMaxheight = (topY - bottomY) / 2 + bottomY; // 道具Y轴范围
                if (pos.y <= dropMaxheight + 0.25 && pos.y >= dropMaxheight - 0.25) {
                    console.log("获得道具", dropMaxheight);
                }
            }
            if (pos.x >= Targetpoint.x - 3.2 && this.TemporaryVariable.cleateBoxStatus) {
                this.TemporaryVariable.cleateBoxStatus = false;
                this.RenderCube(1);
            }
        }
        gameover() {
            this.scene2D.destroy(); //清空index场景
            let scene = Laya.stage.addChild(new ui.alertUI);
            this.scene2D = scene;
            scene.zOrder = 999;
            let btn = scene.getChildByName("reset");
            let share = scene.getChildByName("share");
            btn.on(Laya.Event.CLICK, this, () => {
                this.Controller("start");
            });
            share.on(Laya.Event.CLICK, this, () => {
                //分享
                this.wx.share();
            });
        }
        // 渲染队列
        updata() {
            let _callback = () => {
                let pos = this.Lead_cube.transform.position;
                if (this.rendelist === "end") {
                    console.log("结束帧循环");
                    return;
                }
                ;
                this.rendelist.forEach((fun) => {
                    fun({ pos: pos });
                });
                window.requestAnimationFrame(_callback);
            };
            window.requestAnimationFrame(_callback);
        }
        // 全局变量转换接口
        Global_obj() {
            window['Lead'] = this.Lead_cube; // 主角
            window["camera"] = this.camera; // 摄像机
            window["foce"] = this.ForceLineObj; //着力线
            window["scene2D"] = this.scene2D; //2d场景
            window["move"] = this.SlantingMotion; //斜抛算法
            window["add"] = this.RenderCube; // 方块生成
            window["Controller"] = this.Controller; // 游戏状态切换
            window["Choicespot"] = this.Choicespot; // 激光点选取
            window["aa"] = this.circularMotion.bind(this);
            window["over"] = this.animationobj.CountDown;
            window["shake"] = this.animationobj.shake;
            window["moveto"] = this.animationobj.moveto;
            window["gameover"] = this.gameover.bind(this);
            window["getProp"] = this.Propobj.getProp;
            window["halo"] = this.Propobj.halo;
        }
    }
    WetchGame.gameScene = gameScene;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=game.js.map