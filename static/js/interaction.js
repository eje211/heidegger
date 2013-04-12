$(document).ready(function() {
	//////////////////////////////////////////////////////////////////////////
	// CLASS VARIABLES
	//////////////////////////////////////////////////////////////////////////
	// These variables are based on the CSS. Ideally, the size and placement
	// of anything that has good reason to change should be changeable in the
	// CSS without breaking this Javascript.

		// Base speed of fade animations.
	var	SPEED       = 200,
		// Distance we will shift popups to the right, by adding to the "left"
		// CSS property's value.
		SHIFT_RIGHT = $('.popup:first').css('left'),
		// Compute the width of the scrollbar.
		SCROLLBAR   = getScrollBarWidth(),
		// The same as an integer.
		RIGHT       = parseInt(SHIFT_RIGHT),
		// How much we shifted the box from the edge.
		SHIFT       = parseInt($('.game_cover_wrapper').outerWidth(true)) -
			RIGHT,
		// Distance we will shift the rightmost game covers to the left.
		// The extra 8 px are for the space the box expands to.
		SHIFT_LEFT  = '' + (-$('.popup:first').width() + SHIFT + 8) + 'px';
		// Width to height ratio of the game boxes.
		RATIO       = parseInt($('.game_cover').height()) /
			parseInt($('.game_cover').width()),
		MAX_SIDEBAR = 300,
		MIN_SIDEBAR = 10,
		// number of games currently displayed.
		NUM_GAMES   = 5,
		// Is the mouse in the window?
		mouse_in    = true,

		// Class variable.
		// Current state of the recommendation display: [H]idden,
		// [S]idebar or full [W]indow.
		recom_stat  = 'H';

	function update_constants() {
		RIGHT       = $('.game_cover').width() - SHIFT;
		SHIFT_RIGHT = '' + RIGHT + 'px';
		SHIFT_LEFT  = '' + (-$('.popup:first').width() + SHIFT + 8) + 'px';
	}


	//////////////////////////////////////////////////////////////////////////
	// HELPER FUNCTIONS
	//////////////////////////////////////////////////////////////////////////

	// See if the game cover is so close to the sceen that its popup should
	// appear on the left. Make it so if needed. This has to be done every
	// time, in case the user changes the geometry of the browser window.
	function shift_left(game_cover) {
		game_cover = $(game_cover); // Just to be 100% sure.
		var popup = game_cover.parents().eq(1).children('.popup');
		if (game_cover.offset().left + RIGHT + popup.outerWidth() + 25 >
			$('#sidebar').offset().left)
				popup.css('left', SHIFT_LEFT).
				css('margin', '0 25px 0 0').children().
				css('margin', '0 -25px 0 0').
				css('padding', '0 25px 0 0').
				css('background', 'transparent url("static/images/popup_arrow_r.png") no-repeat right 20px');
		else popup.css('left', SHIFT_RIGHT).
				css('margin', '0 0 0 25px').children().
				css('margin', '0 0 0 -25px').
				css('padding', '0 0 0 25px').
				css('background', 'transparent url("static/images/popup_arrow.png") no-repeat left 20px');
	}

	function number_of_games_per_row() {
		return Math.floor($('#games').width() /
			$('.game_cover_wrapper').outerWidth(true));
	}

	// Return the current width of the scrollbar:
	function scrollbar_width() {
		if ($("body").height() > $(window).height()) return SCROLLBAR;
		return 0;
	}

	function padding_from_slider (mul) {
		if (arguments.length == 0) mul = 1;
		return Math.round(mul * ((parseInt($('#slider').
			slider('option', 'value')) / 10) + 5));
	}

	function regular_dimensions() {
		var slider_value = $('#slider').slider('option', 'value')
		var width  = Math.round((slider_value / 100 * 160) + 105);
		var height = Math.round(width * RATIO);
		return [width, height];
	}

	function resize_sidebar() {
		// If there is an overflow:
		//if ($('body').height() > $(window).height())
		$('#content').height($(window).height() - 92);
		//else $('#content').height($('#games').height());
		$('#games').css('min-height', '' +
		 	($('content').height() - padding_from_slider(2) / 1.3) + 'px');
		$('#sidebar').css('min-height', '' +
			($('#games').outerHeight()) + 'px');
		return $('#sidebar').css('margin-left', '' +
			($(window).width() - 10) + 'px');
	}

	function adjust_margin() {
		// If we're only using the top row, justify to the left:
		if($('.game_cover').length <= number_of_games_per_row())
			$('#games_inner').css('padding-left', '0');
		// If we're using multiple rows, center:
		else $('#games_inner').css('padding-left', '' +
			Math.floor(
				(($('#games').width() -	scrollbar_width()) -
					(($('.game_cover').width() + padding_from_slider(2)) *
					number_of_games_per_row())) / 2
			) + 'px' );
		$('#games').css('padding', '' + padding_from_slider() + 'px');
		$('.game_cover_wrapper').
			width ($('.game_cover').width()  + padding_from_slider(2)).
			height($('.game_cover').height() + padding_from_slider(2));
		$('.games').css('margin-right', '' + $('sidebar').width() + 'px');
	}

	function toggle_sidebar(event, ui) {
		// Toggle status first.
		if (recom_stat == 'S')      // Sidebar
			recom_stat = 'W';       // Window
		else if (recom_stat == 'W') // Window
			recom_stat = 'H';       // Hidden
		else recom_stat = 'S';      // Sidebar

		// Now, apply new status.
		if (recom_stat == 'S') {
			$('#sidebar').show();
			$('#games').width($('#content').width() -
				(300 + padding_from_slider(2)));
		}
		else if (recom_stat == 'W') {
			$('#games, #sidebar').hide();
		}
		else {
			$('#games').show();
			$('#sidebar').hide();
			$('#games').width($('#content').width() -
				padding_from_slider(2));
		}
		adjust_margin();
	}


	//////////////////////////////////////////////////////////////////////////
	// MAIN JQUERY
	//////////////////////////////////////////////////////////////////////////

	// Display and remove the popups on hover.
	$(".game_cover").mouseenter(function(event) {
		// If the mouse comes from my OWN popup, do nothing.
		if ($(event.fromElement).hasClass("popup") &&
			$(this).closest($(event.fromElement).parent()).length > 0)
			return false;
		// Figure out which side the popup goes.
		shift_left($(this));
		// Stop the game box's animation and reset it to its regular size
		// so we can start expanding it.
		var resize_to = regular_dimensions();
		$(this).stop(true).
		width(resize_to[0]).height(resize_to[1]).
		// Expand it.
		animate({
			width:  $(this).width()  + padding_from_slider(2) - 2,
			height: $(this).height() + (padding_from_slider(2) / 1.3) - 2}, {
			duration: SPEED, easing: 'swing', complete: function() {
				// Save the timeout ID on the native DOM object.
				$(this).get(0).popup_timeout = setTimeout(
					function(that) {
						$('.popup').hide();
						// Only show the popup if the mouse is still onscreen.
						if (mouse_in)
							$(that).parents().eq(1).children('.popup').show();
					},
					Math.round(SPEED * 1.5), this
				);
			},
			step: function(now, fx) {
				if (fx.prop == 'width')
					$(this).children('img').width(fx.now);
				if (fx.prop == 'height')
					$(this).children('img').height(fx.now);
			}
		});
	});
	$(".game_cover_wrapper").mouseleave(function() {
		var resize_to = regular_dimensions();
		// Clear all popups and currently pending timeouts.
		$('.game_cover').each(function(index, popup){
			clearTimeout(popup.popup_timeout);
		});
		$('.popup').hide();
		// Stop any animation on the current game cover and shrink it back.
		var game_cover = $(this).find('.game_cover');
		game_cover.stop(true).animate({
			width   : resize_to[0],
			height  : resize_to[1],
			duration: SPEED}, {
			step    : function(now, fx) {
				if (fx.prop == 'width')
					game_cover.children('img').width(fx.now);
				if (fx.prop == 'height')
					game_cover.children('img').height(fx.now);
			}
		});
	});

	// Display slider.
	$("#slider").slider({min: 0, max: 100, value: 100, slide:
		function(event, ui) {
			var width  = Math.round((ui.value / 100 * 160) + 105);
			var height = Math.round(width * RATIO);
			$(".game_cover, .game_cover img").width(width).height(height);
			$(".game_cover_wrapper").
				width(width + padding_from_slider(2)).
				height(height + padding_from_slider(2));
			update_constants();
			adjust_margin(ui.value);
			resize_sidebar();
		}
	});

	// Don't propagate even to the parents when we mouse over the popup.
	$('.popup').mouseenter(function() {
		return false;
	});

	// Adjust to the new geometry, when the window is resized.
	$(window).bind("resize", function() {
		adjust_margin($('#slider').slider('option', 'value'));
		resize_sidebar();
	});

	// Delete all popups when the mouse leaves the games area or the whole
	// window.
	$('#games, window, document, body, html').mouseleave(function() {
		$('.popup').hide();
		mouse_in = false;
	});

	// Let us know the mouse is in the window.
	$('#games, window, document, body, html').mouseenter(function() {
		mouse_in = true;
	});

	// Expand the sidebar, or, if it's already expanded, collapse it.
	$('#sidebar').dblclick(toggle_sidebar);

	function make_resizable() {
		resize_sidebar().show().resizable({
			handles: "w", maxWidth: 300 + scrollbar_width(),
			minWidth: scrollbar_width() + 10,
			resize: function(event, ui) {
				$('#games').css('margin-right', ui.size.width);
			}
		});
	}

	$('#recommendations_tab').click(toggle_sidebar);


	//////////////////////////////////////////////////////////////////////////
	// STARTUP ACTIONS
	//////////////////////////////////////////////////////////////////////////

	$('.game_cover').each(function() {
		$(this).children('img').width($(this).width());
		$(this).children('img').height($(this).height());
	});

	// Initialize the margins from the slider, now that we have one.
	adjust_margin($('#slider').slider('option', 'value'));

	// make_resizable();

	//////////////////////////////////////////////////////////////////////////
	// IMPORTED
	//////////////////////////////////////////////////////////////////////////

	// From http://stackoverflow.com/questions/986937/
	//   how-can-i-get-the-browsers-scrollbar-sizes

	function getScrollBarWidth () {
		var inner = document.createElement('p');
		inner.style.width = "100%";
		inner.style.height = "200px";

		var outer = document.createElement('div');
		outer.style.position = "absolute";
		outer.style.top = "0px";
		outer.style.left = "0px";
		outer.style.visibility = "hidden";
		outer.style.width = "200px";
		outer.style.height = "150px";
		outer.style.overflow = "hidden";
		outer.appendChild (inner);

		document.body.appendChild (outer);
		var w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2 = inner.offsetWidth;
		if (w1 == w2) w2 = outer.clientWidth;

		document.body.removeChild (outer);

		return (w1 - w2);
	};
});