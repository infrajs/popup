import { Popup } from '/vendor/infrajs/popup/Popup.js'
import { Event } from '/vendor/infrajs/event/Event.js'

Event.handler('Layer.isshow', function (layer) {
	do {
		if (layer.popupis === false) return false;
		layer = layer.parent;
	} while (layer)
}, 'popup');

Event.handler('Controller.onshow', async () => {
	Popup.render()
}, 'popup');