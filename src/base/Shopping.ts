// 商城 
module WetchGame {
    export class Shopping {
        private ctx;
        private skin;
        private objpool = [];// 对象池
        constructor(ctx) {
            this.ctx = ctx;
            // this.skin = ctx.npc.skinURL;
            // console.log(ctx.npc.skinURL);
            // Laya.loader.create(this.skin, Laya.Handler.create(this, this.main));
        }

        private main = () => {
            for (let i = 0; i < this.skin.length; i++) {
                console.log(this.skin[i]);
                // let sprite3D: Laya.Sprite3D = Laya.loader.getRes(this.skin[i].url);
                // this.objpool.push(sprite3D);
            }
            // console.log(this.objpool);
        }

        // 开启商城界面
        public renderUI = (data = null,callback = null) => {
            this.ctx.animationobj.moveto(this.ctx.camera, new Laya.Vector3(-3, 30, 18), 1, () => {
                if(!!callback)callback();
            });
        }

        // 清空资源并回收
        public delete = data => {

        }

    }
}