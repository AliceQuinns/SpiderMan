/**
 * 路由
 * 1.利用当前路由数据下标奇偶性来判断是上部方块还是下部方块 偶数在下 奇数在上
 *
 */
var WetchGame;
(function (WetchGame) {
    class gameScene {
        constructor() {
            this.Cube_number = 0; // 记录立方体的总数与当前读取到路由表的数据位置
            this.Router_game = null; // 游戏的路由表
            this.cube_bg_type = true; // 立方体的贴图
            this.Lead_cube = null; // 主角模型
            this.radius = 1; // 主角运动圆半径
            this.angle = 270; // 主角当前角度
            this.angleSpeed = 1; // 弧形加速度
            this.gravityAcces = 5; // 重力加速度
            this.Circular_obj = null; // 抓力点对象
            this.FourcePointRouter = []; //着力点路由表
            this.FoucePointIndex = 0; // 记录当前着力点的下标
            this.accelerate = false; //主角加速运动开关
            this.whereabouts = false; //主角下落运动开关
            this.Lead_radian = 60; //控制抛物线运动角度
            this.Lead_step = 0.01; //控制抛物运动移动速度
            this.LeadLoop = true; //主角循环运动开启
            this.Leaddirection = true; //主角循环运动方向
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
                camera.transform.translate(new Laya.Vector3(2, 12, 7), false);
                camera.transform.rotate(new Laya.Vector3(-15, -25, 0), true, false);
                this.camera = camera;
                //方向光
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.direction = new Laya.Vector3(0.5, -1, -1.0);
                //添加背景图
                var box = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(50, 0.001, 50)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load("res/image/1.png");
                box.meshRender.material = material;
                box.transform.position = new Laya.Vector3(0, 5, -1);
            };
            /**
             *
             * 事件
             *
             */
            // 全局鼠标事件
            this.eventSwitch = () => {
                // 鼠标按下
                Laya.stage.on(Laya.Event.MOUSE_DOWN, this, () => {
                    this.LeadLoop = false; //关闭自转
                    this.ForceLineMain("start"); //绘制着力线
                    console.log("按下");
                });
                // 鼠标松开
                Laya.stage.on(Laya.Event.MOUSE_UP, this, () => {
                    this.ForceLineMain("end"); //回收着力线
                    console.log("松开");
                });
            };
            /**
             *
             * 抓力点与抓力线
             *
             */
            //着力线
            this.ForceLineMain = (status) => {
                if (status === "init") {
                    // 初始化着力线对象
                    let target = TOOLS.getCylinderMesh(0);
                    this.Game_scene.addChild(target);
                    this.ForceLineObj = target;
                    target.transform.pivot = new Laya.Vector3(0, 0.05, 0);
                    this.forceLine("init");
                }
                else if (status === "start") {
                    // 开启
                    this.forceLine();
                }
                else if (status === "end") {
                    // 关闭
                    this.deleteFoce(this.ForceLineObj);
                }
            };
            // 关闭着力线
            this.deleteFoce = (target) => {
                target.transform.scale = new Laya.Vector3(1, 1, 1);
                // 关闭主角加速运动
                this.accelerate = false;
                // 开启下坠
                //this.whereabouts = true;
                // 重置加速度
                this.angleSpeed = 1; // 弧形加速度
                this.gravityAcces = 5; // 重力加速度
                // 还原旋转
                this.ForceLineObj.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                // 还原位置
                this.ForceLineObj.transform.position = new Laya.Vector3(0, 0, 0);
            };
            // 控制着力点位置
            this.Rend_Circular_point = (pos) => {
                this.Circular_obj.transform.position = new Laya.Vector3(pos.x, pos.y, 0);
            };
            // 着力线递增动画
            this.forceAnimation = () => {
                this.ForceLineObj.transform.scale = new Laya.Vector3(1, 0.1, 1);
            };
            // 获取着力点坐标与主角坐标
            this._getFoce = () => {
                // 主角坐标
                let LeadPosition = this.Lead_cube.transform.position;
                // 着力点坐标
                let FoucePosition = null;
                // 是否超过着力点
                let offset = false;
                // 计算着力点坐标
                let _private = () => {
                    let pos = new Laya.Vector3(this.FourcePointRouter[this.FoucePointIndex].point.x, this.FourcePointRouter[this.FoucePointIndex].point.y);
                    if (LeadPosition.x >= pos.x) {
                        /**
                         *  当主角位置超过着力点位置时
                         *  判断是否超过两块立方体的距离
                         *  如果超过两块立方体的距离则指向下一个着力点
                         *  如果未超过则仍返回当前着力点
                         */
                        offset = true;
                        if (LeadPosition.x - pos.x >= (2 * CubeSize.X)) {
                            this.FoucePointIndex++;
                            _private();
                        }
                        else {
                            FoucePosition = pos;
                        }
                    }
                    else {
                        FoucePosition = pos;
                        offset = false;
                    }
                };
                _private();
                return { a: FoucePosition, b: LeadPosition, offset: offset };
            };
            // 着力线开启
            this.forceLine = (type = null) => {
                let _ = this._getFoce();
                // 获取着力点
                let FoucePosition = _.a;
                // 获取主角坐标
                let LeadPosition = _.b;
                // 获取着力线对象
                let target = this.ForceLineObj;
                // 着色线的实际长度
                let target_height = TOOLS.getline(FoucePosition, LeadPosition);
                // 目标缩放值
                let target_scale = target_height / CylinderMeshCube.Y;
                /* 角度计算 */
                if (_.offset) {
                    // 主角位置大于着力点
                }
                // 着色线偏转角度
                let angleLead = TOOLS.getRad(LeadPosition.x, LeadPosition.y, FoucePosition.x, FoucePosition.y) - 90;
                // 主角相对着力点角度
                this.angle = (90 - Math.abs(angleLead)) + 180;
                // 改变主角运动圆心坐标
                this.Circular_point = FoucePosition;
                // 改变主角运动圆半径
                this.radius = target_height;
                // 着力线设置
                target.transform.position = new Laya.Vector3(FoucePosition.x, FoucePosition.y, 0);
                target.transform.scale = new Laya.Vector3(1, target_scale, 1);
                target.transform.rotate(new Laya.Vector3(0, 0, angleLead), false, false);
                this.FoucePointIndex++;
                console.log(target_height, "角度为:", angleLead);
                // 移动着力点位置
                this.Rend_Circular_point(FoucePosition);
                if (type !== "init") {
                    // 开启主角加速运动
                    this.accelerate = true;
                    //关闭下坠
                    this.whereabouts = false;
                }
            };
            // 初始化着力点
            this.Circular_point_obj = () => {
                var box = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
                box.meshRender.material = material;
                box.transform.position = new Laya.Vector3(0, 0, 0);
                this.Circular_obj = box;
                console.log(this.FourcePointRouter); //打印着力点配置表
            };
            /**
             *
             * 摄像机
             *
             */
            // 摄像机动画
            this.cameraAnimation = () => {
                let anim = () => { this.camera.transform.translate(new Laya.Vector3(-0.08, -0.04, 0)); };
                Laya.timer.loop(10, this, anim);
                window.setTimeout(() => {
                    /* 关闭动画 */
                    Laya.timer.clear(this, anim);
                }, 1000);
            };
            // 控制摄像机偏移
            this.LookAT = (office) => {
                this.camera.transform.translate(office);
            };
            /**
             *
             * 立方体生成与配置表解析
             *
             */
            // 方块创建入口 参数>=2 且为2的倍数
            this.RenderCube = (size) => {
                let self = this;
                if (self.Router_game[self.Cube_number].c_type === 0) {
                    return;
                }
                for (let i = size; i--;) {
                    (self.Cube_number % 2 === 0)
                        ?
                            self.AddBox(0, self.Cube_number) // 偶数在下
                        :
                            self.AddBox(1, self.Cube_number); // 奇数在上
                    //console.log(self.Cube_number);
                    self.Cube_number++;
                }
            };
            // 创建立方体方块
            this.AddBox = (type = null, index) => {
                let box = TOOLS.pullCube({ Checkpoint: 0, imgType: (this.cube_bg_type) ? 0 : 1 }); //从对象池请求立方体
                this.Game_scene.addChild(box); //添加立方体
                //console.log(this.Router_game[index]);
                let height = Number(this.Router_game[index].hp); // 获取立方体设置Y轴高度
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
                    // 判断当前立方体是否有 着力点
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
                let target_cube = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.1, 8, 8)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load("res/image/two.png");
                target_cube.meshRender.material = material;
                target_cube.transform.position = new Laya.Vector3(0.8, 7, 0);
                /* 添加圆形碰撞器 */
                let spherecollider = target_cube.addComponent(Laya.SphereCollider);
                /* 设置球形碰撞器中心位置 */
                spherecollider.center = target_cube.meshFilter.sharedMesh.boundingSphere.center.clone();
                /* 设置球形碰撞器半径 */
                spherecollider.radius = target_cube.meshFilter.sharedMesh.boundingSphere.radius;
                this.Lead_cube = target_cube;
            };
            let self = this;
            /* 读取Router表 */
            Laya.loader.load("res/router/Router.json", Laya.Handler.create(this, () => {
                /* 保存数据 */
                self.Router_game = Laya.Loader.getRes('res/router/Router.json').data;
                /* 绘制3D场景 */
                self.initScene();
                /* 渲染初始立方体 */
                self.RenderCube(30);
                /* 创建主角 */
                self.Lead();
                /* 初始化着力点 */
                self.Circular_point_obj();
                /* 执行摄像机动画 */
                self.cameraAnimation();
                /* 初始着力线 */
                self.ForceLineMain("init");
                /* 绘制第一个着力线 */
                //self.ForceLineMain("start");
                /* 事件入口 */
                self.eventSwitch();
                /* update */
                self.updata();
                /* 全局对象 */
                self.Global_obj();
            }), null, Laya.Loader.JSON);
        }
        // 根据角度控制主角位置
        Lead_angle_pos(angle) {
            let target_X = this.Circular_point.x + this.radius * Math.cos(this.angle * Math.PI / 180);
            let target_Y = this.Circular_point.y + this.radius * Math.sin(this.angle * Math.PI / 180);
            this.Lead_cube.transform.position = new Laya.Vector3(target_X, target_Y, 0);
        }
        // 控制主角下落
        Lead_animate() {
            let radian = this.Lead_radian;
            let step = this.Lead_step;
            let target = this.Lead_cube;
            let cos = Math.cos(radian * Math.PI / 180); //邻边比斜边,60度的话等于1/2
            let sin = Math.sin(radian * Math.PI / 180); //对边比斜边,30度的话等于1/2
            this.Lead_radian -= 5; //角度递减1
            var a = step;
            var c = (a / cos);
            var b = (sin * c);
            if (this.Lead_radian <= 0) {
                return;
            }
            target.transform.translate(new Laya.Vector3(a, -b, 0));
        }
        /**
         *
         *  updata
         *
         */
        updata() {
            let self = this;
            Laya.timer.frameLoop(1, this, () => {
                //主角加速
                if (self.accelerate) {
                    self.Lead_angle_pos(self.angle);
                    self.angle += self.angleSpeed;
                    self.angleSpeed += 0.01;
                    // 控制摄像机
                    self.LookAT(new Laya.Vector3(0.01, 0, -0.001));
                }
                //主角下坠
                if (self.whereabouts) {
                    self.Lead_animate();
                }
                // 主角循环运动控制
                if (self.LeadLoop) {
                    if (self.angle >= 310) {
                        self.Leaddirection = false;
                    }
                    else if (self.angle <= 230) {
                        self.Leaddirection = true;
                    }
                    ;
                    if (self.Leaddirection) {
                        // 顺时针
                        self.angle++;
                    }
                    else {
                        // 逆时针
                        self.angle--;
                    }
                    self.Lead_angle_pos(self.angle);
                }
            });
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
            window["LookAT"] = this.LookAT; // 摄像机监听
            window["foce"] = this.ForceLineObj; //着力线
        }
    }
    WetchGame.gameScene = gameScene;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=game.js.map