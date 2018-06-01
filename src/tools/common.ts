/* 当前场景 */
let VIEW = null;
/* 默认立方体的尺寸 */
let CubeSize = {X:0.8,Y:0.5,Z:5};
/* 立方体贴图 */
let cubeTexture = [
    [
        "res/image/five.png",
        "res/image/four.png"
    ]
]
/* 圆心贴图 */
let Circular_point_texture = [
   "res/image/five.png"
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
            console.log('当前节点是新建的');
            var box: Laya.MeshSprite3D = new Laya.MeshSprite3D(new Laya.BoxMesh(CubeSize.X, CubeSize.Y, CubeSize.Z)) as Laya.MeshSprite3D;
            var material: Laya.StandardMaterial = new Laya.StandardMaterial();
            material.diffuseTexture = Laya.Texture2D.load(cubeTexture[texture.Checkpoint][texture.imgType]);
            box.meshRender.material = material;
            return box;
        });
        return cube;
    },
    // 回收立方体
    pushCube:(target)=>{
        Laya.stage.removeChild(target);
        Laya.Pool.recover("cube",target);
    },
}