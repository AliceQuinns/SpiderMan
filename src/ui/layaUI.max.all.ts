
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class indexUI extends Dialog {
		public setup:Laya.Image;
		public skin:Laya.Image;
		public start:Laya.Button;
		public title:laya.display.Text;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Image","props":{"y":131,"x":192,"skin":"index/LOGO.png"}},{"type":"Image","props":{"y":1000,"x":35,"var":"setup","skin":"index/set.png","name":"setup"}},{"type":"Image","props":{"y":1000,"x":590,"var":"skin","skin":"index/skin.png","name":"skin"}},{"type":"Button","props":{"y":989,"x":159,"var":"start","stateNum":1,"skin":"index/start.png","name":"start"}},{"type":"Text","props":{"y":836,"x":159,"var":"title","text":"按住可加速 松开可飞行","name":"title","fontSize":40,"font":"Microsoft YaHei","color":"#ffffff","bold":false,"alpha":1}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.indexUI.uiView);

        }

    }
}
