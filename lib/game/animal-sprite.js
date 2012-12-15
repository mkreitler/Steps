ig.module( 
	'game.animal-sprite' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.sprite'
)
.defines(function(){

AnimalSprite = Sprite.extend({
	bMoveGoalSelected: 	false,
	pattern: 						null,
	bSpooked: 					false,

	moveGoalSelected: function() { return this.bMoveGoalSelected; },

	setMoveGoalSelected: function() {
		this.bMoveGoalSelected = true;
	},

	setSpooked: function(bSpooked) {
		this.bSpooked = bSpooked;
	},

	isSpooked: function() {
		return this.bSpooked;
	},

	chooseMoveGoal: function() {
		// Stub.
	},

	endOfTurn: function() {
		this.bMoveGoalSelected = false;
	},

	blocks: function() {
		return false;
	},

	getPattern: function(dir) {
		return this.pattern && dir >= 0 && dir < this.pattern.length ? this.pattern[dir] : null;
	},

	getBlockTypeForLevelElement: function(element) {
		return element === "." ? Constants.BLOCK_TYPE.NONE : Constants.BLOCK_TYPE.HARD;
	},

	reset: function() {
		this.wantDir 						= Constants.DIRECTION.NONE;
		this.bMoveGoalSelected	= false;
	},

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.reset();
	}

});

});
