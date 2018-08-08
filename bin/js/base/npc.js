/**
 *   主角类
 *
 */
var WetchGame;
(function (WetchGame) {
    class npc {
        constructor(ctx, skingroup = null) {
            this.init = (target = this.ctx, skin = null) => {
                let target_cube = target.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.15, 8, 8)));
                var material = new Laya.StandardMaterial();
                if (!!skin) {
                    material.diffuseTexture = Laya.Texture2D.load(this.skingroup[skin]);
                }
                else {
                    material.diffuseTexture = Laya.Texture2D.load("res/image/color/football.jpg");
                }
                target_cube.meshRender.material = material;
                target_cube.transform.position = new Laya.Vector3(0.8, 7, 0);
                return target_cube;
            };
            this.over = data => {
            };
            this.skinRender = data => {
            };
            this.Destroy = data => {
            };
            this.ctx = ctx;
            this.skingroup = skingroup;
        }
    }
    WetchGame.npc = npc;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=npc.js.map