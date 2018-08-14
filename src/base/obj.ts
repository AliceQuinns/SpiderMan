// 方块 激光线 道具对象
module WetchGame {
    export class Propobj {
        private ctx;
        public CubeLength:number = 20;
        public Laserpoint;
        public Laserline;
        public CubeSize = { X: 0.8, Y: 0.5, Z: 5 };
        private Cubelist;// 方块池
        private proplist;// 道具池
        private texturelist = [
            "res/image/color/stone.png",
            "res/image/color/stone2.png"
        ];
        // 道具
        private balltexture = [
            "res/image/model/ball/Ball1.lh",
            "res/image/model/ball/Ball2.lh",
            "res/image/model/ball/Ball3.lh",
            "res/image/model/ball/Ball4.lh",
            "res/image/model/ball/Ball5.lh",
        ]

        constructor(ctx) {
            this.ctx = ctx;
        }

        public init = () => {

            // 创建激光点
            var box1: Laya.MeshSprite3D = this.ctx.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1))) as Laya.MeshSprite3D;
            var material: Laya.StandardMaterial = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
            box1.meshRender.material = material;
            box1.transform.position = new Laya.Vector3(0, 0, 0);

            // 创建激光线
            var box2: Laya.MeshSprite3D = new Laya.MeshSprite3D(new Laya.CylinderMesh(CylinderMeshCube.X, CylinderMeshCube.Y, CylinderMeshCube.Z)) as Laya.MeshSprite3D;
            var material: Laya.StandardMaterial = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(CylinderMeshTexture[0]); 
            material.albedo = new Laya.Vector4(1, 1, 2, 0.3);
            material.renderMode = Laya.StandardMaterial.RENDERMODE_DEPTHREAD_TRANSPARENTDOUBLEFACE;
            box2.meshRender.material = material;

            // 创建方块仓库队列
            var list = [[],[]];
            for(let i =this.CubeLength;i--;){
                if(i<this.CubeLength/2){
                    list[0].push(this.createCube("bottom"));
                } else {
                    list[1].push(this.createCube("top"));                    
                }
            }
            
            this.Laserpoint = box1;
            this.Laserline = box2;
            this.Cubelist = list;
        }

        // 创建立方体
        private createCube = type => {
            let box: Laya.MeshSprite3D = new Laya.MeshSprite3D(new Laya.BoxMesh(this.CubeSize.X, this.CubeSize.Y, this.CubeSize.Z)) as Laya.MeshSprite3D;
            let material: Laya.StandardMaterial = new Laya.StandardMaterial();
            if(type === "top"){
                material.diffuseTexture = Laya.Texture2D.load(this.texturelist[0]);                
            } else if(type === "bottom") {
                material.diffuseTexture = Laya.Texture2D.load(this.texturelist[1]);                
            }
            box.meshRender.material = material;
            return box;
        }

        // 获取立方体
        public pullcube = type => {
            let data;
            if(type === "top"){
                data = this.Cubelist[1].shift();
                this.Cubelist[1].push(data);
            }else if(type === "bottom"){
                data = this.Cubelist[0].shift();
                this.Cubelist[0].push(data);
            }
            data.transform.position = new Laya.Vector3(0,0,0);
            return data;            
        }

        public renderLaser = data => {

        }
       

    }
}