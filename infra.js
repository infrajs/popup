Event.handler('Layer.isshow', function (layer){
	do {
		if (layer.popupis === false) return false;
		layer = layer.parent;
	} while (layer)
},'popup');


Event.handler('Controller.onshow', function () {
	//popup
	if(!window.popup||!popup.st)return;
	popup.render();
}, 'popup');