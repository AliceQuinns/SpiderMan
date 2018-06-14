/**
 * 路由
 * 1.利用当前路由数据下标奇偶性来判断是上部方块还是下部方块 偶数在下 奇数在上
 *  
 */


module WetchGame{
    export class gameScene{
        private Game_scene:Laya.Scene; //游戏场景
        private scene2D: Laya.Scene;//2d场景
        private directionLight;//灯光
        private camera:Laya.Camera; //摄像机
        private Cube_number:number=0; // 记录位置
        private Cube_pos:number=0; // 记录数据位置
        private Router_game:JSON = null; // 游戏的路由表
        private cube_bg_type:boolean = true; // 立方体的贴图
        private Lead_cube:Laya.MeshSprite3D = null; // 主角模型
        private Circular_point:Laya.Vector3;// 主角运动圆心
        private radius:number = 1;// 主角运动圆半径
        private angle:number = 270;// 主角当前角度
        private angleSpeed:number = angleSpeed;// 弧形加速度
        private Circular_obj:Laya.MeshSprite3D = null;// 抓力点对象
        private FourcePointRouter:any = [];//着力点路由表
        private FoucePointIndex:number = 0;// 记录当前着力点的下标
        private ForceLineObj:Laya.MeshSprite3D;//着力线对象
        private accelerate:boolean=false;//主角加速运动开关
        private whereabouts:boolean=false;//主角下落运动开关
        private Lead_radian:number=60;//控制抛物线运动角度
        private foucePos:any;//着力点坐标
        private LeadLoop:boolean=true;//主角循环运动开启
        private Leaddirection:boolean = true;//主角循环运动方向
        private Score:Laya.Text;//分数节点
        private fonttext;//位图字体
        private parabola:any = { // 重力运动相关参数
            speedX: 2,// 横向初速度  米/帧
            speedY: -2,// 纵向初速度  米/帧
            gravity: 0.0098,// 重力
        }
        constructor(){
           /* 加载2d资源 */
           Laya.loader.load([
            "res/atlas/index.atlas",
            "res/bitmapFont/fonta.fnt",
           ],Laya.Handler.create(this,this.Main2D));
        }

/**
 * 
 *  main
 * 
 */

    private Main2D=()=>{
        /* 读取Router表 加载3d场景 */
        Laya.loader.load("res/router/Router.json",Laya.Handler.create(this,this.Main3D),null,Laya.Loader.JSON);
    }

    private Main3D=()=>{
        let self = this;
        /* 保存数据 */
        self.Router_game = Laya.Loader.getRes('res/router/Router.json').data;
        console.log(self.Router_game);
        /* 绘制3D场景 */
        self.initScene();
        /* 渲染初始立方体 */
        self.RenderCube(30);
        /* 创建主角 */
        self.Lead();
        /* 初始化着力点 */ 
        self.Circular_point_obj();
        /* 初始着力线 */
        self.ForceLineMain("init");
        /* update */
        self.updata();
        /* 全局对象 */
        self.Global_obj();
        // 执行摄像机动画并绘制2d场景
        this.cameraAnimation(()=>{
            let scene = Laya.stage.addChild(new ui.indexUI) as Laya.Scene;
            this.scene2D = scene;
            scene.zOrder = 999;
            this.animation2D();//初始动画
            this.startGame();//开始游戏
        });
    }


/**
 * 
 * 2d场景操作
 * 
 */

    private startGame=()=>{
       let btn =  this.scene2D.getChildByName("start") as Laya.Button;
       btn.on(Laya.Event.CLICK,this,(e)=>{
            btn.offAll();// 防止重复点击
            this.bitmaptext();//绘制分数节点
            e.stopPropagation();
            this.LeadLoop = false;//关闭主角自转
            this.ForceLineMain("end");//回收着力线
            this.eventSwitch();// 开启事件监听
            this.scene2D.removeChildren();// 删除全部子节点
       });
    }

    // 位图字体绘制
    private bitmaptext=(text:string=null)=>{
        if(text){
            this.Score.text = text;
        }else{
            console.log("绘制位图字体");
            let fonttext = new Laya.BitmapFont();
            this.fonttext = fonttext;
            fonttext.loadFont("res/bitmapFont/fonta.fnt",new Laya.Handler(this,()=>{
                fonttext.setSpaceWidth(10);
                Laya.Text.registerBitmapFont("0",fonttext);
                let score = new Laya.Text();
                score.text = "0";
                score.align = "center";
                score.fontSize = 100;
                score.x = Laya.stage.width/2;
                score.y = 100;
                score.font = this.fonttext;
                this.Score = score;
                this.scene2D.addChild(score);
            }))
        }
    }

