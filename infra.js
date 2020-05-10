import { Popup } from '/vendor/infrajs/popup/Popup.js'
import { Event } from '/vendor/infrajs/event/Event.js'
import { Controller } from '/vendor/infrajs/controller/src/Controller.js'

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
	if (!popup.st) return;
	Controller.code_save('popup', code);
	popup.div.on('hidden.bs.modal', function () {
		Controller.code_remove('popup', code);
	});
	//Event.onext('Layer.onhide',function(){
	//Controller.code_remove('popup',code);
	//},'',popup.st.obj);
}