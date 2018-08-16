// 主角类
module WetchGame {
    export class npc {
        private ctx;
        public ME: Laya.Sprite3D// 主角对象
        private skinURL: string // 资源地址
        constructor(ctx) {
            this.ctx = ctx;
        }
        public init = (data) => {
            if (!data || !("skin" in data) || !("scene" in data)) {
                console.log("error =>class npc", "参数不对");
            } else {
                var sprite3D: Laya.Sprite3D = Laya.Sprite3D.load(data.skin);
                this.ME = sprite3D;
                sprite3D.on(Laya.Event.HIERARCHY_LOADED, this, () => {
                    sprite3D.transform.position = new Laya.Vector3(0,0,0);
                });
                data.scene.addChild(this.ME);
            }
        }
        public over = data => {

        }
        public skinRender = data => {

        }
        public Destroy = data => {

        }
    }
}