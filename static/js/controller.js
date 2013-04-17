$(document).ready(function() {

	// var ip_addr = '10.15.121.97',
	var ws          = '',
		start_value = 50,
		sliders     = [];
	$.get('/ip', function(ip) {
		ws = new WebSocket("ws://" + ip + ":8887/cont_socket");
		ws.onmessage = function(evt) {
			if (ws == '') return;
			var d = JSON.parse(evt.data);
			for (var k in d) {
				$('#' + k + '-slider').slider('value', parseInt(d[k]));
				$('#' + k + '-box').val(d[k]);
			}
		};
	});

	$('input').val(start_value);

	$('.slider').each(function() {
		sliders.push($(this).slider({min: 0, max: 100, value: start_value},
			{slide: function(event, ui) {
				$(event.target).parents('tr').find('input').val(ui.value);
				send_to_chart([$(event.target).attr('id').charAt(0), ui.value]);
			}}
		))
	});

	$('input').change(function() {
		$(this).parents('tr').find('.slider').slider('value', $(this).val());
		send_to_chart();
	});

	$('#reset').click(function() {
		$('.slider').slider('value', 50);
		$('input').val(50);
		send_to_chart();
	});

	function send_to_chart(extra) {
		if (ws == '') return;
		var message = {};
		$(sliders).each(function() {
			message[$(this).attr('id').charAt(0)] =
				parseInt($(this).slider('value'));
		});
		if (extra != undefined) message[extra[0]] = extra[1];
		ws.send(JSON.stringify(message));
	}

});
