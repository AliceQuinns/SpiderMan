/* 当前场景 */
let VIEW = null;
/* 默认立方体的尺寸 */
let CubeSize = {X:0.8,Y:0.5,Z:5};
/* 初始着力线的尺寸 */
let CylinderMeshCube = {X:0.05,Y:1,Z:8}
/* 立方体贴图 */
let cubeTexture = [
    [
        "res/image/five.png",
        "res/image/four.png"
    ]
]
/* 圆柱体贴图 */
let CylinderMeshTexture = [
    "res/image/five.png",
    "res/image/four.png"
]
/* 着力点贴图 */
let Circular_point_texture = [
    "res/image/four.png"
]

var TOOLS = {
    // 切换场景并清空上级场景
    runScene: (scene,arg=null)=>{
        Laya.stage.removeChildren();
        Laya.stage.removeSelf();
        VIEW = new scene(arg);
    },
    // 获取立方体
    pullCube:(texture)=>{
        let cube = Laya.Pool.getItemByCreateFun("cube",()=>{
            var box: Laya.MeshSprite3D = new Laya.MeshSprite3D(new Laya.BoxMesh(CubeSize.X, CubeSize.Y, CubeSize.Z)) as Laya.MeshSprite3D;
            var material: Laya.StandardMaterial = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(cubeTexture[texture.Checkpoint][texture.imgType]);
            box.meshRender.material = material;
            return box;
        });
        return cube;
    },
    // 获取圆柱体
    getCylinderMesh:(texture)=>{
        let cube = Laya.Pool.getItemByCreateFun("CylinderMesh",()=>{
            var box: Laya.MeshSprite3D = new Laya.MeshSprite3D(new Laya.CylinderMesh(CylinderMeshCube.X, CylinderMeshCube.Y, CylinderMeshCube.Z)) as Laya.MeshSprite3D;
            var material: Laya.StandardMaterial = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(CylinderMeshTexture[texture]);
            box.meshRender.material = material;
            return box;
        });
        return cube;
    },
    // 回收
    pushCube:(type,target)=>{
        Laya.stage.removeChild(target);
        Laya.Pool.recover(type,target);
    },
    // 获取两个坐标间的距离
    getline:(coordinateA,coordinateB)=>{
        let point = new laya.maths.Point(coordinateA.x,coordinateA.y);
        return point.distance(coordinateB.x,coordinateB.y); 
    }
}