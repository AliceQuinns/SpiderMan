var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    class alertUI extends Dialog {
        constructor() { super(); }
        createChildren() {
            super.createChildren();
            this.createView(ui.alertUI.uiView);
        }
    }
    alertUI.uiView = { "type": "Dialog", "props": { "width": 720, "height": 1280 }, "child": [{ "type": "Button", "props": { "y": 1020, "x": 70, "var": "reset", "stateNum": 1, "skin": "index/btn_play_againx.png", "name": "reset" } }, { "type": "Button", "props": { "y": 1042, "x": 509, "width": 185, "var": "share", "stateNum": 1, "skin": "index/share.png", "name": "share", "height": 107 } }] };
    ui.alertUI = alertUI;
})(ui || (ui = {}));
(function (ui) {
    class indexUI extends Dialog {
        constructor() { super(); }
        createChildren() {
            View.regComponent("Text", laya.display.Text);
            super.createChildren();
            this.createView(ui.indexUI.uiView);
        }
    }
    indexUI.uiView = { "type": "Dialog", "props": { "width": 720, "height": 1280 }, "child": [{ "type": "Image", "props": { "width": 898, "skin": "index/vignette.png", "rotation": 0, "height": 1572, "centerY": 45, "centerX": 5 } }, { "type": "Box", "props": { "y": 0, "x": 3, "width": 720, "var": "home", "name": "home", "height": 1280 }, "child": [{ "type": "Image", "props": { "y": 215, "x": 342, "width": 395, "var": "logo", "skin": "index/logo.png", "scaleY": 0.5, "scaleX": 0.5, "name": "logo", "height": 336, "anchorY": 0.5, "anchorX": 0.5 }, "child": [{ "type": "Image", "props": { "y": -12, "x": 219, "width": 86, "skin": "index/i.png", "rotation": 0, "height": 86 } }] }, { "type": "Image", "props": { "width": 140, "var": "left_d", "top": 199, "skin": "index/d.png", "name": "left_d", "left": -299, "height": 301 } }, { "type": "Image", "props": { "width": 267, "var": "left_a", "top": 331, "skin": "index/k.png", "name": "left_a", "left": -300, "height": 267 } }, { "type": "Image", "props": { "width": 240, "var": "left_b", "top": 600, "skin": "index/f.png", "name": "left_b", "left": -300, "height": 349 } }, { "type": "Image", "props": { "width": 227, "var": "right_c", "top": 228, "skin": "index/j.png", "name": "right_c", "left": 718, "height": 144 } }, { "type": "Image", "props": { "width": 204, "var": "right_a", "top": 344, "skin": "index/e.png", "name": "right_a", "left": 718, "height": 327 } }, { "type": "Image", "props": { "width": 201, "var": "right_b", "top": 622, "skin": "index/g.png", "name": "right_b", "left": 718, "height": 363 } }, { "type": "Image", "props": { "width": 128, "var": "left_c", "top": 753, "skin": "index/c.png", "name": "left_c", "left": -153, "height": 120 } }, { "type": "Text", "props": { "y": 860, "x": 161, "var": "title", "text": "按住可加速 松开可飞行", "name": "title", "fontSize": 40, "font": "Microsoft YaHei", "color": "#ffffff", "bold": false, "alpha": 1 } }, { "type": "Box", "props": { "x": 36, "var": "btn_groug", "top": 1280, "name": "btn_groug" }, "child": [{ "type": "Image", "props": { "y": 188, "x": 200, "skin": "index/sbtn_2.png" }, "child": [{ "type": "Image", "props": { "y": -109, "x": -102, "skin": "index/sbtn_1.png" } }] }, { "type": "Image", "props": { "y": 66, "width": 170, "var": "setup", "skin": "index/gamelist.png", "name": "setup", "height": 120 } }, { "type": "Image", "props": { "y": 66, "x": 479, "width": 173, "var": "skin", "skin": "index/shop.png", "name": "skin", "height": 120 } }, { "type": "Button", "props": { "x": 169, "width": 314, "var": "start", "stateNum": 1, "skin": "index/begin.png", "name": "start", "height": 197 } }] }] }, { "type": "Box", "props": { "y": 158, "x": 340, "var": "game", "name": "game" }, "child": [{ "type": "FontClip", "props": { "y": 8, "x": 2, "visible": false, "var": "Fraction", "value": "0", "skin": "index/num.png", "sheet": "0123456789", "name": "Fraction" } }] }] };
    ui.indexUI = indexUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map