/**
 * 路由
 * 1.利用当前路由数据下标奇偶性来判断是上部方块还是下部方块 偶数在下 奇数在上
 *  
 */


module WetchGame{
    export class gameScene{
        private Game_scene:Laya.Scene; // 3D场景
        private scene2D: Laya.Scene;// 2D场景
        private directionLight;// 灯光
        private camera:Laya.Camera; // 摄像机
        private Cube_number:number=0; // 位置
        private Router_game:JSON = null; // 游戏的路由表
        private cube_bg_type:boolean = true; // 贴图
        private Lead_cube:Laya.MeshSprite3D = null; // 主角模型
        private Circular_obj:Laya.MeshSprite3D = null;// 着力点对象
        private FourcePointRouter:any = [];//着力点路由表
        private FoucePointIndex:number = 0;// 记录当前着力点的下标
        private ForceLineObj:Laya.MeshSprite3D;// 着力线对象
        private accelerate:boolean=false;// 圆周运动开关
        private whereabouts:boolean=false;// 斜抛运动开关
        private LeadLoop:boolean=true;// 单摆运动开关
        private foucePos:any;//着力点坐标
        private Leaddirection:boolean = true;// 单摆运动方向控制
        private Score:Laya.Text;// 分数节点
        private fonttext;// 位图字体
        // 圆周运动
        private Circumferential:any={
            angularVelocity: GLOB_Circumferential.angularVelocity,// 角速度
            angle: 0,// 角度
            speed: GLOB_Circumferential.speed,// 加速度
            increment: GLOB_Circumferential.increment,// 加速度增量
            radius: 0,// 圆半径 
            Circular_point: 0// 圆心坐标
        }
        // 斜抛运动
        private SlantingThrow:any={
            pos: null,// 主角坐标
            gravity: 10,// 重力
            v0: 5, // 初速度
            acceleration: 0, // 加速度
            angle: 45,// 角度
            time: 0,// 时间
        }
        // 单摆运动
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
            this.animation2D();// 字体动画
            this.startGame();// 开始游戏按钮
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
            //this.bitmaptext();//绘制分数节点
            e.stopPropagation();
            this.LeadLoop = false;//关闭主角自转
            this.ForceLineMain("end");// 回收着力线
            this.eventSwitch();// 开启游戏控制
            this.scene2D.removeChildren();// 删除2D场景全部子节点
            //this.camera.transform.position = 
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
            // if(this.FourcePointRouter.length-this.FoucePointIndex<=2){
            //     console.log("创建方块");
            //      this.RenderCube(30);// 创建方块
            // }
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
        //console.log("角速度",this.Circumferential.angularVelocity);
        let Leadpos = this.Lead_cube.transform.position;// 主角位置
        this.SlantingThrow.pos = Leadpos;
        //console.log("主角坐标",Leadpos);
        // 斜抛运动参数
        this.SlantingThrow.v0 = this.Circumferential.angularVelocity*this.Circumferential.radius;// 线速度
        let angle = 90-(360-(this.Circumferential.angle-Math.round(this.Circumferential.angle/360)*360));// 斜抛角度
        this.SlantingThrow.angle = angle;// 斜抛角度
        console.log("斜抛角度为",angle,"线速度为",this.SlantingThrow.v0);
        let target = this.ForceLineObj;
        target.transform.scale = new Laya.Vector3(1,1,1);
        this.accelerate = false; // 关闭圆周运动
        this.whereabouts = true; // 开启斜抛运动
        this.Circumferential.speed = GLOB_Circumferential.speed;// 加速度
        //this.Circumferential.time = GLOB_Circumferential.time;// 时间
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
        this.SlantingThrow.time = 0;// 清空斜抛运动的时间
        this.whereabouts = false; // 关闭斜抛运动
        var LeadPosition = this.Lead_cube.transform.position;// 主角
        var FoucePosition = this._FocusPoint(LeadPosition);// 着力点
        this.foucePos = FoucePosition;//当前着力坐标
        let angleData = this._quadrant(LeadPosition,FoucePosition);// 角度
        let target = this.ForceLineObj;
        let target_height = TOOLS.getline(FoucePosition,LeadPosition);
        let target_scale = target_height/CylinderMeshCube.Y;
        let angleLead = angleData.angleLead;
        this.Circumferential.angle = angleData.angleLead+270;
        this.Circumferential.Circular_point = FoucePosition;
        this.Circumferential.radius = target_height;// 圆半径
        target.transform.position = new Laya.Vector3(FoucePosition.x,FoucePosition.y,0);
        target.transform.scale = new Laya.Vector3(1,target_scale,1);
        target.transform.localRotationEuler = new Laya.Vector3(0,0,angleLead);
        this.Rend_Circular_point(FoucePosition);
        this.Circumferential.angularVelocity = this.SlantingThrow.v0/target_height;// 计算角速度
        this.accelerate = true; // 开启圆周运动
    }

