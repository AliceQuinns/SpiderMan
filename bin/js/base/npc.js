// 主角类
var WetchGame;
(function (WetchGame) {
    class npc {
        constructor(ctx) {
            this.init = (data) => {
                if (!data || !("skin" in data) || !("scene" in data)) {
                    console.log("error =>class npc", "参数不对");
                }
                else {
                    var sprite3D = Laya.Sprite3D.load(data.skin);
                    this.ME = sprite3D;
                    sprite3D.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                        sprite3D.transform.position = new Laya.Vector3(0.8, 7, 0);
                        sprite3D.transform.localScale = new Laya.Vector3(.1, .1, .1);
                    });
                    data.scene.addChild(this.ME);
                }
            };
            this.over = data => {
            };
            this.skinRender = data => {
            };
            this.Destroy = data => {
            };
            this.ctx = ctx;
        }
    }
    WetchGame.npc = npc;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=npc.js.map