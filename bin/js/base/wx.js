const wx = window["wx"];
var WetchGame;
(function (WetchGame) {
    class Wetch {
        constructor(ctx) {
            this.main = () => {
                if (!wx)
                    return;
                let screenHeight = window.innerHeight;
                let screenWidth = window.innerWidth;
                let openDataContext = wx.getOpenDataContext();
                let sharedCanvas = openDataContext.canvas;
                let ratio = wx.getSystemInfoSync().pixelRatio;
                sharedCanvas.width = screenWidth * ratio;
                sharedCanvas.height = screenHeight * ratio;
                var sprite = new Laya.Sprite();
                sprite.pos(0, 0);
                this.render = sprite;
                let self = this;
                wx.request({
                    url: 'https://shop.yunfanshidai.com/xcxht/bigbattle/api/share_info.php?gameid=18',
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                        // console.log(res.data);
                        // 主动转发
                        self.share = () => {
                            wx.shareAppMessage(function () {
                                return {
                                    title: res.data.info,
                                    imageUrl: res.data.image
                                };
                            });
                        };
                        // 被动转发
                        wx.showShareMenu({ withShareTicket: true });
                        wx.onShareAppMessage(function () {
                            return {
                                title: res.data.info,
                                imageUrl: res.data.image
                            };
                        });
                    }
                });
                wx.setPreferredFramesPerSecond(60);
                let bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-d707f0634076fb0b',
                    style: {
                        left: 0,
                        top: 500,
                        width: window.innerWidth
                    }
                });
                let videoAd = wx.createRewardedVideoAd({
                    adUnitId: 'adunit-68bfd9849e874c25'
                });
                this.bannerAd = bannerAd;
                this.videoAd = videoAd;
                bannerAd.show();
                setTimeout(() => { bannerAd.style.top = window.innerHeight - bannerAd.style.realHeight; }, 1000);
            };
            // 排行榜
            this.list = () => {
                wx.postMessage({ type: 2 });
                this.render.clearTimer(this, this.callback);
                this.callback = () => {
                    console.log("排行榜");
                    var texture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                    this.render.graphics.drawTexture(texture, 0, 0, texture.width, texture.height);
                    Laya.stage.addChild(this.render);
                };
                this.render.timer.frameLoop(10, this, this.callback);
            };
            // 得分面板
            this.Scorelist = (score) => {
                wx.postMessage({ type: 1, data: { score: score } });
                this.render.clearTimer(this, this.callback);
                this.callback = () => {
                    console.log("得分面板");
                    var texture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                    this.render.graphics.drawTexture(texture, 0, 0, texture.width, texture.height);
                    Laya.stage.addChild(this.render);
                };
                this.render.timer.frameLoop(10, this, this.callback);
            };
            // 关闭渲染
            this.off = () => {
                this.render.clearTimer(this, this.callback);
                this.render.destroy();
            };
            // 主动分享
            this.share = () => {
            };
            this.main();
        }
    }
    WetchGame.Wetch = Wetch;
})(WetchGame || (WetchGame = {}));
//# sourceMappingURL=wx.js.map