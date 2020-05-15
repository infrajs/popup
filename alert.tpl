<div class="modal-header">
	<h5 class="modal-title">Внимание</h5>
	<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">&times;</span>
	</button>
</div>
<div class="modal-body bg-warning" id="{conf_divid}">
	
</div>
<script type="module">
	(async () => {
		let CDN = (await import('/vendor/akiyatkin/load/CDN.js')).default
		await CDN.load('jquery')
		$('#{div}').find('a').click(e => {
			Popup.close()
		})
	})()
</script>
<div class="modal-footer">
	<!--data-dismiss="modal"-->
	<button class="btn btn-secondary" 
		type="button"
		onclick="Popup.close()"
		>Закрыть</button>
</div>