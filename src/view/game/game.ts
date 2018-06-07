/**
 * 路由
 * 1.利用当前路由数据下标奇偶性来判断是上部方块还是下部方块 偶数在下 奇数在上
 *  
 */


module WetchGame{
    export class gameScene{
        private Game_scene:Laya.Scene; //游戏场景
        private camera:Laya.Camera; //摄像机
        private Cube_number:number=0; // 记录立方体的总数与当前读取到路由表的数据位置
        private Router_game:JSON = null; // 游戏的路由表
        private cube_bg_type:boolean = true; // 立方体的贴图
        private Lead_cube:Laya.MeshSprite3D = null; // 主角模型
        private Circular_point:Laya.Vector3;// 主角运动圆心
        private radius:number = 1;// 主角运动圆半径
        private angle:number = 270;// 主角当前角度
        private angleSpeed:number = 3;// 弧形加速度
        private Circular_obj:Laya.MeshSprite3D = null;// 抓力点对象
        private FourcePointRouter:any = [];//着力点路由表
        private FoucePointIndex:number = 0;// 记录当前着力点的下标
        private ForceLineObj:Laya.MeshSprite3D;//着力线对象
        private accelerate:boolean=false;//主角加速运动开关
        private whereabouts:boolean=false;//主角下落运动开关
        private Lead_radian:number=60;//控制抛物线运动角度
        private Lead_step:number=0.01;//控制抛物运动移动速度
        private LeadLoop:boolean=true;//主角循环运动开启
        private Leaddirection:boolean = true;//主角循环运动方向
        private FoceContent:any = null;//着力线相关信息
        private parabola:any = { // 抛物线运动相关参数
            speedX: 2,// 横向速度
            speedY: -2,// 纵向速度
            gravity: 0.0098,// 重力
            h:0,
            l:0,
            Sx:0,
            Sy:0,
        }
        constructor(){
           let self = this;
           /* 读取Router表 */
           Laya.loader.load("res/router/Router.json",Laya.Handler.create(this,()=>{
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
                /* 执行摄像机动画 */
                self.cameraAnimation();
                /* 初始着力线 */
                self.ForceLineMain("init");
                /* 绘制第一个着力线 */
                //self.ForceLineMain("start");
                /* 事件入口 */
                self.eventSwitch();
                /* update */
                self.updata();
                /* 全局对象 */
                self.Global_obj();
           }),null,Laya.Loader.JSON);
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
        camera.transform.translate(new Laya.Vector3(2, 11, 8),false);
        camera.transform.rotate(new Laya.Vector3(-12, -20, 0),true,false);
        this.camera = camera;

        //方向光
        var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.direction = new Laya.Vector3(0.5, -1, -1.0);
    
        //添加背景图
        var box: Laya.MeshSprite3D = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(50, 0.001, 50))) as Laya.MeshSprite3D;
        var material: Laya.StandardMaterial = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load("res/image/1.png");
        box.meshRender.material = material;
        box.transform.position=new Laya.Vector3(0,5,-1);
    }

/**
 * 
 * 事件
 * 
 */
    // 全局鼠标事件
    private eventSwitch=()=>{
        // 鼠标按下
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,()=>{
            this.LeadLoop = false;//关闭自转
            this.ForceLineMain("start");//绘制着力线
            console.log("按下");
        });
        // 鼠标松开
        Laya.stage.on(Laya.Event.MOUSE_UP,this,()=>{
            this.ForceLineMain("end");//回收着力线
            console.log("松开");
        });
    }


