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

        Laya.stage.scaleMode = "fixedwidth";
        Laya.stage.screenMode = "none";

        //开启统计信息
       // Laya.Stat.show();

        // 初始化场景
        TOOLS.runScene(WetchGame.gameScene);
    }
}
new LayaAir3D();