<div class="modal-header">
	<button class="close" type="button" onclick="Popup.close()">x</button>
	<h4 class="modal-title" id="myModalLabel">{conf_title}</h4>
</div>
<div class="modal-body" id="{conf_divid}">
	
</div>
<div class="modal-footer">
	<button class="btn btn-success popup-confirm-ok" type="button">ОК</button>
	<button class="btn btn-default" type="button" onclick="Popup.close()">Отмена</button>
</div>
<script>
	Event.one('Controller.onshow', function(){
		var layer = Controller.getUnickLayer('{id}');
		var div = $('#' + layer.div);
		div.find('.popup-confirm-ok').click( function () {
			layer.conf_ok(div);
			Popup.close();
		});
	})
</script>