ig.module( 
	'game.base-level' 
)
.requires(
	'game.horse-sprite',
	'game.free-stallion',
	'game.duke',
	'game.target',

	'impact.game',
	'impact.font'
)
.defines(function(){

// Window size: 1024 x 768
// Tile Size: 64 x 64
// Map size: 16 tiles x 12 tiles


BaseLevel = ig.Class.extend({
	pastureImages: 	[
										new ig.Image("media/art/pasture_spring.png"),
										new ig.Image("media/art/pasture_summer.png"),
										new ig.Image("media/art/pasture_fall.png"),
									],

	fenceImages: 		[
										new ig.Image("media/art/fence_h.png"),
										new ig.Image("media/art/fence_v.png"),
									],

	testLevel: 		null,
								// [
									// "...........................",
									// ".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									// "._._._._._._._._._..._._._.",
									// ".*|*|*.*.*.*.*.*.*.*.*.*.*.",
									// "...........................",
									// ".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									// "..............._...........",
									// ".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									// "..........._....._.........",
									// "|*.*.*.*.*|*.*.*.*|*.*.*.*.",
									// "...........................",
									// "|*.*.*.*.*|*.*.*.*|*.*.*.*.",
									// "...........................",
									// ".*.*.*.*.*|*.*.*.*|*.*.*.*.",
									// "..........._._._._.........",
									// "|*.*.*.*.*.*.*.*.*.*.*.*.*.",
									// "._.........................",
									// ".*.*.*.*.*.*.*.*.*.*.*.*.*.",
									// "...........................",
								// ],

	field: 				[
									[],
									[],
									[],
									[],
									[],
									[],
									[],
									[],
									[],
									[],
									[],
									],

	messages: 		null,
	
	scene: 				null,
								// [
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								// 	],

	animals: 			[],

	stage: 			Constants.STAGE_IDLE,
	duke: 			null,
	bStarted: 	false,

	workPair: 					{x:0, y:0},
	collisionResult:  	{x:0, y:0, bDidCollide: false, row:-1, col:-1},

	start: function() {
		for (var i=0; this.messages && i<this.messages.length; ++i) {
			ig.Game.AddMessage(this.messages[i], null, -1);
		}
	},

	removeFromScene: function(row, col) {
		if (row >= 0 && row < this.scene.length &&
				col >= 0 && col < this.scene[row].length) {
			this.scene[row][col] = 0;
		}
	},

	addToScene: function(row, col, sprite) {
		var animalIndex = this.animals.indexOf(sprite) + 1;

		if (animalIndex > 0 &&
				row >= 0 && row < this.scene.length &&
				col >= 0 && col < this.scene[row].length) {
			this.scene[row][col] = animalIndex;
		}
	},

	updateInput: function() {
		var curDir = this.duke ? this.duke.getWantDir() : Constants.DIRECTION.NONE;

		while (this.duke && ig.Game.CommandReady()) {
			var cmd = ig.Game.UnqueueCommand();

			if (cmd === this.duke.getWantDir()) {
				continue;
			}
			else if (this.areOpposedDirections(curDir, cmd)) {
				// Order Duke to stop.
				this.duke.setDirection(Constants.DIRECTION.NONE);
				break;
			}
			else {
				this.duke.setDirection(cmd);
				this.duke.forceSpook();
				break;
			}
		}
	},

	powerOfTwoToDir: function(power) {
		var direction = Constants.DIRECTION.NONE;

		while (power > 8) {
			power /= 16;
		}

		switch (power) {
			case 1: {
				direction = Constants.DIRECTION.UP;
				break;
			}

			case 2: {
				direction = Constants.DIRECTION.RIGHT;
				break;
			}

			case 4: {
				direction = Constants.DIRECTION.DOWN;
				break;
			}

			case 8: {
				direction = Constants.DIRECTION.LEFT;
				break;
			}
		}

		return direction;
	},

	dirToPowerOfTwo: function(dir) {
		var result = 1;

		if (this.isMovingDir(dir)) {
			for (var i=0; i<dir; ++i) {
				result *= 2;
			}
		}
		else {
			result = dir;
		}

		return result;
	},

	isMovingDir: function(dir) {
		return dir >= Constants.DIRECTION.UP && dir <= Constants.DIRECTION.LEFT;
	},

	areOpposedDirections: function(dir1, dir2) {
		var bOpposite = false;

		if (dir1 < Constants.DIRECTION.NONE && dir1 > Constants.DIRECTION.BLOCKED &&
				dir2 < Constants.DIRECTION.NONE && dir2 > Constants.DIRECTION.BLOCKED) {
			var val1 = this.dirToPowerOfTwo(dir1);
			var val2 = this.dirToPowerOfTwo(dir2);

			bOpposite = val2 > val1 ? val2 / val1 === 4 : val1 / val2 === 4;
		}

		return bOpposite;
	},

	checkStaticCollision: function(oldX, newX, toCenterX, collisionLeadX, oldY, newY, toCenterY, collisionLeadY) {
		var oldCenterX = oldX + toCenterX;
		var oldCenterY = oldY + toCenterY;

		var newCenterX = newX + toCenterX + collisionLeadX;
		var newCenterY = newY + toCenterY + collisionLeadY;

		var oldCol = Math.floor((oldCenterX - Constants.OFFSET_X) / Constants.TILE_DX);
		var newCol = Math.floor((newCenterX - Constants.OFFSET_X) / Constants.TILE_DX);

		var oldRow = Math.floor((oldCenterY - Constants.OFFSET_Y) / Constants.TILE_DY);
		var newRow = Math.floor((newCenterY - Constants.OFFSET_Y) / Constants.TILE_DY);

		this.collisionResult.x = newX;
		this.collisionResult.y = newY;
		this.collisionResult.bDidCollide = false;

		if (oldCol !== newCol) {
			// Check for collision along the x-direction.
			var testLevelCol = 2 * Math.max(oldCol, newCol);
			var oldLevelRow = 2 * oldRow + 1;
			var newLevelRow = 2 * newRow + 1;

			if (this.testLevel[oldLevelRow].charAt(testLevelCol) !== '.' ||
					this.testLevel[newLevelRow].charAt(testLevelCol) !== '.') {
				// Collision!
				this.collisionResult.x = oldX;
				this.collisionResult.bDidCollide = true;
			}
		}

		if (oldRow !== newRow) {
			// Check for collision along the y-direction.
			var testLevelRow = 2 * Math.max(oldRow, newRow);
			var oldLevelCol = 2 * oldCol + 1;
			var newLevelCol = 2 * newCol + 1;

			if (this.testLevel[testLevelRow].charAt(oldLevelCol) !== '.' ||
					this.testLevel[testLevelRow].charAt(newLevelCol) !== '.') {
				// Collision!
				this.collisionResult.y = oldY;
				this.collisionResult.bDidCollide = true;
			}
		}

		return this.collisionResult;
	},

	addRandomFences: function() {
		for (var i=0; i<15; ++i) {
			if (Math.random() < 0.5) {
				// Horizontal.
				row = Math.floor(Math.random() * (this.testLevel.length / 2 - 3) + 2) * 2;
				col = Math.floor(Math.random() * (this.testLevel[0].length / 2 - 3)) * 2 + 1;
				this.testLevel[row] = this.testLevel[row].substring(0, col) + '_' + this.testLevel[row].substr(col + 1);
			}
			else {
				// Vertical.
				row = Math.floor(Math.random() * (this.testLevel.length / 2 - 3) + 2) * 2 + 1;
				col = Math.floor(Math.random() * (this.testLevel[0].length / 2 - 3)) * 2;
				this.testLevel[row] = this.testLevel[row].substring(0, col) + '|' + this.testLevel[row].substr(col + 1);
			}
		}
	},

	update: function() {
		if (this.duke) {
			this.duke.update(this);
			this.duke.checkBounds(this);
		}

		for (var iRow=0; iRow<this.scene.length; ++iRow) {
			for (var iCol=0; iCol<this.scene[iRow].length; ++iCol) {
				var animalIndex = this.scene[iRow][iCol];
				if (animalIndex > 0) {
					var animal = this.animals[animalIndex - 1];
					if (animal) {
						animal.update(this);
						if (animal.checkBounds(this)) {
							if (animal.getRow() === Constants.ESCAPE_ROW &&
									animal.getCol() === Constants.ESCAPE_COL) {
								// TODO: record win.
							}
							else {
								// TODO: Show "Escaped" message.
							}
						}
					}
				}
			}
		}
	},

	collideWithSceneElements: function(mover, row, col) {
		var bDidCollide = false;

		if (mover !== this.duke) {
			bDidCollide = row === this.duke.getRow(true) && col === this.duke.getCol(true);
		}
		else {
			var collider = this.getAnimalFromScene(row, col);
			bDidCollide = mover !== collider && collider !== null;
		}

		return bDidCollide;
	},

	getAnimalFromScene: function(row, col) {
		var sceneAnimal = null;

		if (row >= 0 && row < this.scene.length &&
				col >= 0 && col < this.scene[row].length) {
			var animalIndex = this.scene[row][col] - 1;
			if (animalIndex >= 0 && animalIndex < this.animals.length) {
				sceneAnimal = this.animals[animalIndex];
			}
		}

		return sceneAnimal;
	},

	addAnimals: function() {
		for (var iRow=0; iRow<this.scene.length; ++iRow) {
			for (var iCol=0; iCol<this.scene[iRow].length; ++iCol) {
				switch(this.scene[iRow][iCol]) {
					case 1: {
						// Spawn Duke.
						this.duke = new Duke(iRow, iCol, {frames: null});

						// Clear Duke's footprint from the scene.
						this.scene[iRow][iCol] = 0;
						break;
					}

					case 2: {
						// Spawn a solid stallion.
						this.animals.push(new FreeStallion(iRow, iCol, {frames: null}));
						this.scene[iRow][iCol] = this.animals.length;
						break;
					}

					default: {
						// Empty cell. Do nothing.
						break;
					}
				}
			}
		}
	},

	createField: function() {
		var pastureSheet = this.pastureImages[Constants.PASTURE_INDEX];

		if (pastureSheet) {
			var sheetRows = pastureSheet.height / Constants.TILE_DY;
			var sheetCols = pastureSheet.width / Constants.TILE_DX;

			for (var iRow=0; iRow<this.testLevel.length; ++iRow) {
				for (var iCol=0; iCol<this.testLevel[iRow].length; ++iCol) {
					if (this.testLevel[iRow].charAt(iCol) === "*") {
						this.field[Math.floor(iRow / 2)].push(Math.floor(Math.random() * sheetRows * sheetCols));
					}
				}
			}
		}

		// this.addRandomFences();

		this.addAnimals();
	},

	drawBackground: function() {
		var pastureSheet = this.pastureImages[Constants.PASTURE_INDEX];

		if (pastureSheet) {
			var sheetRows = pastureSheet.height / Constants.TILE_DY;
			var sheetCols = pastureSheet.width / Constants.TILE_DX;

			for (var iRow=0; iRow<this.field.length; ++iRow) {
				var y = Constants.OFFSET_Y + iRow * Constants.TILE_DY;

				for (var iCol=0; iCol<this.field[iRow].length; ++iCol) {
					var x = Constants.OFFSET_X + iCol * Constants.TILE_DX;

					var spriteIndex = this.field[iRow][iCol];

					var spriteRow = Math.floor(spriteIndex / sheetCols);
					var spriteCol = spriteIndex - sheetCols * spriteRow;

					pastureSheet.draw(x, y, spriteCol * Constants.TILE_DX, spriteRow * Constants.TILE_DY, Constants.TILE_DX, Constants.TILE_DY);
				}
			}
		}
	},

	drawForeground: function() {
		var dukeRow = this.duke ? this.duke.getRow(true) : -1;
		var dukeCol = this.duke ? this.duke.getCol(true) : -1;

		for (var iRow=0; iRow<this.testLevel.length; ++iRow) {
			// Assume an even-indexed row.
			var y = (Math.floor(iRow / 2) - 0.5) * Constants.TILE_DY;

			if (iRow % 2) {
				// Odd-indexed row.
				y = Math.floor(iRow / 2) * Constants.TILE_DY;
			}

			y += Constants.OFFSET_Y;

			// Draw the fence row.
			for (var iCol=0; iCol<this.testLevel[iRow].length; ++iCol) {
				// Assume an even-indexed row.
				var x = (Math.floor(iCol / 2) - 0.5) * Constants.TILE_DX;

				if (iCol % 2) {
					// Odd-indexed row.
					x = Math.floor(iCol / 2) * Constants.TILE_DX;
				}

				var fenceChar = this.testLevel[iRow].charAt(iCol);

				x += Constants.OFFSET_X;
				if (fenceChar === "|") {
					this.fenceImages[Constants.INDEX_VERT].draw(x, y);
				}
				else if (fenceChar === "_") {
					this.fenceImages[Constants.INDEX_HORZ].draw(x, y);
				}

				if (iRow % 2 && iCol % 2) {
					// Draw any animals in this cell.
					var sceneRow = Math.floor(iRow / 2);
					var sceneCol = Math.floor(iCol / 2);
					var animalIndex = this.scene[sceneRow][sceneCol] - 1;

					if (animalIndex >= 0) {
						var sceneElement = this.animals[animalIndex];
						if (sceneElement) {
							sceneElement.draw();
						}
					}

					if (this.duke && sceneRow === dukeRow && sceneCol === dukeCol && !this.duke.isJumping()) {
						this.duke.draw();
					}
				}
			}
		}
	},

	drawAboveGround: function() {
		if (this.duke && this.duke.isJumping()) {
			this.duke.draw();
		}
	},

	draw: function() {
		this.drawBackground();
		this.drawForeground();
		this.drawAboveGround();
	}

});

});