    // 着力点的选取 
    private _FocusPoint=(LeadPosition)=>{
        let pos = this._getFocecontent(this.FoucePointIndex);// 着力点坐标
        let size = TOOLS.getline(pos,LeadPosition);// 计算主角和着力点的距离
        if(size<=CubeSize.X*2||Math.abs(LeadPosition.x-pos.x)<=CubeSize.X*2){
            this.FoucePointIndex++;
            return pos;// 正常情况
        }else if(pos.x-LeadPosition.x>=CubeSize.X*1){
            return this._getFocecontent(this.FoucePointIndex-1);//取目前使用的着力点
        }else if(LeadPosition.x-pos.x>=CubeSize.X*1){
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

/**
 * 
 * 运动函数
 * 
 */

  // 圆周运动
    private circularMotion(angle){
        let before_pos = this.Lead_cube.transform.position; 
        let target_X = this.Circumferential.Circular_point.x + this.Circumferential.radius * Math.cos(this.Circumferential.angle*Math.PI/180);
        let target_Y = this.Circumferential.Circular_point.y + this.Circumferential.radius * Math.sin(this.Circumferential.angle*Math.PI/180);
        this.Lead_cube.transform.position = new Laya.Vector3(target_X,target_Y,0);
        return {x: target_X-before_pos.x,y:target_Y-before_pos.y};
    }

    // 斜抛运动
    private SlantingMotion(angle:number,time:number,speed:number,scale:number=1){
        let X,Y;
        X = speed*Math.cos(angle*Math.PI/180)*time;// 水平距离
        Y = speed*Math.sin(angle*Math.PI/180)*time-(this.SlantingThrow.gravity*(time*time))/2;// 垂直距离
        X = X*scale;Y = Y*scale;
        return {X,Y};
    }

/**
 * 
 *  updata
 * 
 */
    private updata(){
        let self = this;
        Laya.timer.frameLoop(1,this,()=>{
            // 圆周运动
            if(self.accelerate){
                let office = self.circularMotion(self.Circumferential.angle);// 根据角度移动主角
                self.FoceAnimation();// 绘制着力线
                //self.Circumferential.time += (Laya.timer.delta/1000);// 计算时间
                self.Circumferential.angle += ((Laya.timer.delta/1000*self.Circumferential.angularVelocity)*180/Math.PI);// 计算角度
                //console.log("当前角度",self.Circumferential.angle);
                self.Circumferential.angularVelocity+=self.Circumferential.speed;// 递增角速度
                //self.Circumferential.speed+=self.Circumferential.increment;// 递增加速度
                self.camera.transform.translate(new Laya.Vector3(office.x,office.y,0),false);
            }
            // 斜抛运动
            if(self.whereabouts){
                let _ = self.SlantingMotion(
                    self.SlantingThrow.angle,
                    self.SlantingThrow.time,
                    self.SlantingThrow.v0,
                    1
                );
                self.SlantingThrow.time+=(Laya.timer.delta/1000);
                if(_.Y<=-2){
                    self.whereabouts = false;
                }
                let vect3 = new Laya.Vector3(this.SlantingThrow.pos.x+_.X,this.SlantingThrow.pos.y+_.Y,0);// 位移向量
                let Leadpos = this.Lead_cube.transform.position;// 主角当前位置
                this.camera.transform.translate(new Laya.Vector3(vect3.x-Leadpos.x,vect3.y-Leadpos.y),false);
                this.Lead_cube.transform.position=vect3;
            }
            // 单摆运动
            if(self.LeadLoop){
                if(self.Circumferential.angle>=310){
                    self.Leaddirection = false;
                }else if(self.Circumferential.angle<=230){
                    self.Leaddirection = true;
                };
                if(self.Leaddirection){
                    // 顺时针
                    self.Circumferential.angle++;
                    self.FoceAnimation();
                }else{
                    // 逆时针
                    self.Circumferential.angle--;
                    self.FoceAnimation();
                }
                self.circularMotion(self.Circumferential.angle);// 改变主角位置
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
        //window["parabola"]= this.parabola;//抛物配置
        window["directionLight"]=this.directionLight;//灯光
        window["scene2D"] = this.scene2D;//2d场景
        window["move"] = this.SlantingMotion;//斜抛算法
    }

    }
}