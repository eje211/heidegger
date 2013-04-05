$(document).ready(function() {

	var canvas = $('#chart_canvas').get(0).getContext('2d'),
		c = 125; // Center. Used a lot. Needs to be short.
	canvas.fillStyle = "rgba(0, 0, 192, 0.3)"
	canvas.strokeStyle = "#00f";
	canvas.lineWidth = 2;

	$('#chart_submit').click(function() {
		var e = $('#explorer'  ).val(),
			a = $('#achiever'  ).val(),
			s = $('#socializer').val(),
			k = $('#killer'    ).val();

		canvas.clearRect(0, 0, 250, 250);
		canvas.beginPath();
		canvas.moveTo(115, 115);
		canvas.lineTo(115, 135);
		canvas.lineTo(135, 135);
		canvas.lineTo(135, 115);
		console.log(e + ', ' + a + ', ' + s + ', ' + k);
		// canvas.moveTo(c - e, c - e);
		// canvas.lineTo(e - a, e + a);
		// canvas.lineTo(a + k, -a + k);
		// canvas.lineTo(-k + s, -k - s);
		canvas.closePath();
		canvas.fill();
		canvas.stroke();
		return false;
	});
});