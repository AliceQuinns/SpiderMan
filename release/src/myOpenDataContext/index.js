let sharedCanvas = wx.getSharedCanvas();
let context = sharedCanvas.getContext("2d");

let itemCanvas = wx.createCanvas();
let ctx = itemCanvas.getContext('2d');

const screenWidth = wx.getSystemInfoSync().screenWidth;
const screenHeight = wx.getSystemInfoSync().screenHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;

let myScore = 0;// 最高分数
let myInfo = null;// 玩家信息
let myRank = null;// 玩家名次
let _renderStatus = 0;//渲染状态
let myself = {};// 玩家自身信息
let _score =0;//当前分数
let _ranking = null;//比分数据记录

let _SIZE = {
    w: 750,
    h: 1280,
    direction: 1 //1竖屏 0横屏
}

// 横竖版切换
direction();

let OBJsize = {
    // 好友排行与群排行ui
    frends: {
        width: _SIZE.direction?590:640,
        height: _SIZE.direction?620:420,
        top: _SIZE.direction?300:120,// Y轴坐标
        left: _SIZE.direction?80:320,// X轴坐标
        titleColor: "#302f30"// “好友排行” 背景色
    },
    // 得分面板主背景
    bg: {
        w: _SIZE.direction?590:433,
        h: _SIZE.direction?620:379,
        x: _SIZE.direction?80:423.5,
        y: _SIZE.direction?350:193
    },
    // 得分面板子背景
    bg1: {
        w: _SIZE.direction?531:400,
        h: _SIZE.direction?310:192,
        x: _SIZE.direction?80+(590-531)/2:439.5,
        y: _SIZE.direction?350+620-310-20:357
    },
    // 得分面板玩家头像
    item1: {
        w: _SIZE.direction?Math.round(150):Math.round(100),
        h: _SIZE.direction?Math.round(150):Math.round(100)
    },
};

let _match_content = {
    initData: [],// 待超越好友
    status: false,
    width: _SIZE.direction?120:90,
    height: _SIZE.direction?170:150,
    top: _SIZE.direction?150:100,
    left: _SIZE.direction?630:1190,
    score: 0 // 玩家实时分数
};


// 初始化
let init =()=>{
  context.restore();
  context.scale(ratio, ratio);
  context.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
  let scales = screenWidth / _SIZE.w;
  context.scale(scales, scales);
  getUserInfo();
  event();
  touch();
  getTimeFriend();
}

// 横竖屏判断
function direction(){
    if(screenWidth>screenHeight){
        _SIZE.w = [_SIZE.h,[_SIZE.h = _SIZE.h=_SIZE.w]][0];
        _SIZE.direction = 0;
    }
}

// 获取全部待超越好友数据
let getTimeFriend=()=>{
    if(!myInfo||myInfo==null)getUserInfo();
    getFriendsRanking("score",(data)=>{
        _match_content.initData = data;
    });
}

// 分析下一个待超越好友
function scorecompare(){
    let a = _match_content.initData.findIndex(item=>{
        return Number(item.score)<Number(_match_content.score);
    })
    if(_ranking===a){console.log("待超越玩家未改变");return false;};
    _ranking = a;
    if(a === -1){
        return {data:_match_content.initData[_match_content.initData.length-1],type:1};
    }else if(a === 0){
        return {data:myInfo,type:2,score:_match_content.score};
    }else{
        return {data:_match_content.initData[a-1],type:1};
    }
}

