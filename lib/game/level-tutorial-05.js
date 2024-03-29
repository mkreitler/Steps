ig.module( 
	'game.level-tutorial-05' 
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


LevelTutorial05 = GameLevel.extend({
	geometry: 		[
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"._._._._..._._._._._._._._.",
									"|*.*.*.*|*.*.*.*.*.*.*.*.*|",
									"........._.................",
									"|*.*.*.*.*.*.*.3.*.*.*.*.*|",
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
									"Pintos (spotted horses) turn left first...",
									"If they can't turn left, they turn right...",
									"Press the 'up' key and watch how the horse moves."
								],

});

});
