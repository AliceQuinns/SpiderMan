// 程序入口
class LayaAir3D {
    constructor() {
        //初始化微信小游戏
        Laya.MiniAdpter.init();
        //初始化引擎
        Laya3D.init(720, 1280, true);
        //适配模式
        Laya.stage.alignV = "middle";
        Laya.stage.alignH = "center";
        Laya.stage.scaleMode = "exactfit";
        Laya.stage.screenMode = "vertical";
        //开启统计信息
        //Laya.Stat.show();
        // 进入game场景
        TOOLS.runScene(WetchGame.gameScene);
    }
}
new LayaAir3D();
//# sourceMappingURL=LayaAir3D.js.map