// 渲染函数
function render(type,data) {
    if(type!==4)_renderStatus = type;// 切换渲染状态
    context.restore();// 状态还原
    // 得分面板
    if(type === 1){
        context.clearRect(0, 0, _SIZE.w, _SIZE.h);//清空像素
        context.save();
        let _size = OBJsize;// 坐标矩阵
        getMyScore(()=>{
            // 背景
            let bg = wx.createImage();
            bg.src = "tips/bg.png";
            bg.onload = function(){
                context.drawImage(bg, _size.bg.x, _size.bg.y, _size.bg.w, _size.bg.h);
                // 子背景
                let bg1 = wx.createImage();
                bg1.src = "tips/bg1.png";
                bg1.onload =function(){
                    //console.log(_size.bg1)
                    context.drawImage(bg1, _size.bg1.x, _size.bg1.y, _size.bg1.w,_size.bg1.h);
                    //context.font = "14px";
                    // 分数
                    context.font = _SIZE.direction? "160px Arial": "100px Arial";
                    context.textAlign="center";
                    context.textBaseline="middle";
                    // 阴影字体
                    context.fillStyle  = "#573300";
                    context.fillText(`${_score}`, _size.bg1.x+_size.bg1.w/2, _size.bg.y+(_SIZE.direction?120:70));
                    // 实际字体
                    context.fillStyle  = "#fdf1d3";
                    context.fillText(`${_score}`, _size.bg1.x+_size.bg1.w/2, _size.bg.y+(_SIZE.direction?110:60));
                    // 最高分
                    context.font = _SIZE.direction?"40px Arial":"28px Arial";
                    context.fillStyle  = "#573300";
                    context.fillText(`最佳记录: ${myScore}`, _size.bg1.x+_size.bg1.w/2,  Math.round(_size.bg.y+(_SIZE.direction?225:135)));
                    // 头像渲染
                    itemRender(3);
                };
            };
        });
        context.restore();
    }
    // 好友排行榜
    else if(type === 2){
        context.clearRect(0, 0, _SIZE.w, _SIZE.h);//清空像素
        getFriendsRanking("render");// 绘制好友排行榜
    }
    // 群排行榜
    else if(type === 3){
        context.clearRect(0, 0, _SIZE.w, _SIZE.h);//清空像素
        initRanklist(sortByScore(data),3);// 群排行榜
    }
    // 比分
    else if(type === 4){
        let _ = scorecompare(); // 即将超越的玩家
        if(!!_||_renderStatus != 4){
            context.clearRect(0, 0, _SIZE.w, _SIZE.h);//清空像素
            _renderStatus = 4;// 切换渲染状态
            let header = wx.createImage();
            header.src = _.data.avatarUrl;
            header.onload = ()=>{
                context.clearRect(_match_content.left,_match_content.top,_match_content.width,_match_content.height);
                context.font = _SIZE.direction?'22px Arial':'18px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'alphabetic';
                // 背景
                context.fillStyle = "rgba(0,0,0,0.5)";
                context.fillRect(_match_content.left,_match_content.top,_match_content.width,_match_content.height);
                // 头像
                context.drawImage(header,_match_content.left+_match_content.width*.1,_match_content.top+35,_match_content.width*.8,_SIZE.direction?90:70);
                // 字体截取
                let name = _.data.nickname;//姓名
                if(_.type===2)name = _.data.nickName
                let fontWidth = context.measureText(name);
                // 限制字体宽度
                var filterFont =()=>{
                    if(fontWidth.width>=_match_content.width){
                        name = name.slice(0,name.length-1);
                        fontWidth = context.measureText(name);
                        filterFont();
                    }
                };
                filterFont();
                context.fillStyle = '#ffffff';
                let title;
                _.type === 2?title="最高纪录":title="即将超越";
                context.fillText(title, _match_content.left+_match_content.width/2, _match_content.top+25);
                context.font = _SIZE.direction?'20px Arial':'16px Arial';
                context.fillText(name, _match_content.left+_match_content.width/2, _match_content.top+(_SIZE.direction?145:125));
                context.fillStyle = '#fcff0b';
                if(_.type === 2){
                    context.fillText(_match_content.score, _match_content.left+_match_content.width/2, _match_content.top+(_SIZE.direction?165:143));
                }else{
                    context.fillText(_.data.score, _match_content.left+_match_content.width/2, _match_content.top+(_SIZE.direction?165:143));
                }
            };
        }
    }
}

// 得分面板玩家渲染
function itemRender(size){
    // 得分渲染
    getFriendsRanking("score",(userdatas)=>{
        for(let i=0;i<size;i++){
            if(!userdatas||!userdatas[i])return;
            let imgPos = {
                x: OBJsize.bg1.x+(i+1)*(OBJsize.bg1.w-3*OBJsize.item1.w)/4+(i*OBJsize.item1.w),
                y: OBJsize.bg1.y+(_SIZE.direction?80:40)
            };
            let img = wx.createImage();
            img.src = userdatas[i].avatarUrl;
            img.onload = ()=>{
                if(_renderStatus !== 1){console.log("当前渲染状态已经改变=====状态为",_renderStatus);return;}                
                // 头像
                context.drawImage(
                    img,
                    imgPos.x,
                    imgPos.y,
                    OBJsize.item1.w,
                    OBJsize.item1.h
                );
                context.restore();
                // 名称
                let text = userdatas[i].nickname;
                if(text.length>=6)text = text.slice(0,5);
                // 姓名
                context.font = _SIZE.direction?"28px Arial":"15px Arial";
                context.textAlign="center";
                context.fillStyle  = "#fdf1d3";
                context.fillText(
                    `${text}`,
                    Math.round(imgPos.x+OBJsize.item1.w/2),
                    Math.round(OBJsize.item1.h+imgPos.y+(_SIZE.direction?20:20)));
                // 排名
                context.font = _SIZE.direction?"50px Arial":"25px Arial";
                context.fillText(
                    `${i+1}`,
                    Math.round(imgPos.x+OBJsize.item1.w/2),
                    Math.round(imgPos.y-(_SIZE.direction?40:20)));
                // 分数
                context.font = _SIZE.direction?"28px Arial":"15px Arial";
                context.fillStyle = "#fff7dd";
                context.fillText(
                    `${userdatas[i].score}`,
                    Math.round(imgPos.x+OBJsize.item1.w/2),
                    Math.round(OBJsize.item1.h+imgPos.y+(_SIZE.direction?50:40)));
                context.save();
            };
        }
    });
}

