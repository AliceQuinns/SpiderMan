
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui {
    export class indexUI extends Dialog {
		public setup:Laya.Image;
		public audio:Laya.Image;
		public start:Laya.Button;
		public title:laya.display.Text;
		public fraction:Laya.Label;

        public static  uiView:any ={"type":"Dialog","props":{"width":720,"height":1280},"child":[{"type":"Image","props":{"y":130,"x":87,"skin":"FIREUP!.png"}},{"type":"Image","props":{"y":1032,"x":60,"var":"setup","skin":"Setup.png","name":"setup"}},{"type":"Image","props":{"y":1032,"x":615,"var":"audio","skin":"audio_on.png","name":"audio"}},{"type":"Button","props":{"y":990,"x":159,"var":"start","stateNum":1,"skin":"btn_play_againx.png","name":"start"}},{"type":"Text","props":{"y":876,"x":167,"var":"title","text":"按住可加速 松开可飞行","name":"title","fontSize":40,"font":"Microsoft YaHei","color":"#ffffff","bold":false}},{"type":"Label","props":{"y":136,"x":326,"visible":false,"var":"fraction","text":"0","name":"fraction","fontSize":100,"font":"fonta","color":"#ffffff"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.indexUI.uiView);

        }

    }
}
