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
	spookPos: 					{x:0, y:0},
	updateIndex: 				-1,

	update: function(level) {
		// TODO: add something here.
	},

	setUpdateIndex: function(newIndex) {
		this.updateIndex = newIndex;
	},

	getUpdateIndex: function() {
		return this.updateIndex;
	},

	moveGoalSelected: function() { return this.bMoveGoalSelected; },

	setMoveGoalSelected: function() {
		this.bMoveGoalSelected = true;
	},

	getSpookOffsetX: function(dir) {
		var offsetX = 0;

		switch (dir) {
			case Constants.DIRECTION.RIGHT: {
				offsetX = 1;
				break;
			}

			case Constants.DIRECTION.LEFT: {
				offsetX = -1;
				break;
			}
		}

		return offsetX;
	},

	getSpookOffsetY: function(dir) {
		var offsetY = 0;

		switch (dir) {
			case Constants.DIRECTION.UP: {
				offsetY = -1;
				break;
			}

			case Constants.DIRECTION.DOWN: {
				offsetY = 1;
				break;
			}
		}

		return offsetY;
	},

	spookAnimalsInDirection: function(level, spookRadius, spookDir) {
		if (this.isMoving()) {
			var spookX = this.getX(false) + Constants.TILE_DX / 2 + this.getSpookOffsetX(spookDir) * spookRadius;
			var spookY = this.getY(false) + Constants.TILE_DY / 2 + this.getSpookOffsetY(spookDir) * spookRadius;
			var testRow = this.resolveRow(spookY);
			var testCol = this.resolveCol(spookX);
			var bIsDuke = this instanceof Duke;

			this.spookPos.x = this.resolveX(testCol);
			this.spookPos.y = this.resolveY(testRow);

			var spookedAnimal = level.getAnimalFromScene(testRow, testCol);
			if (spookedAnimal && spookedAnimal !== this) {
				var bSpookedIsMoving = spookedAnimal.isMoving();
				var spookedDir = spookedAnimal.getWantDir();
				if (!spookedAnimal.isMoving() || (bIsDuke && level.areOpposedDirections(spookedAnimal.getWantDir(), spookDir))) {
					// Spooked animal either isn't moving or is moving perpendicular to our path.
					spookedAnimal.setDirection(spookDir);
				}
			}
		}
	},

	spookAnimals: function(level, spookRadius) {
		this.spookAnimalsInDirection(level, spookRadius, this.wantDir);
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
