<div class="modal-header">
	<h5 class="modal-title">{conf_title}</h5>
	<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">&times;</span>
	</button>
</div>
<div class="modal-body" id="{conf_divid}">
	
</div>
<div class="modal-footer">
	<button class="btn btn-success popup-confirm-ok" type="button">ОК</button>
	<button class="btn btn-secondary" type="button" onclick="Popup.close()">Отмена</button>
</div>
<script type="module">
	import { Event } from '/vendor/infrajs/event/Event.js'
	import { Layer } from '/vendor/infrajs/controller/src/Layer.js'
	import { Popup } from '/vendor/infrajs/popup/Popup.js'
	
	//popup confirm не может показаться без контроллера
	Layer.get({id}).then(layer => {
		let div = document.getElementById('{div}')
		let cls = cls => div.getElementsByClassName(cls)
		cls('popup-confirm-ok')[0].addEventListener('click', () => {
			layer.conf_ok(div);
			Popup.close();
		})
	})
	
	
</script>