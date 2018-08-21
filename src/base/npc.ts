// 主角类
module WetchGame {
    export class npc {
        private ctx;
        public ME: Laya.Sprite3D// 主角对象
        private admincomeout;
        public skinURL = [
            "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead1.lh",
            "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead2.lh",
            "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead3.lh",
            "https://shop.yunfanshidai.com/xcxht/pqxcx/model/Lead4.lh"
        ]
        private _over = [
            "https://shop.yunfanshidai.com/xcxht/pqxcx/model/over.lh"
        ]

        constructor(ctx) {
            this.ctx = ctx;
        }
        public init = (data) => {
            if (!data || !("skin" in data) || !("scene" in data)) {
                console.log("error =>class npc", "参数不对");
            } else {
                var sprite3D: Laya.Sprite3D = Laya.Sprite3D.load(this.skinURL[data.skin]);
                this.ME = sprite3D;
                sprite3D.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                    sprite3D.transform.position = new Laya.Vector3(0.8, 9, 0);
                    sprite3D.transform.localScale = new Laya.Vector3(0.1, 0.1, 0.1);
                });
                data.scene.addChild(this.ME);
            }
        }

        public comeout = (data, callback = null) => {
            // 主角出场动画
            if (!!this.admincomeout) return;
            var target = data.transform.position.y - 7, value = 0;
            var a = window.setInterval(() => {
                value += 0.01;
                if (value >= target) {
                    if (!!callback) callback();
                    window.clearInterval(a);
                    data.transform.localRotationEuler = new Laya.Vector3(0, 0, 0);
                    data.transform.position = new Laya.Vector3(0.8, 7, 0);
                }
                data.transform.translate(new Laya.Vector3(0, -0.01, 0));
                data.transform.rotate(new Laya.Vector3(0, -0.03, 0));
            }, 1)
            this.admincomeout = a;
        }

        public over = (data,callback) => {
            this.ME.transform.position = new Laya.Vector3(0.8, 7, 0);
            var sprite3D: Laya.Sprite3D = Laya.Sprite3D.load(this._over[0]);
            sprite3D.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                sprite3D.transform.position = data;
                if(!!callback)callback();
            });
            this.ctx.Game_scene.scene.addChild(sprite3D);
        }
        public skinRender = data => {

        }
        public Destroy = data => {

        }
    }
}