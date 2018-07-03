require("weapp-adapter.js");
require("./code.js");
window.pushScore = (types, data) => {
  console.log(types, data);
  wx.postMessage({ type: types, data: data });
};
Laya.Browser.window.sharedCanvas.width = Laya.stage.width;
Laya.Browser.window.sharedCanvas.height = Laya.stage.height;
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