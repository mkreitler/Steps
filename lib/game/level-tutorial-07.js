ig.module( 
	'game.level-tutorial-07' 
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


LevelTutorial07 = GameLevel.extend({
	geometry: 		[
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"._._._._._._._..._._._._._.",
									"|*.*.*.*.*.*.*.2.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"............._.l._.........",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"...........................",
									"|*.*.*.*.*.*.*.4.*.*.*.*.*|",
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
									"Sometimes you'll find steel gates...",
									"Duke can't open them, but Ava can...",
									"Just move her into the gate to open it...",
									"Press 'up' to try it."
								],

});

});
