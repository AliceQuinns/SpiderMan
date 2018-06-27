
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class alertUI extends Dialog {

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.alertUI.uiView);

        }

    }
}

module ui {
    export class indexUI extends Dialog {
		public home:Laya.Box;
		public setup:Laya.Image;
		public skin:Laya.Image;
		public start:Laya.Button;
		public title:laya.display.Text;
		public game:Laya.Box;
		public Fraction:Laya.FontClip;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Box","props":{"y":0,"x":3,"width":720,"var":"home","name":"home","height":1280},"child":[{"type":"Image","props":{"y":1029,"x":32,"var":"setup","skin":"index/set.png","name":"setup"}},{"type":"Image","props":{"y":1025,"x":583,"var":"skin","skin":"index/skin.png","name":"skin"}},{"type":"Button","props":{"y":1014,"x":152,"var":"start","stateNum":1,"skin":"index/start.png","name":"start"}},{"type":"Text","props":{"y":908,"x":149,"var":"title","text":"按住可加速 松开可飞行","name":"title","fontSize":40,"font":"Microsoft YaHei","color":"#ffffff","bold":false,"alpha":1}},{"type":"Image","props":{"y":314,"x":469,"skin":"index/e.png"}},{"type":"Image","props":{"y":651,"x":-12,"width":210,"skin":"index/f.png","height":307}},{"type":"Image","props":{"y":623,"x":497,"skin":"index/g.png"}},{"type":"Image","props":{"y":10,"x":145,"width":395,"skin":"index/l.png","height":336},"child":[{"type":"Image","props":{"y":102,"x":126,"width":86,"skin":"index/i.png","height":86}}]},{"type":"Image","props":{"y":522,"x":251,"skin":"index/a.png"}},{"type":"Image","props":{"y":553,"x":247,"skin":"index/b.png"}},{"type":"Image","props":{"y":262,"x":-3,"skin":"index/k.png"}}]},{"type":"Box","props":{"y":158,"x":340,"var":"game","name":"game"},"child":[{"type":"FontClip","props":{"y":8,"x":2,"visible":false,"var":"Fraction","value":"0","skin":"index/num.png","sheet":"0123456789","name":"Fraction"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.indexUI.uiView);

        }

    }
}
