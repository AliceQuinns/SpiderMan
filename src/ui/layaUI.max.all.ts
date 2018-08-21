
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class alertUI extends Dialog {
		public reset:Laya.Button;
		public share:Laya.Button;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Button","props":{"y":794,"x":134,"var":"reset","stateNum":1,"skin":"index/btn_play_againx.png","name":"reset"}},{"type":"Button","props":{"y":970,"x":257,"width":185,"var":"share","stateNum":1,"skin":"index/share.png","name":"share","height":107}}]};
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
		public sure:Laya.Image;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Box","props":{"y":0,"x":3,"width":720,"var":"home","name":"home","height":1280},"child":[{"type":"Image","props":{"y":215,"x":342,"width":395,"var":"logo","skin":"index/logo.png","scaleY":0.5,"scaleX":0.5,"name":"logo","height":336,"anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"x":36,"var":"btn_groug","top":1280,"name":"btn_groug"},"child":[{"type":"Image","props":{"y":77,"x":30,"width":100,"var":"setup","skin":"index/frans.png","name":"setup","height":120}},{"type":"Image","props":{"y":78,"x":530,"width":100,"var":"skin","skin":"index/skin.png","name":"skin","height":120}},{"type":"Button","props":{"y":69,"x":169,"width":320,"var":"start","stateNum":1,"skin":"index/stat.png","name":"start","height":130}}]},{"type":"Image","props":{"y":35,"x":31,"var":"audio","skin":"index/audio_on.png","name":"audio"}},{"type":"Image","props":{"y":32,"x":141,"width":63,"skin":"index/shock.png","height":69}}]},{"type":"Box","props":{"y":158,"x":340,"var":"game","name":"game"},"child":[{"type":"FontClip","props":{"y":8,"x":2,"visible":false,"var":"Fraction","value":"0","skin":"index/num.png","sheet":"0123456789","name":"Fraction"}}]},{"type":"Image","props":{"y":835,"x":234,"visible":false,"var":"sure","skin":"index/sure.png","name":"sure"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.indexUI.uiView);

        }

    }
}

module ui {
    export class shoppingUI extends Dialog {
		public Sure:Laya.Image;
		public return:Laya.Image;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Image","props":{"y":929,"x":231,"var":"Sure","skin":"index/sure.png","name":"Sure"}},{"type":"Image","props":{"y":568,"x":27,"width":52,"skin":"index/return.png","pivotY":1,"pivotX":1,"height":78}},{"type":"Image","props":{"y":642,"x":682,"width":52,"skin":"index/return.png","rotation":180,"pivotY":1,"pivotX":1,"height":78}},{"type":"Image","props":{"y":0,"x":0,"width":720,"skin":"index/store.png"}},{"type":"Image","props":{"y":35,"x":52,"width":36,"var":"return","skin":"index/return.png","pivotY":1,"pivotX":1,"name":"return","height":54}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.shoppingUI.uiView);

        }

    }
}
