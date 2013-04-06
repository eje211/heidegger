$(document).ready(function() {

	var ip_addr = '10.15.121.97',
		ws = new WebSocket("ws://" + ip_addr + ":8887/cont_socket"),
	    start_value = 50,
		sliders = [];

	$('input').val(start_value);

	$('.slider').each(function() {
		sliders.push($(this).slider({min: 0, max: 100, value: start_value}, {slide: function(event, ui) {
			$(this).parents('tr').find('input').val(ui.value);
			send_to_chart();
		}}))
	});

	$('input').change(function() {
		console.log('changed!');
		$(this).parents('tr').find('.slider').slider('value', $(this).val());
		send_to_chart();
	});

	function send_to_chart() {
		var message = {};
		$(sliders).each(function() {
			message[$(this).attr('id').charAt(0)] =
				parseInt($(this).slider('value'));
		});
		ws.send(JSON.stringify(message));
	}

});