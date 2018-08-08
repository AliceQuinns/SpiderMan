/**
 *   主角类
 *   
 */
module WetchGame{
    export class npc{
        private ctx:Object
        private ME:Object
        private skin:Object
        private skingroup:Array<string>
        constructor(ctx:Object,skingroup:Array<string>=null){
            this.ctx = ctx;
            this.skingroup = skingroup;
        }
        public init= (target:any=this.ctx,skin:number=null) =>{
            let target_cube = target.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.15, 8, 8))) as Laya.MeshSprite3D;
            var material: Laya.StandardMaterial = new Laya.StandardMaterial();
            if(!!skin){
                material.diffuseTexture = Laya.Texture2D.load(this.skingroup[skin]);                
            }else{
                material.diffuseTexture = Laya.Texture2D.load("res/image/color/football.jpg");
            }
                target_cube.meshRender.material = material;
                target_cube.transform.position = new Laya.Vector3(0.8,7,0);
                return target_cube;
        }
        public over = data => {
            
        }
        public skinRender = data => {

        }
        public Destroy = data => {
            
        }
    }
}