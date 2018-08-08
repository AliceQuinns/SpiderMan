require("weapp-adapter.js");
require("./code.js");
window.pushScore = (data) => {
  console.log(data);
  wx.postMessage(data);
};
let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
let openDataContext = wx.getOpenDataContext();
let sharedCanvas = openDataContext.canvas;
let ratio = wx.getSystemInfoSync().pixelRatio;
sharedCanvas.width = screenWidth * ratio;
sharedCanvas.height = screenHeight * ratio;
// Laya.Browser.window.sharedCanvas.width = Laya.Browser.window.sharedCanvas.width * wx.getSystemInfoSync().pixelRatio;
// Laya.Browser.window.sharedCanvas.height = Laya.Browser.window.sharedCanvas.height * wx.getSystemInfoSync().pixelRatio;
// 请求转发信息
wx.request({
  url: 'https://shop.yunfanshidai.com/xcxht/bigbattle/api/share_info.php?gameid=18',
  header: {
    'content-type': 'application/json' // 默认值
  },
  success: function (res) {
    console.log(res.data);
    // 主动转发
    window.share=()=>{
      wx.shareAppMessage(function () {
        return {
          title: res.data.info,
          imageUrl: res.data.image
        }
      });
    };
    // 被动转发
    wx.showShareMenu({ withShareTicket: true });
    wx.onShareAppMessage(function () {
      return {
        title: res.data.info,
        imageUrl: res.data.image
      }
    });
  }
})

wx.setPreferredFramesPerSecond(60);
let bannerAd = wx.createBannerAd({
  adUnitId: 'adunit-d707f0634076fb0b',
    style: {
    left: 0,
    top: 500,
    width: window.innerWidth
  }
});
window.bannerAd = bannerAd;
console.log(bannerAd);
bannerAd.show();
setTimeout(() => { bannerAd.style.top = window.innerHeight - bannerAd.style.realHeight;},1000);
let videoAd = wx.createRewardedVideoAd({
  adUnitId: 'adunit-68bfd9849e874c25'
})

videoAd.load()
  .then(() => videoAd.show())
  .catch(err => console.log(err.errMsg))
  videoAd.show();