// 方块 激光线 道具对象
var WetchGame;
(function (WetchGame) {
    class Propobj {
        constructor(ctx) {
            this.CubeLength = 20;
            this.CubeSize = { X: 0.8, Y: 0.5, Z: 5 };
            this.texturelist = [
                "res/image/color/stone.png",
                "res/image/color/stone2.png"
            ];
            // 道具
            this.balltexture = [
                "res/image/model/ball/Ball1.lh",
                "res/image/model/ball/Ball2.lh",
                "res/image/model/ball/Ball3.lh",
                "res/image/model/ball/Ball4.lh",
                "res/image/model/ball/Ball5.lh",
            ];
            this.init = () => {
                // 创建激光点
                var box1 = this.ctx.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1)));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
                box1.meshRender.material = material;
                box1.transform.position = new Laya.Vector3(0, 0, 0);
                // 创建激光线
                var box2 = new Laya.MeshSprite3D(new Laya.CylinderMesh(CylinderMeshCube.X, CylinderMeshCube.Y, CylinderMeshCube.Z));
                var material = new Laya.StandardMaterial();
                material.diffuseTexture = Laya.Texture2D.load(CylinderMeshTexture[0]);
                material.albedo = new Laya.Vector4(1, 1, 2, 0.3);
                material.renderMode = Laya.StandardMaterial.RENDERMODE_DEPTHREAD_TRANSPARENTDOUBLEFACE;
                box2.meshRender.material = material;
                // 创建方块仓库队列
                var list = [[], []];
                for (let i = this.CubeLength; i--;) {
                    if (i < this.CubeLength / 2) {
                        list[0].push(this.createCube("bottom"));
                    }
                    else {
                        list[1].push(this.createCube("top"));
                    }
                }
                this.Laserpoint = box1;
                this.Laserline = box2;
                this.Cubelist = list;
            };
            // 创建立方体
            this.createCube = type => {
                let box = new Laya.MeshSprite3D(new Laya.BoxMesh(this.CubeSize.X, this.CubeSize.Y, this.CubeSize.Z));
                let material = new Laya.StandardMaterial();
                if (type === "top") {
                    material.diffuseTexture = Laya.Texture2D.load(this.texturelist[0]);
                }
                else if (type === "bottom") {
                    material.diffuseTexture = Laya.Texture2D.load(this.texturelist[1]);
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
            this.renderLaser = data => {
            };
            this.ctx = ctx;
        }
    }
    WetchGame.Propobj = Propobj;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=obj.js.map