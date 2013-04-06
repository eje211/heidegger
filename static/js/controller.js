$(document).ready(function() {

	var ip_addr = '192.168.2.3',
		ws = new WebSocket("ws://" + ip_addr + ":8887/cont_socket"),
	    start_value = 50,
		sliders = [];


	ws.onmessage = function(evt) {
		var d = JSON.parse(evt.data);
		for (var k in d) {
			$('#' + k + '-slider').slider('value', parseInt(d[k]));
			$('#' + k + '-box').val(d[k]);
		}
	}

	$('input').val(start_value);

	$('.slider').each(function() {
		sliders.push($(this).slider({min: 0, max: 100, value: start_value},
			{slide: function(event, ui) {
				$(event.target).parents('tr').find('input').val(ui.value);
				send_to_chart();
			}}
		))
	});

	$('input').change(function() {
		$(this).parents('tr').find('.slider').slider('value', $(this).val());
		send_to_chart();
	});

	function send_to_chart() {
		var message = {};
		$(sliders).each(function() {
			var input = $(this).parents('tr').find('input');
			message[$(input).attr('id').charAt(0)] =
				parseInt($(input).val());
		});
		ws.send(JSON.stringify(message));
	}

});