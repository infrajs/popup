Event.handler('layer.isshow', function (layer){
	do {
		if (layer.popupis === false) return false;
		layer = layer.parent;
	} while (layer)
},'popup');


Event.handler('Infrajs.onshow', function () {
	//popup
	if(!window.popup||!popup.st)return;
	popup.render();
}, 'popup');