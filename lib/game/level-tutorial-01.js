ig.module( 
	'game.level-tutorial-01' 
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


LevelTutorial01 = GameLevel.extend({
	geometry: 		[
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"._._._._._._._..._._._._._.",
									"|*.*.*.*.*.*.*.2.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
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
									"Welcome to Steps! Click here for instructions...",
									"Use Duke (the black horse) to herd other horses...",
									"Herd them through holes in the top fence...",
									"Then watch them follow the road to Happy Valley...",
									"Press the 'up' key to try it out.",
								],

});

});
