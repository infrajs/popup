(() =>{
	Event.handler('Layer.isshow', function (layer){
		do {
			if (layer.popupis === false) return false;
			layer = layer.parent;
		} while (layer)
	},'popup');
	(async () =>{
		let Load = (await import('/vendor/akiyatkin/load/Load.js')).default
		//let CDN = await Load.on('import-default', '/vendor/akiyatkin/load/CDN.js')
		let Popup = await Load.on('import-default', '/vendor/infrajs/popup/Popup.js')
		//let Popup = import('/vendor/infrajs/popup/Popup.js')

		//await CDN.load('bootstrap')
		Event.handler('Controller.onshow', function () {
			Popup.render();
		}, 'popup');
	})()
})()