// 好友排行榜 群排行榜渲染
function initRanklist(list,type) {
    //console.log(list);
  if(Number(_renderStatus) != 2 && Number(_renderStatus) !=  3)return;
  let length = Math.max(list.length, _SIZE.direction?6:12);// 最少渲染6条或12条

  // 离屏canvas尺寸
  let itemHeight = _SIZE.direction?OBJsize.frends.width / 6:OBJsize.frends.width / 12;// 单行高度
  itemCanvas.width = OBJsize.frends.width;
  itemCanvas.height = itemHeight * length;

  // 用户背景框绘制
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      ctx.fillStyle = '#302f30';
    } else {
      ctx.fillStyle = '#393739';
    }
    ctx.fillRect(0, i * itemHeight, itemCanvas.width, itemHeight);
  }
  ctx.fillStyle = '#302f30';
  // 用户头像
  if (list && list.length > 0) {
    list.map((item, index) => {
      let avatar = wx.createImage();
      avatar.src = item.avatarUrl;
      avatar.onload = function () {
        let _y = _SIZE.direction?index * itemHeight + 14:index * itemHeight + 5;
        let _userSize = _SIZE.direction?70:40;
        ctx.drawImage(avatar, 100,  _y, _userSize, _userSize);
        reDrawItem(0);
      };
      ctx.fillStyle = '#ffffff';
      ctx.font = _SIZE.direction?'25px Arial':'20px Arial';
      ctx.textAlign = 'left';
      // 字体截取
      let name = item.nickname;//姓名
      if(name.length>=10)name = name.substr(0,10);
      // 姓名
      ctx.fillText(name, 190, _SIZE.direction?index * itemHeight + 58:index * itemHeight + 35);
      ctx.font = _SIZE.direction?'bold 30px Arial':'bold 25px Arial';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      // 分数
      ctx.fillText(item.score || 0, 550, _SIZE.direction?index * itemHeight + 60 :index * itemHeight + 35 );
      ctx.font = _SIZE.direction?'italic bold 30px Arial':'italic bold 25px Arial';
      ctx.fillStyle = '#cccccc';
      ctx.textAlign = 'center';
      if(index + 1 === 1){
            ctx.fillStyle = '#e76611';
      }else if(index + 1 === 2){
            ctx.fillStyle = '#dba046';
      }else if(index + 1 === 3){
            ctx.fillStyle = '#dbc631';
      }
      // 排名
      ctx.fillText(index + 1, 46, _SIZE.direction?index * itemHeight + 60 :index * itemHeight + 35)
    });
  } else {
    // 没有数据
  }
    if(type === 2){
        // 好友面板
        RoundRect(OBJsize.frends.left,OBJsize.frends.top,OBJsize.frends.width,100,30,context,OBJsize.frends.titleColor);//标题框
        context.fillStyle = '#ffffff';
        context.font = 'bold 30px Arial';
        context.textAlign = 'center';
        context.fillText('好友排行', _SIZE.w / 2, OBJsize.frends.top+40);
    }else if (type === 3){
        // 群排行
        RoundRect(OBJsize.frends.left,OBJsize.frends.top,OBJsize.frends.width,100,30,context,OBJsize.frends.titleColor);//标题框
        context.fillStyle = '#ffffff';
        context.font = 'bold 30px Arial';
        context.textAlign = 'center';
        context.fillText('群排行榜', _SIZE.w / 2, OBJsize.frends.top+40);
    }
    reDrawItem(0);
}

