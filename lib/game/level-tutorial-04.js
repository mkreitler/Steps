ig.module( 
	'game.level-tutorial-04' 
)
.requires(
	'game.base-level',

	'impact.game',
	'impact.font'
)
.defines(function(){

// Window size: 1024 x 768
// Tile Size: 64 x 64
// Map size: 16 tiles x 12 tiles


LevelTutorial04 = BaseLevel.extend({
	geometry: 		[
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"._._._._._._._._._._..._._.",
									"|*.*.*.*.*.*.*.*.*.*.*|*.*|",
									"....................._.....",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"._._._._._._._._._._._._._.",
								],

	actors: 			[
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								],

	hints: 				[
									"When horses hit a barrier, they change direction.",
									"Horses with solid coats turn right first.",
									"If they can't turn right, they turn left.",
									"Press the 'up' key to see how this works."
								],

	init: function() {
		this.initLevel(this.geometry, this.actors, this.hints, Constants.TEXT_TUTORIAL_VICTORY, Constants.VICTORY_MSG_DURATION, ig.Game._game.nextLevel.bind(ig.Game._game));
	}

});

});