    // 字体动画
    private animation2D=()=>{
        let _ = this.scene2D;
        let title = _.getChildByName("title");
        let status = true;
        let alphaanim = ()=>{
            if(status){
                Laya.Tween.to(title,{alpha:0},1000,Laya.Ease.quartOut,Laya.Handler.create(this,()=>{
                    alphaanim();
                }));
            }else{
                Laya.Tween.to(title,{alpha:1},1000,Laya.Ease.quartOut,Laya.Handler.create(this,()=>{
                    alphaanim();
                }));
            }
            status = !status;
        }
       alphaanim();
    }

/**
 * 
 * 场景绘制
 * 
 */

    // 绘制初始场景
    private initScene = ()=>{
        //添加3D场景
        var scene: Laya.Scene = Laya.stage.addChild(new Laya.Scene()) as Laya.Scene;
        this.Game_scene = scene;

        //添加摄像机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(-1, 10, 6),false);
        camera.transform.localRotationEuler = new Laya.Vector3(-15,-25,2);
        this.camera = camera;

        //平行光
        var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.direction = new Laya.Vector3(2,-2,-5);
        this.directionLight = directionLight;
    
        //添加背景图
        var box: Laya.MeshSprite3D = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(50, 0.001, 50))) as Laya.MeshSprite3D;
        var material: Laya.StandardMaterial = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load("res/image/color/backgroud.png");
        box.meshRender.material = material;
        box.transform.position=new Laya.Vector3(0,5,-1);
    }

/**
 * 
 * 事件
 * 
 */
    private eventSwitch=()=>{
        // 鼠标按下
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,()=>{
            if(this.FourcePointRouter.length-this.FoucePointIndex<=2){
                console.log("创建方块");
                 this.RenderCube(30);// 创建方块
            }
            this.ForceLineMain("start");//绘制着力线
        });
        // 鼠标松开
        Laya.stage.on(Laya.Event.MOUSE_UP,this,()=>{
            this.ForceLineMain("end");//回收着力线
        });
    }