/**
 * 
 * 抓力点与抓力线
 * 
 */

    //着力线
    private ForceLineMain = (status:any)=>{
        if(status === "init"){
            // 初始化着力线对象
            let target = TOOLS.getCylinderMesh(0);
            this.Game_scene.addChild(target);
            this.ForceLineObj = target;
            target.transform.pivot = new Laya.Vector3(0,0.05,0);
            this.forceLine("init");
        }else if(status === "start"){
            // 开启
            this.forceLine();
        }else if(status === "end"){
            // 关闭
            this.deleteFoce(this.ForceLineObj)
        }
    }

    // 着力线旋转动画
    private FoceAnimation = ()=>{
        // this.ForceLineObj.transform.rotate(new Laya.Vector3(0,0,angle)); 
        let content = this.FoceContent;
        let LeadPosition = this.Lead_cube.transform.position;
        let FoucePosition = content.a;
        let quadrant = null;
        var angleLead =  TOOLS.getRad(LeadPosition.x,LeadPosition.y,FoucePosition.x,FoucePosition.y);
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
        // 计算着力线角度
        if(angleLead===0){
            angleLead = quadrant * 90;                
        }
        this.ForceLineObj.transform.localRotationEuler = new Laya.Vector3(0,0,angleLead);
    }

    // 关闭着力线
    private deleteFoce=(target)=>{
        target.transform.scale = new Laya.Vector3(1,1,1);
         // 关闭主角加速运动
        this.accelerate = false;
        // 开启下坠
        this.whereabouts = true;
        // 重置加速度
        this.angleSpeed = 1;// 弧形加速度
        // 还原旋转
        this.ForceLineObj.transform.localRotationEuler = new Laya.Vector3(0,0,0)
        // 还原位置
        this.ForceLineObj.transform.position = new Laya.Vector3(0,0,0);
    }

    // 控制着力点位置
    private Rend_Circular_point=(pos)=>{
        this.Circular_obj.transform.position = new Laya.Vector3(pos.x,pos.y,0);
    }

    // 根据下标获取配置
    private _getFocecontent=(index)=>{
        let pos = new Laya.Vector3(this.FourcePointRouter[index].point.x,
        this.FourcePointRouter[this.FoucePointIndex].point.y);
        return pos;
    }

    // 着力点与主角坐标计算及坐标象限确定
    private _getFoce=()=>{
        // 选择着力点
        var _private = ()=>{
            let index = this.FoucePointIndex-1;
            if(index<=0){index=0};
            let pos = this._getFocecontent(index);// 获取上一个着力点坐标
            if(Math.abs(LeadPosition.x-pos.x)<=(CubeSize.X+(CubeSize.X/2))||LeadPosition.x-pos.x<=0){
                FoucePosition=pos;//取上一个着力点
            }else{
                this.FoucePointIndex++;// 取下一个着力点并递增index
            }
        };
        // 计算象限
        var _quadrant = ()=>{
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
            // 计算着力线角度
            if(angleLead===0){
                angleLead = quadrant * 90;                
            }
        };
        // 主角坐标
        var LeadPosition = this.Lead_cube.transform.position;
        // 获取下一个着力点坐标
        var FoucePosition = this._getFocecontent(this.FoucePointIndex);
        // 当前象限
        var quadrant = null;
        _private();//选择合适的着力点
        // 着色线角度
        var angleLead =  TOOLS.getRad(LeadPosition.x,LeadPosition.y,FoucePosition.x,FoucePosition.y);
         _quadrant();// 计算象限
         let content = {a:FoucePosition,b:LeadPosition,quadrant:quadrant,angleLead:angleLead,angle:angleLead+270};
        console.log(content);
        console.log(this.FoucePointIndex);
        this.FoceContent = content;
        return content;
    }

    // 着力线开启
    private forceLine=(type:any=null)=>{
        let _ = this._getFoce();
        // 获取着力点
        let FoucePosition = _.a;
        // 获取主角坐标
        let LeadPosition = _.b;
        // 获取着力线对象
        let target = this.ForceLineObj;
        // 着色线的实际长度
        let target_height = TOOLS.getline(FoucePosition,LeadPosition);
        // 目标缩放值
        let target_scale = target_height/CylinderMeshCube.Y;
        // 着色线偏转角度
        let angleLead =  _.angleLead;
        // 主角相对着力点角度
        this.angle = _.angle;
        // 改变主角运动圆心坐标
        this.Circular_point = FoucePosition;
        // 改变主角运动圆半径
        this.radius = target_height;
        // 着力线设置
        target.transform.position = new Laya.Vector3(FoucePosition.x,FoucePosition.y,0);
        target.transform.scale = new Laya.Vector3(1,target_scale,1);
        target.transform.localRotationEuler = new Laya.Vector3(0,0,angleLead);
        console.log("着力线长度为",target_height,"着力线角度为:",angleLead,"主角角度为",this.angle);
        // 移动着力点位置
        this.Rend_Circular_point(FoucePosition);
        if(type !== "init"){
            // 开启主角加速运动
            this.accelerate = true;
            //关闭下坠
            this.whereabouts = false;
        }
    }


    // 初始化着力点
    private Circular_point_obj=()=>{
        var box: Laya.MeshSprite3D = this.Game_scene.addChild(new Laya.MeshSprite3D(new Laya.BoxMesh(0.1, 0.1, 0.1))) as Laya.MeshSprite3D;
        var material: Laya.StandardMaterial = new Laya.StandardMaterial();
        material.diffuseTexture = Laya.Texture2D.load(Circular_point_texture[0]);
        box.meshRender.material = material;
        box.transform.position = new Laya.Vector3(0,0,0);
        this.Circular_obj = box;
        console.log(this.FourcePointRouter);//打印着力点配置表
    }

