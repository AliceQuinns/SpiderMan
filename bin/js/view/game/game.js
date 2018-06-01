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
            this.Circular_point = new Laya.Vector3(2, 6, 0); // 主角运动圆心
            this.radius = 1; // 主角运动圆半径
            this.angle = 225; // 主角当前角度
            this.angleSpeed = 2; // 弧形加速度
            this.Circular_obj = null; // 圆心节点
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
            // 控制圆心位置
            this.Rend_Circular_point = (pos) => {
                this.Circular_obj.transform.position = new Laya.Vector3(pos.x, pos.y, 0);
            };
            // 初始化圆心
            this.Circular_point_obj = () => {
                var box = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
                box.meshRender.material = material;
                box.transform.position = new Laya.Vector3(0, 0, 0);
                this.Circular_obj = box;
            };
            // 摄像机动画
            this.cameraAnimation = () => {
                let anim = () => { this.camera.transform.translate(new Laya.Vector3(-0.08, -0.04, 0)); };
                Laya.timer.loop(10, this, anim);
                window.setTimeout(() => {
                    /* 关闭动画 */
                    Laya.timer.clear(this, anim);
                }, 1000);
            };
            // 开启摄像机监听
            this.LookAT = (office) => {
                this.camera.transform.translate(office);
            };
            // 解析配置表
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
                    let Box_X = (index + 1) / 2 * CubeSize.X;
                    let Box_Y = CubeSize.Z + height + ((CubeSize.Z / 2) + Number(this.Router_game[index - 1].hp));
                    box.transform.translate(new Laya.Vector3(Box_X, Box_Y, 0));
                }
            };
            // 创建主角
            this.Lead = () => {
                let target_cube = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.1, 8, 8)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load("res/image/two.png");
                target_cube.meshRender.material = material;
                target_cube.transform.position = new Laya.Vector3(0.8, 7, 0);
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
                /* 初始化圆心 */
                self.Circular_point_obj();
                // 执行摄像机动画
                self.cameraAnimation();
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
        // 全局变量转换接口
        Global_obj() {
            window['Lead'] = this.Lead_cube; // 主角
            window["camera"] = this.camera; // 摄像机
            window["LookAT"] = this.LookAT; // 摄像机监听
        }
    }
    WetchGame.gameScene = gameScene;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=game.js.map