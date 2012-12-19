ig.module( 
	'game.level-tutorial-04' 
)
.requires(
	'game.game-level',

	'impact.game',
	'impact.font'
)
.defines(function(){

// Window size: 1024 x 768
// Tile Size: 64 x 64
// Map size: 16 tiles x 12 tiles


LevelTutorial04 = GameLevel.extend({
	geometry: 		[
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"._._._._._._._._._._..._._.",
									"|*.*.*.*.*.*.*.*.*.*.*|*.*|",
									"....................._.....",
									"|*.*.*.*.*.*.*.2.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.1.*.*.*.*.*|",
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

	hints: 				[
									"When horses hit a barrier, they change direction...",
									"Horses with solid coats turn right first...",
									"If they can't turn right, they turn left...",
									"Press the 'up' arrow to see it happen."
								],

});

});
