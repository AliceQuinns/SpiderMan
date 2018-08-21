// 方块 道具
var WetchGame;
(function (WetchGame) {
    class Propobj {
        constructor(ctx) {
            this.CubeLength = 20;
            this.CubeSize = { X: 0.8, Y: 0.5, Z: 5 };
            this.Cubelist = []; // 方块池
            this.proplist = []; // 道具池
            this.haloObj = null; // 光环
            this.texturelist = [
                [
                    "res/image/color/1.png",
                    "res/image/color/1-1.png"
                ],
                [
                    "res/image/color/2.png",
                    "res/image/color/2-2.png"
                ],
                [
                    "res/image/color/3.png",
                    "res/image/color/3-3.png"
                ],
                [
                    "res/image/color/4.png",
                    "res/image/color/4-4.png"
                ],
            ];
            // 道具
            this.balltexture = [
                "https://shop.yunfanshidai.com/xcxht/pqxcx/conf/prop/Sign_1.lh",
                "https://shop.yunfanshidai.com/xcxht/pqxcx/conf/prop/Sign_2.lh",
                "https://shop.yunfanshidai.com/xcxht/pqxcx/conf/prop/Sign_3.lh"
            ];
            // 光环
            this.haloTexture = [
                "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Halo2.lh"
            ];
            // 激光线
            this._line = [
                "https://shop.yunfanshidai.com/xcxht/pqxcx/model/line/Cube.lh"
            ];
            this.init = () => {
                var box2 = Laya.Sprite3D.load(this._line[0]);
                // var box2: Laya.Sprite3D = Laya.Sprite3D.load("res/model/line1.lh");
                box2.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                    box2.transform.position = new Laya.Vector3(0, 0, 0);
                });
                this.ctx.Game_scene.addChild(box2);
                // 创建方块队列
                let list = [[], []];
                for (let i = this.CubeLength; i--;) {
                    if (i < this.CubeLength / 2) {
                        list[0].push(this.createCube("bottom"));
                    }
                    else {
                        list[1].push(this.createCube("top"));
                    }
                }
                // 创建道具队列
                for (let i = 0; i < this.balltexture.length; i++) {
                    let obj = [];
                    for (let j = 0; j < 2; j++) {
                        var sprite3D = Laya.Sprite3D.load(this.balltexture[i]);
                        sprite3D.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                            sprite3D.transform.localScale = new Laya.Vector3(0.1, 0.1, 0.1);
                        });
                        obj.push(sprite3D);
                    }
                    this.proplist.push(obj);
                }
                console.log(this.proplist);
                this.Laserline = box2;
                this.Cubelist = list;
            };
            // 光环
            this.halo = (type, pos = null, texture = null) => {
                if (type === "add") {
                    if (!!this.haloObj) {
                        this.haloObj.transform.position = pos;
                        if (!this.haloObj.displayedInStage)
                            this.ctx.Game_scene.addChild(halo_obj);
                    }
                    else {
                        var halo_obj = Laya.Sprite3D.load(this.haloTexture[texture]);
                        halo_obj.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                            halo_obj.transform.position = pos;
                        });
                        if (!halo_obj.displayedInStage)
                            this.ctx.Game_scene.addChild(halo_obj);
                        this.haloObj = halo_obj;
                    }
                }
                else if (type === "delete") {
                    if (!!this.haloObj) {
                        this.haloObj.destroy();
                    }
                }
                return this.haloObj;
            };
            // 创建立方体
            this.createCube = type => {
                let box = new Laya.MeshSprite3D(new Laya.BoxMesh(this.CubeSize.X, this.CubeSize.Y, this.CubeSize.Z));
                let material = new Laya.StandardMaterial();
                if (type === "top") {
                    material.diffuseTexture = Laya.Texture2D.load(this.texturelist[1][0]);
                }
                else if (type === "bottom") {
                    material.diffuseTexture = Laya.Texture2D.load(this.texturelist[1][1]);
                }
                box.meshRender.material = material;
                return box;
            };
            // 获取立方体
            this.pullcube = type => {
                let data;
                if (type === "top") {
                    data = this.Cubelist[1].shift();
                    this.Cubelist[1].push(data);
                }
                else if (type === "bottom") {
                    data = this.Cubelist[0].shift();
                    this.Cubelist[0].push(data);
                }
                data.transform.position = new Laya.Vector3(0, 0, 0);
                return data;
            };
            // 旋转动画
            this.rotateadmin = data => {
                data.transform.rotate(new Laya.Vector3(0, 0.05, 0));
            };
            // 添加道具
            this.getProp = (type, pos) => {
                let target = this.proplist[type].shift();
                target.transform.localScale = (new Laya.Vector3(0.3, 0.3, 0.3));
                target.clearTimer(this, this.rotateadmin);
                this.proplist[type].push(target);
                target.transform.position = pos;
                if (!target.displayedInStage)
                    this.ctx.Game_scene.addChild(target);
                target.frameLoop(2, this, this.rotateadmin, [target]);
                return target;
            };
            this.ctx = ctx;
        }
    }
    WetchGame.Propobj = Propobj;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=obj.js.map