// 绘制自己的排名
function drawMyRank() {
  if (myInfo.avatarUrl && myScore) {
    let avatar = wx.createImage();
    avatar.src = myInfo.avatarUrl;
    avatar.onload = function () {
      context.drawImage(avatar, 180, 960 + 24, 70, 70);
    };
    context.fillStyle = '#fff';
    context.font = '28px Arial';
    context.textAlign = 'left';
    context.fillText(myInfo.nickName, 270, 960 + 72);
    context.font = 'bold 36px Arial';
    context.textAlign = 'right';
    context.fillText(myScore || 0, 630, 960 + 76);
    // 自己的名次
    if (myRank !== undefined) {
      context.font = 'italic 44px Arial';
      context.textAlign = 'center';
      context.fillText(myRank + 1, 126, 960 + 80);
    }
  }
}

// 渲染好友排行榜 canvas
function reDrawItem(y) {
  context.clearRect(OBJsize.frends.left, OBJsize.frends.top+60, OBJsize.frends.width, OBJsize.frends.height);// 清空
  context.fillStyle = '#302f30';// 背景色
  context.fillRect(OBJsize.frends.left, OBJsize.frends.top+60, OBJsize.frends.width, OBJsize.frends.height-30);// 矩形背景
  RoundRect(OBJsize.frends.left,OBJsize.frends.top+60,OBJsize.frends.width,OBJsize.frends.height,30,context,"#302f30");// 白色圆角矩形背景
  context.drawImage(itemCanvas, 0, y, OBJsize.frends.width, OBJsize.frends.height-30, OBJsize.frends.left, + OBJsize.frends.top+60, OBJsize.frends.width, OBJsize.frends.height-30);// 裁剪排行榜离屏canvas
}

// 快速排序
function sortByScore(data) {
    //console.log("源数据",data);
  let array = [];
  data.map(item => {
    array.push({
      avatarUrl: item.avatarUrl,
      nickname: item.nickname,
      openid: item.openid,
      score: item['KVDataList'][1] && item['KVDataList'][1].value != 'undefined' ? item['KVDataList'][1].value : (item['KVDataList'][0] ? item['KVDataList'][0].value : 0) // 取最高分
    })
  });
  //console.log("选取最高分",array);
  array.sort((a, b) => {
    return Number(b['score']) - Number(a['score']);
  });
  //console.log("排序好的数组",array);
  // 玩家名次
  myRank = array.findIndex((item) => {
    return item.nickname === myInfo.nickName && item.avatarUrl === myInfo.avatarUrl;
  });
  //console.log("玩家排名",myRank);
  if (myRank === -1)myRank = array.length;// 如果没有玩家数据则当作最后一名

  return array;
}

// 获取当前用户信息
function getUserInfo(callback) {
  wx.getUserInfo({
    openIdList: ['selfOpenId'],
    lang: 'zh_CN',
    success: res => {
        //console.log("玩家信息",res);
        myInfo = res.data[0];
        if(!!callback)callback(res);
    },
    fail: res => {
        console.log("!!!!注意无法获取好友数据");
    }
  })
}

// 更新当前玩家分数
function getMyScore(callback) {
  wx.getUserCloudStorage({
    keyList: ['score', 'maxScore'],
    success: res => {
      let data = res;
      let lastScore = _score;// 取当前分数
      // 新用户 
      if (!data.KVDataList[1]) {
        saveMaxScore(lastScore,true);// 创建新字段 
        myScore = lastScore;
      } else if (lastScore > Number(data.KVDataList[1].value)) {
        // 更新最高分
        saveMaxScore(lastScore);
        myScore = lastScore;
      } else {
      // 未超过最高分
        myScore = Number(data.KVDataList[1].value);
      }
      if(callback)callback();
    }
  });
}

// 修改最高分数
function saveMaxScore(maxScore,newUser) {
    // 如果是新用户则创建新字段
    let __ = [{ 'key': 'maxScore', 'value': ('' + maxScore) }];
    if(!!newUser)__ = [{ 'key': 'maxScore', 'value': ('' + maxScore) },{ 'key': 'score', 'value': ('' + maxScore) }];
    wx.setUserCloudStorage({
        KVDataList: __,
        success: res => {
          console.log(res,"已更新最高分");
        },
        fail: res => {
          console.log(res,"分数无法更新请检查appid权限");
        }
      });
}