/**
 * 
 * 着力点与着力线
 * 
 */

    // 着力线入口
    private ForceLineMain = (status:any)=>{
        if(status === "init"){
            let target = TOOLS.getCylinderMesh(0);
            this.Game_scene.addChild(target);
            this.ForceLineObj = target;
            target.transform.pivot = new Laya.Vector3(0,0.05,0);
            this.forceLine();
            this.accelerate = this.whereabouts = false;
        }else if(status === "start"){
            this.forceLine();
        }else if(status === "end"){
            this.deleteFoce();
        }
    }

    // 关闭着力线
    private deleteFoce=()=>{
        let increment = this.angleSpeed-angleSpeed;//加速度增量
        //console.log("当前加速度",this.angleSpeed,"增量",increment);
        let target = this.ForceLineObj;
        target.transform.scale = new Laya.Vector3(1,1,1);
        this.accelerate = false; // 关闭主角加速运动
        this.whereabouts = true; // 开启下坠
        if(increment===0){
             this.parabola.speedX = 2;//水平初速度
        }else{
             this.parabola.speedX = 100/(increment*100);//水平初速度
             if(this.parabola.speedX >= 10){
                 // 最大水平速度
                 this.parabola.speedX = 5;
             }
        }
        this.parabola.speedY = -increment*10;//垂直初速度
        if(increment*10>=8){
            this.parabola.speedY = -8;
        }
        //console.log("水平",this.parabola.speedX,"垂直",this.parabola.speedY);
        // if(this.parabola.speedX>=angleSpeed){
        //      this.angleSpeed = this.parabola.speedX;
        // }else{
        //     this.angleSpeed = angleSpeed;
        // }
        this.angleSpeed = angleSpeed;
        this.ForceLineObj.transform.scale = new Laya.Vector3(1,1,1);// 重置缩放
    }

    // 控制着力点
    private Rend_Circular_point=(pos)=>{
        this.Circular_obj.transform.position = new Laya.Vector3(pos.x,pos.y,0);
    }

    // 获取信息
    private _getFocecontent=(index)=>{
        let pos = new Laya.Vector3(this.FourcePointRouter[index].point.x,
        this.FourcePointRouter[index].point.y);
        return pos;
    }

    // 绘制着力线
    private forceLine=()=>{
        var LeadPosition = this.Lead_cube.transform.position;// 主角
        var FoucePosition = this._FocusPoint(LeadPosition);// 着力点
        this.foucePos = FoucePosition;//当前着力坐标
        let angleData = this._quadrant(LeadPosition,FoucePosition);// 角度
        let target = this.ForceLineObj;
        let target_height = TOOLS.getline(FoucePosition,LeadPosition);
        let target_scale = target_height/CylinderMeshCube.Y;
        let angleLead = angleData.angleLead;
        this.angle = angleData.angleLead+270;
        this.Circular_point = FoucePosition;
        this.radius = target_height;// 圆半径
        console.log("半径",target_height);
        if(target_height<=1){
            this.angleSpeed = 5;
        }
        target.transform.position = new Laya.Vector3(FoucePosition.x,FoucePosition.y,0);
        target.transform.scale = new Laya.Vector3(1,target_scale,1);
        target.transform.localRotationEuler = new Laya.Vector3(0,0,angleLead);
        this.Rend_Circular_point(FoucePosition);
        this.accelerate = true; // 开启主角加速运动
        this.whereabouts = false; // 关闭下坠
    }

    // 着力点的选取 
    private _FocusPoint=(LeadPosition)=>{
        let pos = this._getFocecontent(this.FoucePointIndex);// 着力点坐标
        let size = TOOLS.getline(pos,LeadPosition);// 计算主角和着力点的距离
        if(size<=CubeSize.X*2||Math.abs(LeadPosition.x-pos.x)<=CubeSize.X*1.5){
            this.FoucePointIndex++;
            return pos;// 正常情况
        }else if(pos.x-LeadPosition.x>=CubeSize.X*1.5){
            return this._getFocecontent(this.FoucePointIndex-1);//取目前使用的着力点
        }else if(LeadPosition.x-pos.x>=CubeSize.X*1.5){
            this.FoucePointIndex++;
            return this._FocusPoint(LeadPosition);//递归
        }
    }

    // 坐标象限
    private _quadrant(LeadPosition,FoucePosition){
        let quadrant,
        angleLead=TOOLS.getRad(LeadPosition.x,LeadPosition.y,FoucePosition.x,FoucePosition.y);
        if(LeadPosition.x>=FoucePosition.x&&LeadPosition.y<=FoucePosition.y){
            quadrant = 0;
            angleLead = 90-angleLead;
        }else if(LeadPosition.x>=FoucePosition.x&&LeadPosition.y>=FoucePosition.y){
            quadrant = 1;
            angleLead = 90+angleLead;
        }else if(LeadPosition.x<=FoucePosition.x&&LeadPosition.y>=FoucePosition.y){
            quadrant = 2;
            angleLead = 270-angleLead;
        }else if(LeadPosition.x<=FoucePosition.x&&LeadPosition.y<=FoucePosition.y){
            quadrant = 3;
            angleLead = 270+angleLead;
        };
        // 90°角特殊情况
        if(angleLead===0){
            angleLead = quadrant * 90;                
        }
        return {quadrant,angleLead};
    }

    //  连接主角
    private FoceAnimation = ()=>{
        let LeadPosition = this.Lead_cube.transform.position;// 主角坐标
        let FoucePosition = this.foucePos;// 着力点坐标
        let angleLead = this._quadrant(LeadPosition,FoucePosition).angleLead;// 计算角度
        this.ForceLineObj.transform.localRotationEuler = new Laya.Vector3(0,0,angleLead);
    }

    // 创建着力点
    private Circular_point_obj=()=>{
        var box: Laya.MeshSprite3D = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1))) as Laya.MeshSprite3D;
        var material: Laya.StandardMaterial = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
        box.meshRender.material = material;
        box.transform.position = new Laya.Vector3(0,0,0);
        this.Circular_obj = box;
        console.log(this.FourcePointRouter);
    }

/**
 * 
 * 摄像机
 * 
 */

    // 摄像机动画
    private cameraAnimation = (call):void=>{
        this.camera.transform.translate((new Laya.Vector3(0,0,20)),false);
        var a = 0;
        let anim = ()=>{
            if(a>=20){
                Laya.timer.clear(this,anim);
                window.setTimeout(()=>{
                     call();//执行回调
                },300);
            };
            this.camera.transform.translate(new Laya.Vector3(0,0,-0.2),false);
            a+=0.2;
        }
        Laya.timer.loop(1,this,anim);
    }

/**
 * 
 * 立方体生成与配置表解析
 * 
 */

    // 方块创建入口 参数>=2 且为2的倍数
    private RenderCube = (size:number):void=>{
        let self = this;
        for(let i=size;i--;){
            if(self.Router_game[self.Cube_number].c_type=="0"){
                console.log(self.Cube_number,"无配置");
                (self.Cube_number%2===0)?self.Cube_number=1:self.Cube_number=0;
            };
                (self.Cube_number%2 === 0)
                ?
                    self.AddBox(0,self.Cube_number)// 偶数在下
                :
                    self.AddBox(1,self.Cube_number);// 奇数在上
                //console.log(self.Cube_number);
                self.Cube_number++;
        }
    }

    // 创建立方体方块
    private AddBox = (type:number=null,index:number)=>{
        let box = TOOLS.pullCube({Checkpoint:0,imgType:(this.cube_bg_type)?0:1});//从对象池请求立方体
        this.Game_scene.addChild(box);//添加立方体
        //console.log(this.Router_game[index]);
        let height = Number(this.Router_game[index].hp);// 获取立方体高度
        if(type === 0){
            // 下部
            let Box_X = (index+2)/2*CubeSize.X; 
            let Box_Y = (CubeSize.Z/2)+height;
            box.transform.translate(new Laya.Vector3(Box_X,Box_Y,0));
            this.cube_bg_type = !this.cube_bg_type
        }else{
            // 上部
            let targetIndex = (index+1)/2;//计算当前数据为第几位奇数
            let Box_X = targetIndex*CubeSize.X;
            let Box_Y = CubeSize.Z+height+((CubeSize.Z/2)+Number(this.Router_game[index-1].hp));
            // 判断当前立方体是否有着力点
            if(!!this.Router_game[index].skill&&Number(this.Router_game[index].skill)===1){
                this.FourcePointRouter.push({
                    point: {x:Box_X,y:Box_Y-(CubeSize.Z/2)},//着力点坐标
                    data_index: index,// 数据索引
                })
            }; 
            box.transform.translate(new Laya.Vector3(Box_X,Box_Y,0));
        }
    }

