import { Popup } from '/vendor/infrajs/popup/Popup.js'
import { Event } from '/vendor/infrajs/event/Event.js'
import { Controller } from '/vendor/infrajs/controller/src/Controller.js'
import { Code } from '/vendor/infrajs/memcode/Code.js'

Event.handler('Layer.isshow', function (layer) {
	do {
		if (layer.popupis === false) return false;
		layer = layer.parent;
	} while (layer)
}, 'popup');

Event.handler('Controller.onshow', async () => {
	Popup.render()
}, 'popup');

Controller.popup_memorize = function (code) {
	if (!Popup.st) return;
	Code.save('popup', code);
	Popup.div.on('hidden.bs.modal', function () {
		Code.remove('popup', code);
	});
	//Event.onext('Layer.onhide',function(){
	//Code.remove('popup',code);
	//},'',popup.st.obj);
}