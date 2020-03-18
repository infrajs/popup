(() =>{
	Event.handler('Layer.isshow', function (layer){
		do {
			if (layer.popupis === false) return false;
			layer = layer.parent;
		} while (layer)
	},'popup');
	(async () =>{
		let Popup = (await import('/vendor/infrajs/popup/Popup.js')).default
		Event.handler('Controller.onshow', function () {
			Popup.render();
		}, 'popup');
	})()
})()