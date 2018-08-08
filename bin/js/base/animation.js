// 动画ui类
var WetchGame;
(function (WetchGame) {
    class animationUI {
        constructor(ctx) {
            // 复活倒计时动画
            this.CountDown = (data = null) => {
                let _size = {
                    btn1: { w: Laya.stage.width / 2.5, h: Laya.stage.width / 2.5 },
                }, _time = 500;
                let target = new Laya.Sprite();
                target.size(_size.btn1.w, _size.btn1.h);
                target.pos(Laya.stage.width / 2 - _size.btn1.w / 2, Laya.stage.height / 4 - _size.btn1.h / 2);
                target.zOrder = 101;
                target.alpha = .9;
                var img = new Laya.Sprite();
                img.zOrder = 101;
                img.loadImage("res/image/color/play_again.png");
                img.size(_size.btn1.w, _size.btn1.h / 2);
                img.pos(Laya.stage.width / 2 - _size.btn1.w / 2, Laya.stage.height / 1.5 - _size.btn1.h / 2);
                let mask = new Laya.Sprite();
                mask.alpha = .5;
                mask.zOrder = 99;
                mask.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
                Laya.stage.addChild(img);
                Laya.stage.addChild(target);
                Laya.stage.addChild(mask);
                target.on(Laya.Event.CLICK, this, () => {
                    console.log("复活");
                });
                img.on(Laya.Event.CLICK, this, () => {
                    console.log("跳过");
                });
                // 圆环转动
                let fun = () => {
                    _time -= 1;
                    target.graphics.clear();
                    target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, "#cccccc"); // 背景
                    target.graphics.drawPie(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2, 0, 360 * (_time / 500), "#1fbb25"); // 进度环
                    target.graphics.drawCircle(_size.btn1.w / 2, _size.btn1.h / 2, _size.btn1.w / 2 - 40, "#ffffff");
                    target.graphics.fillText("复活", _size.btn1.w / 2, _size.btn1.h / 2.5, "40px SimHei", "#1fbb25", "center");
                    if (_time <= 1) {
                        Laya.timer.clear(this, fun);
                        if (!!data && "callback" in data)
                            data.callback();
                        target.offAll(Laya.Event.CLICK);
                        img.offAll(Laya.Event.CLICK);
                        target.destroy();
                        img.destroy();
                        mask.destroy();
                        return;
                    }
                };
                Laya.timer.frameLoop(1, this, fun);
            };
            // 渐变遮罩
            this.mask = (data = null) => {
                if (!data)
                    return;
                if (!this.maskobj) {
                    console.log("新建mask对象");
                    this.maskobj = new Laya.Sprite();
                    this.maskobj.size(Laya.stage.width, Laya.stage.height);
                    this.maskobj.pos(0, 0);
                    Laya.stage.addChild(this.maskobj);
                }
                if (data.type === 1) {
                }
                else if (data.type === 2) {
                }
                else if (data.type === 3) {
                }
                else if (data.type === 4) {
                    console.log("删除mask对象");
                    Laya.stage.removeChild(this.maskobj);
                    this.maskobj.destroy();
                }
            };
            this.ctx = ctx;
        }
    }
    WetchGame.animationUI = animationUI;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=animation.js.map