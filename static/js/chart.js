$(document).ready(function() {

	var ip_addr = '192.168.2.3',
		canvas = $('#chart_canvas').get(0).getContext('2d'),
		c = 125; // Center. Used a lot. Needs to be short.
		canvas.fillStyle = "rgba(0, 0, 192, 0.3)"
		canvas.strokeStyle = "#00f";
		canvas.lineWidth = 2
		ws = new WebSocket("ws://" + ip_addr + ":8887/chart_socket");

	ws.onmessage = function(evt) {
		var d = JSON.parse(evt.data);
		canvas.clearRect(0, 0, 250, 250);
		canvas.beginPath();
		canvas.moveTo(c - d['e'], c - d['e']);
		canvas.lineTo(c - d['a'], c + d['a']);
		canvas.lineTo(c + d['k'], c + d['k']);
		canvas.lineTo(c + d['s'], c - d['s']);
		canvas.closePath();
		canvas.fill();
		canvas.stroke();
		return false;
	}

	$('#chart_submit').click(function() {
		var e = parseInt($('#explorer'  ).val()),
			a = parseInt($('#achiever'  ).val()),
			s = parseInt($('#socializer').val()),
			k = parseInt($('#killer'    ).val());

		canvas.clearRect(0, 0, 250, 250);
		canvas.beginPath();
		canvas.moveTo(c - e, c - e);
		canvas.lineTo(c - a, c + a);
		canvas.lineTo(c + k, c + k);
		canvas.lineTo(c + s, c - s);
		canvas.closePath();
		canvas.fill();
		canvas.stroke();
		return false;
	});
});