// 状态与资源控制类
module WetchGame{
    export class gameState{
        private npc;//主角状态
        constructor(ctx){
            this._init();
        }
        private _init(){
            // 主角状态
            this.npc = {
                // 皮肤资源
                LEADSKIN: {
                    car1: {
                        model: "res/image/model/carModel/car1.lh",
                        img: "",
                    },
                    car2: {
                        model: "res/image/model/carModel/car2.lh",
                        img: "",
                    },
                    car3: {
                        model: "res/image/model/carModel/car3.lh",
                        img: "",
                    }
                },
                boundingBoxSize: new Laya.Vector3(0.8,7,0),
                statpos: new Laya.Vector3(0.8,7,0)// 初始位置
            }
            // 方块状态
        }
        public get(type:string){
            if(type === "npc"){
                return this.npc;
            }
        }
        public set(){

        }
    }
}