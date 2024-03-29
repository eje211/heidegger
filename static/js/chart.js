$(document).ready(function() {

	// var ip_addr = '10.15.121.97',
	var ws = '',
		canvas = $('#chart_canvas').get(0).getContext('2d'),
		c = 130, // Center. Used a lot. Needs to be short.
		color = {
			a: "rgba(251, 146,   0, 0.6)",
			e: "rgba(106, 199,  81, 0.8)",
			s: "rgba( 98, 103, 214, 0.8)",
			k: "rgba(235,  53,  53, 0.7)",
			d: "rgba( 84,  84,  84, 0.7)", // default
		},
		d = {};

	$.get('/ip', function(ip) {
		ws = new WebSocket("ws://" + ip + ":8887/chart_socket");
		ws.onmessage = function(evt) {
			d = JSON.parse(evt.data);
			canvas.fillStyle = "rgba(84, 84, 84, 0.6)"
			canvas.strokeStyle = "rgba(248, 213, 0, 0.7)";
			canvas.clearRect(0, 0, 250, 250);
			canvas.beginPath();
			canvas.moveTo(c - d['k'], c - d['k']);
			canvas.lineTo(c - d['s'], c + d['s']);
			canvas.lineTo(c + d['e'], c + d['e']);
			canvas.lineTo(c + d['a'], c - d['a']);
			canvas.closePath();
			canvas.fill();
			canvas.stroke();
			var max = _.chain(d).values().max().value();
			for (var type in d)
				drawNum(d[type], type, d[type] == max);
			// If all values are 50:
			if (_.chain(d).
				map(function(x) {return x == 50}).
				reduce(function(a, b) {return a && b}, true).
				value()) {
				$('#ds3 .game_cover').removeClass('glow');
				$('#aot3').hide();
			}
			else {
				$('#ds3 .game_cover').addClass('glow');
				if (d['s'] == max || d['a'] == max)
					$('#aot3').fadeIn();
				else $('#aot3').fadeOut();
			}
			return false;
		};
	});

	canvas.font = '50px Arial';
	canvas.lineWidth = 2;
	canvas.textAlign = 'center';
  	canvas.textBaseline = 'middle';


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

	function drawNum(num, type, isMax) {
		var top  = false,
			left = false;
		switch (type)
		{
			case 'k': top  = true; left = true; break;
			case 'a': top  = true; break;
			case 's': left = true; break;
		}
		var x = c + (left?-50:50),
			y = c + (top ?-50:50);
		canvas.fillStyle = color['d'];
		if (isMax)
			canvas.fillStyle = color[type];
		canvas.fillText(num, x, y);

	}

});
