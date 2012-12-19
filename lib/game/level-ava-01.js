ig.module( 
	'game.level-ava-01' 
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


LevelAva01 = GameLevel.extend({
	geometry: 		[
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"........._..._..._.........",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"...........r._.l...........",
									".*.*.*.*.*|*.4.*|*.*.*.*.*.",
									"..........._._._...........",
									".*.*.*.*|*.2.*.3.*|*.*.*.*.",
									"........._._._._._.........",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"...........................",
								],

	hints: 				[
									"What a strange corral. Should we be worried?",
								],

});

});