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