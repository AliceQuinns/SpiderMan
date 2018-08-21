// 主角类
var WetchGame;
(function (WetchGame) {
    class npc {
        constructor(ctx) {
            this.skinURL = [
                "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead1.lh",
                "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead2.lh",
                "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead3.lh",
                "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead4.lh"
            ];
            this._over = [
                "https://shop.yunfanshidai.com/xcxht/pqxcx/model/over.lh"
            ];
            this.init = (data) => {
                if (!data || !("skin" in data) || !("scene" in data)) {
                    console.log("error =>class npc", "参数不对");
                }
                else {
                    var sprite3D = Laya.Sprite3D.load(this.skinURL[data.skin]);
                    this.ME = sprite3D;
                    sprite3D.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                        sprite3D.transform.position = new Laya.Vector3(0.8, 9, 0);
                        sprite3D.transform.localScale = new Laya.Vector3(0.1, 0.1, 0.1);
                    });
                    data.scene.addChild(this.ME);
                }
            };
            this.comeout = (data, callback = null) => {
                // 主角出场动画
                if (!!this.admincomeout)
                    return;
                var target = data.transform.position.y - 7, value = 0;
                var a = window.setInterval(() => {
                    value += 0.01;
                    if (value >= target) {
                        if (!!callback)
                            callback();
                        window.clearInterval(a);
                        data.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                        data.transform.position = new Laya.Vector3(0.8, 7, 0);
                    }
                    data.transform.translate(new Laya.Vector3(0, -0.01, 0));
                    data.transform.rotate(new Laya.Vector3(0, -0.03, 0));
                }, 1);
                this.admincomeout = a;
            };
            this.over = (data, callback) => {
                this.ME.transform.position = new Laya.Vector3(0.8, 7, 0);
                var sprite3D = Laya.Sprite3D.load(this._over[0]);
                sprite3D.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                    sprite3D.transform.position = data;
                    if (!!callback)
                        callback();
                });
                this.ctx.Game_scene.scene.addChild(sprite3D);
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