/**
 * 
 * 主角控制
 * 
 */

    // 创建主角
    private Lead = ()=>{
        let target_cube = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.SphereMesh(0.1, 8, 8))) as Laya.MeshSprite3D;
        var material: Laya.StandardMaterial = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load("res/image/color/bgd_1.png");
        target_cube.meshRender.material = material;
        target_cube.transform.position = new Laya.Vector3(0.8,7,0);
        /* 添加圆形碰撞器 */
        let spherecollider:Laya.SphereCollider = target_cube.addComponent(Laya.SphereCollider) as Laya.SphereCollider;
        /* 设置球形碰撞器中心位置 */
        spherecollider.center = target_cube.meshFilter.sharedMesh.boundingSphere.center.clone();
        /* 设置球形碰撞器半径 */
        spherecollider.radius = target_cube.meshFilter.sharedMesh.boundingSphere.radius;

        this.Lead_cube = target_cube;
    }

    // 控制主角
    private Lead_angle_pos(angle){
        let before_pos = this.Lead_cube.transform.position; 
        let target_X = this.Circular_point.x + this.radius * Math.cos(this.angle*Math.PI/180);
        let target_Y = this.Circular_point.y + this.radius * Math.sin(this.angle*Math.PI/180);
        this.Lead_cube.transform.position = new Laya.Vector3(target_X,target_Y,0);
        return {x: target_X-before_pos.x,y:target_Y-before_pos.y};
    }

    // 主角抛物线运动 
    private Lead_animate(){
        let t:number = 15;//每帧时间
        var distanceX=(this.parabola.speedX*t)/1000;// 水平路程
        this.parabola.speedY+=this.parabola.gravity*t;// 加上重力加速度后的垂直速度
        let h = (this.parabola.speedY*t)/1000;//垂直路程
        if(this.parabola.speedY>=10){
            // 关闭下坠
            this.whereabouts = false;
            console.log("结束下坠");
        }
        this.camera.transform.translate(new Laya.Vector3(distanceX,-h,0),false);
        this.Lead_cube.transform.translate(new Laya.Vector3( distanceX,-h,0));
    }

/**
 * 
 *  updata
 * 
 */
    private updata(){
        let self = this;
        Laya.timer.frameLoop(1,this,()=>{
            //主角加速
            if(self.accelerate){
                let office = self.Lead_angle_pos(self.angle);//移动主角
                self.FoceAnimation();//重绘着力线
                self.angle+=self.angleSpeed;
                self.angleSpeed+=0.01;
                if(self.angleSpeed>=3){
                    self.angleSpeed = 3;
                }
                self.camera.transform.translate(new Laya.Vector3(office.x,office.y,0),false);
            }
            //主角下坠
            if(self.whereabouts){
                self.Lead_animate();
            }
            // 主角循环运动控制
            if(self.LeadLoop){
                if(self.angle>=310){
                    self.Leaddirection = false;
                }else if(self.angle<=230){
                    self.Leaddirection = true;
                };
                if(self.Leaddirection){
                    // 顺时针
                    self.angle++;
                    self.FoceAnimation();
                }else{
                    // 逆时针
                    self.angle--;
                    self.FoceAnimation();
                }
                self.Lead_angle_pos(self.angle);// 改变主角位置
            }
        })
    }


/**
 * 
 * 接口暴露
 * 
 */

    // 全局变量转换接口
    private Global_obj(){
        window['Lead'] = this.Lead_cube;// 主角
        window["camera"] = this.camera;// 摄像机
        window["foce"] = this.ForceLineObj;//着力线
        window["focepoivet"] = this.Circular_obj;// 着力点
        window["parabola"]= this.parabola;//抛物配置
        window["directionLight"]=this.directionLight;//灯光
        window["scene2D"] = this.scene2D;//2d场景
    }

    }
}