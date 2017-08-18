$(document).ready(function() {

	var simon = {
		colors: ['green', 'red', 'yellow', 'blue'],
		strictMode: false,
		turn: 0,
		sounds: {
			green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
			red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
			yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
			blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
		},
		// setup event listeners for buttons
		setup: function() {
			$('.game-button').click(function() {
				var color = $(this).attr('id');

				game.pushButton(color);

				if (game.start) {
					game.check(color);
				}
			});

			$('#strict').change(function() {
				simon.strictMode = !simon.strictMode;
			});
		},
		playSound: function(color) {
			simon.sounds[color].play();
		},
		turnLight: function(color) {
			// simulate button lighting up
			$('#' + color).addClass('light-' + color);
			// turn off light after 500 ms
			setTimeout(function () {
				$('#' + color).removeClass('light-' + color);
			}, 500);
		},
		turnDisplay: function(message) {
			$('#turn').text(message);
		},
		stopButton: function() {
			$('#play').html('<i class="remove icon"></i>').addClass('stop');
		}
	};

	var game = {
		start: false,
		count: 0,
		steps: [],
		addSteps: function() {
			game.steps.push(game.newStep());
			game.playSteps();
		},
		newStep: function() {
			var step =  Math.round(Math.random() * 3);
			return simon.colors[step];
		},
		playSteps: function() {
			simon.turnDisplay(simon.turn);
			game.steps.forEach(function(color, index) {
				// multiply by the index to delay sequence of button pushes by one second each
				setTimeout(function() {
					game.pushButton(color);
				}, 1000 * index);
			});
		},
		pushButton: function(color) {
			simon.turnLight(color);
			simon.playSound(color);
		},
		check: function(color) {
			// compare current button push with the corresponding element in the steps array
			if (color === game.steps[game.count]) {
				game.count++;

				if (game.count === game.steps.length) {
					game.count = 0;
					simon.turn++;

					if (simon.turn > 20) {
						game.win();
					} else {
						simon.turnDisplay(simon.turn);
						setTimeout(game.addSteps, 1000);
					}
				}
			} else {
				game.wrongMove();
			} 
		},
		reset: function(time) {
			game.count = 0;
			simon.turn = 1;
			game.steps = [];
			game.start = false;
			$('#play').html('<i class="play icon"></i>').removeClass('stop');
			setTimeout(function() {
				simon.turnDisplay('--');
			}, time);
		},
		wrongMove: function() {
			simon.turnDisplay('!!!');
			if (simon.strictMode) {
				game.reset(1000);
			} else {
				game.count = 0;
				setTimeout(game.playSteps, 1000);
			}
		},
		win: function() {
			simon.turnDisplay('Win!');
			game.reset(1500);
		}
	};

	$('#play').click(function() {
		game.start = !game.start;

		if ($(this).hasClass('stop')) {
			game.reset(100);
		} else {
			simon.turn = 1;
			simon.stopButton();
			simon.turnDisplay(simon.turn);
			game.addSteps();
		}
	});

	function init() {
		simon.setup();
	}

	init();
});