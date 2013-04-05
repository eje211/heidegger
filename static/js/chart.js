$(document).ready(function() {

	var canvas = $('#chart_canvas').get(0).getContext('2d'),
		c = 125; // Center. Used a lot. Needs to be short.
	canvas.fillStyle = "rgba(0, 0, 192, 0.3)"
	canvas.strokeStyle = "#00f";
	canvas.lineWidth = 2;

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