/**
 * 
 * 摄像机
 * 
 */

    // 摄像机动画
    private cameraAnimation = ():void=>{
        let anim = ()=>{this.camera.transform.translate(new Laya.Vector3(-0.08,-0.04,0))}
        Laya.timer.loop(10,this,anim);
        window.setTimeout(()=>{
            /* 关闭动画 */
            Laya.timer.clear(this,anim);
        },1000);
    }

    // 控制摄像机偏移
    private LookAT = (office:Laya.Vector3)=>{
        this.camera.transform.translate(office);
    }

/**
 * 
 * 立方体生成与配置表解析
 * 
 */

    // 方块创建入口 参数>=2 且为2的倍数
    private RenderCube = (size:number):void=>{
        let self = this;
        if(self.Router_game[self.Cube_number].c_type===0){
            return;
        }
        for(let i=size;i--;){
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
        let height = Number(this.Router_game[index].hp);// 获取立方体设置Y轴高度
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
            // 判断当前立方体是否有 着力点
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
        material.diffuseTexture = Laya.Texture2D.load("res/image/two.png");
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

    // 根据角度控制主角位置
    private Lead_angle_pos(angle){
        let target_X = this.Circular_point.x + this.radius * Math.cos(this.angle*Math.PI/180);
        let target_Y = this.Circular_point.y + this.radius * Math.sin(this.angle*Math.PI/180);
        this.Lead_cube.transform.position = new Laya.Vector3(target_X,target_Y,0);
    }

    // 抛物线运动 
    private Lead_animate(){
        let t:number = Laya.timer.delta/1000;//每帧时间
        this.parabola.Sx+=this.parabola.speedX*t;
        this.parabola.l=this.parabola.Sx;
        this.parabola.speedY+=this.parabola.g*t;
        this.parabola.h+=this.parabola.speedY*t;
        this.Lead_cube.transform.position = new Laya.Vector3(this.parabola.l,this.parabola.h,0);
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
                self.Lead_angle_pos(self.angle);
                self.angle+=self.angleSpeed;
                self.FoceAnimation();
                self.angleSpeed+=0.01;
                // 控制摄像机
               // self.LookAT(new Laya.Vector3(0.01,0,-0.001));
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
                self.Lead_angle_pos(self.angle);
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
        window["LookAT"] = this.LookAT;// 摄像机监听
        window["foce"] = this.ForceLineObj;//着力线
        window["focepoivet"] = this.Circular_obj;// 着力点
    }

    }
}