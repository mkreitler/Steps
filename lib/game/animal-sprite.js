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
	bUpdated: 					false,

	update: function(level) {
		this.bUpdated = true;
	},

	prepForUpdate: function() {
		this.bUpdated = false;
	},

	hasUpdated: function() {
		bUpdated = true;
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

			var spookedAnimals = level.getAnimalsFromScene(testRow, testCol);
			for (var iAnimal=0; iAnimal<spookedAnimals.length; ++iAnimal) {

				var spookedAnimal = spookedAnimals[iAnimal];
				if (spookedAnimal && spookedAnimal !== this) {
					if (level.addToSpookList(spookedAnimal)) {

						var bSpookedIsMoving = spookedAnimal.isMoving();
						var spookedDir = spookedAnimal.getWantDir();
						if (!bSpookedIsMoving ||
							  (bIsDuke &&
							   !level.areOpposedDirections(spookedAnimal.getWantDir(), spookDir) &&
							   level.isClearInDirection(spookedAnimal, spookDir).bIsClear)) {

							// We can spook this animal.
							spookedAnimal.setDirection(spookDir);
							if (!spookedAnimal.hasUpdated()) {
								level.updateAnimal(spookedAnimal);
							}
						}
					}
					else {
						// Entered a recursive loop. Abort the operation.
						break;
					}
				}
			}
		}

		// if (this.isMoving()) {
		// 	var spookX = this.getX(false) + Constants.TILE_DX / 2 + this.getSpookOffsetX(spookDir) * spookRadius;
		// 	var spookY = this.getY(false) + Constants.TILE_DY / 2 + this.getSpookOffsetY(spookDir) * spookRadius;
		// 	var testRow = this.resolveRow(spookY);
		// 	var testCol = this.resolveCol(spookX);
		// 	var bIsDuke = this instanceof Duke;

		// 	this.spookPos.x = this.resolveX(testCol);
		// 	this.spookPos.y = this.resolveY(testRow);

		// 	var spookedAnimals = level.getAnimalsFromScene(testRow, testCol);
		// 	for (var iAnimal=0; iAnimal<spookedAnimals.length; ++iAnimal) {
		// 		var spookedAnimal = spookedAnimals[iAnimal];
		// 		if (spookedAnimal && spookedAnimal !== this) {
		// 			var oldDir = spookedAnimal.getWantDir();

		// 			var bCanBeSpooked = !spookedAnimal.isMoving() && !spookedAnimal.isRearing();
		// 			var bSpooked = false;
		// 			if (bCanBeSpooked ||
		// 				  (bIsDuke && !level.areOpposedDirections(spookedAnimal.getWantDir(), spookDir))) {

		// 				// Spook the animal according to its pattern.
		// 		    var pattern = spookedAnimal.getSpookPattern(spookDir);
		// 		    var nTests = pattern ? pattern.length : 1;
  // 					var testDir = spookDir;

  // 					spookedAnimal.setDirection(testDir);

		// 		    for (var i=0; i<nTests; ++i) {
		// 		      testDir = pattern ? pattern[i] : testDir;
		// 		      colResults = level.isClearInDirection(spookedAnimal, testDir);

		// 		      var bBlockedByColliders = false;
		// 		      if (colResults.bIsClear && colResults.colliders) {
		// 		      	for (var iCollider=0; iCollider<colResults.colliders.length; ++iCollider) {
		// 		      		var collider = colResults.colliders[iCollider];

		// 		      		if (collider && collider.getWantDir() !== testDir) {
		// 		      			bBlockedByColliders = collider.isMoving();
		// 		      			break;
		// 		      		}
		// 		      	}
		// 		      }

		// 					if (colResults.bIsClear && !bBlockedByColliders) {
		// 						// There is no obstructing actor or static geometry.
		// 						// Any animals in our way are not moving or moving in our direction.
		// 						// Go ahead and "spook".
		// 						if (!spookedAnimal.hasUpdated()) {
		// 							level.updateAnimal(spookedAnimal);
		// 						}

		// 						bSpooked = true;
		// 						break;
		// 					}
		// 				}
		// 			}
		// 			else {
		// 				// Entered a recursive loop. Abort the operation.
		// 				break;
		// 			}

		// 			if (!bSpooked) {
		// 				spookedAnimal.setDirection(oldDir);
		// 			}
		// 		}
		// 	}
		// }
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
