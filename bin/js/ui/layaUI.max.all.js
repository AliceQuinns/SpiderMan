var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    class indexUI extends Dialog {
        constructor() { super(); }
        createChildren() {
            View.regComponent("Text", laya.display.Text);
            super.createChildren();
            this.createView(ui.indexUI.uiView);
        }
    }
    indexUI.uiView = { "type": "Dialog", "props": { "width": 720, "height": 1280 }, "child": [{ "type": "Image", "props": { "y": 131, "x": 192, "skin": "index/LOGO.png" } }, { "type": "Image", "props": { "y": 1000, "x": 35, "var": "setup", "skin": "index/set.png", "name": "setup" } }, { "type": "Image", "props": { "y": 1000, "x": 590, "var": "skin", "skin": "index/skin.png", "name": "skin" } }, { "type": "Button", "props": { "y": 989, "x": 159, "var": "start", "stateNum": 1, "skin": "index/start.png", "name": "start" } }, { "type": "Text", "props": { "y": 836, "x": 159, "var": "title", "text": "按住可加速 松开可飞行", "name": "title", "fontSize": 40, "font": "Microsoft YaHei", "color": "#ffffff", "bold": false, "alpha": 1 } }, { "type": "Clip", "props": { "y": 149, "x": 309, "visible": false, "skin": "index/fire rides.png", "index": 6, "clipX": 11 } }] };
    ui.indexUI = indexUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map