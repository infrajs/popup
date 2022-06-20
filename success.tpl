<div>
	<div class="modal-header">
		<h5 class="modal-title">{Lang.name()=:en?:Success?:Успех}!</h5>
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<div class="modal-body alert-success" id="{conf_divid}">
	</div>
	<div class="modal-footer">
		<button class="btn btn-secondary" 
			type="button"
			onclick="Popup.close()"
			>{Lang.name()=:en?:Close?:Закрыть}</button>
	</div>
</div>