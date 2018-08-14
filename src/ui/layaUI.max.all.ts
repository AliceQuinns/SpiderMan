
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class alertUI extends Dialog {
		public reset:Laya.Button;
		public share:Laya.Button;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Button","props":{"y":1020,"x":70,"var":"reset","stateNum":1,"skin":"index/btn_play_againx.png","name":"reset"}},{"type":"Button","props":{"y":1042,"x":509,"width":185,"var":"share","stateNum":1,"skin":"index/share.png","name":"share","height":107}}]};
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
		public logo:Laya.Image;
		public btn_groug:Laya.Box;
		public setup:Laya.Image;
		public skin:Laya.Image;
		public start:Laya.Button;
		public audio:Laya.Image;
		public game:Laya.Box;
		public Fraction:Laya.FontClip;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Box","props":{"y":0,"x":3,"width":720,"var":"home","name":"home","height":1280},"child":[{"type":"Image","props":{"y":215,"x":342,"width":395,"var":"logo","skin":"index/logo.png","scaleY":0.5,"scaleX":0.5,"name":"logo","height":336,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-12,"x":219,"width":86,"skin":"index/i.png","rotation":0,"height":86}}]},{"type":"Box","props":{"x":36,"var":"btn_groug","top":1280,"name":"btn_groug"},"child":[{"type":"Image","props":{"y":77,"x":30,"width":100,"var":"setup","skin":"index/frans.png","name":"setup","height":120}},{"type":"Image","props":{"y":78,"x":530,"width":100,"var":"skin","skin":"index/skin.png","name":"skin","height":120}},{"type":"Button","props":{"y":69,"x":169,"width":320,"var":"start","stateNum":1,"skin":"index/stat.png","name":"start","height":130}}]},{"type":"Image","props":{"y":35,"x":31,"var":"audio","skin":"index/audio_on.png","name":"audio"}},{"type":"Image","props":{"y":32,"x":141,"width":63,"skin":"index/shock.png","height":69}}]},{"type":"Box","props":{"y":158,"x":340,"var":"game","name":"game"},"child":[{"type":"FontClip","props":{"y":8,"x":2,"visible":false,"var":"Fraction","value":"0","skin":"index/num.png","sheet":"0123456789","name":"Fraction"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.indexUI.uiView);

        }

    }
}