// 好友排行榜
function getFriendsRanking(type,callback) {
  wx.getFriendCloudStorage({
    keyList: ['score', 'maxScore'],
    success: res => {
      let data = res.data;
      if(type === "render")initRanklist(sortByScore(data),2);
      if(!!callback)callback(sortByScore(data));// 传入排序后的好友数据
    },
    fail: err => {
        console.log(err,"无法获取好友信息");
    }
  });
}

// 获取群排行
function getGroupRanking(ticket) {
  wx.getGroupCloudStorage({
    shareTicket: ticket,
    keyList: ['score', 'maxScore'],
    success: res => {
      let data = res.data;
      render(3,data);
    },
    fail: res => {
    }
  });
}

// 绘制圆角矩形
function RoundRect(x, y, w, h, r,target,color){
    if (w < 2 * r) {r = w / 2;}
    if (h < 2 * r){ r = h / 2;}
    target.beginPath();
    target.moveTo(x+r, y);
    target.arcTo(x+w, y, x+w, y+h, r);
    target.arcTo(x+w, y+h, x, y+h, r);
    target.arcTo(x, y+h, x, y, r);
    target.arcTo(x, y, x+w, y, r);
    target.closePath();
    let _ = target.fillStyle;
    target.fillStyle = color;
    target.fill();
    target.fillStyle = _;
}

// 消息事件
function event(){
    wx.onMessage(res => {
        //console.log("传入开放域的数据为===========",res);
        if(!res.type){console.info("请传入type字段");return;}

        // 得分面板
        if (Number(res.type) === 1) {
            if(res.data.score||Number(res.data.score)===0){
                _score = Number(res.data.score);// 记录当前得分
                if("style" in res && "top" in res.style){
                    OBJsize.bg.y = res.style.top;
                    OBJsize.bg1.y = res.style.top+OBJsize.bg.h-OBJsize.bg1.h-23;
                }
                if("style" in res && "left" in res.style){
                    OBJsize.bg.x = res.style.left;
                  OBJsize.bg1.x = res.style.left + (OBJsize.bg.w - OBJsize.bg1.w)/2;
                }
                render(1);
            }
            else{
                console.log("未传入分数");
            }
        }
        // 好友排行
        else if(Number(res.type) === 2){
            if("style" in res && "top" in res.style){
                OBJsize.frends.top = res.style.top;
            }
            if("style" in res && "left" in res.style){
                OBJsize.frends.left = res.style.left;
            }
            if("style" in res && "titleColor" in res.style){
                OBJsize.frends.titleColor = res.style.titleColor;
            }
            render(2);
        }
        // 群排行
        else if (Number(res.type) === 3) {
            if("style" in res && "top" in res.style){
                OBJsize.frends.top = res.style.top;
            }
            if("style" in res && "left" in res.style){
                OBJsize.frends.left = res.style.left;
            }
            if("style" in res && "titleColor" in res.style){
                OBJsize.frends.titleColor = res.style.titleColor;
            }
            if(res.data.shareTicket){
                getGroupRanking(res.data.shareTicket);
            }
            else{
                console.log("未传入shareTicket字段");
            }
        }
        // 比分面板
        else if (Number(res.type) === 4) {
            if('data' in res && 'score' in res.data){
                // 更新比分面板
                if('style' in res){
                    if(!!res.style.top)_match_content.top=res.style.top;
                    if(!!res.style.left)_match_content.left=res.style.left;
                }
                _match_content.score = Number(res.data.score);//当前玩家实时分数 
                render(4);
            }
        }
        // 清空全部内容
        else if(Number(res.type) === 5){
            _renderStatus = 5;
            context.clearRect(0,0,_SIZE.w,_SIZE.h);
        }
    });
}

// 触摸事件
function touch(){
    let startY = undefined, moveY = 0;
    wx.onTouchMove(e => {
        let touch = e.touches[0];
        // 触摸移动第一次触发的位置
        if (startY === undefined) {
            startY = touch.clientY + moveY;
        }
        moveY = startY - touch.clientY;
        if(_renderStatus === 2 || _renderStatus === 3){
            reDrawItem(moveY);
        }
    });
    wx.onTouchEnd(e => {
        startY = undefined;let _MAXY = _SIZE.direction?itemCanvas.height - OBJsize.frends.width:itemCanvas.height - OBJsize.frends.width*.6;
        if (moveY < 0) { // 到顶
            moveY = 0;
        } else if (moveY >  _MAXY) { // 到底
            moveY =  _MAXY;
        }
        if(_renderStatus === 2 || _renderStatus === 3) {
            reDrawItem(moveY);
        }
    });
}

setTimeout(()=>{init()},500);