ig.module( 
	'game.move-test' 
)
.requires(
	'game.horse-sprite',
	'game.duke',
	'game.target',

	'impact.game',
	'impact.font'
)
.defines(function(){

// Window size: 1024 x 768
// Tile Size: 64 x 64
// Map size: 16 tiles x 12 tiles


MoveTest = ig.Class.extend({
	goal: 					new Sprite(Constants.GOAL_X, Constants.GOAL_Y, {frames: new ig.Image("media/art/goal.png")}),

	pastureImages: 	[
										new ig.Image("media/art/pasture_spring.png"),
										new ig.Image("media/art/pasture_summer.png"),
										new ig.Image("media/art/pasture_fall.png"),
									],

	fenceImages: 		[
										new ig.Image("media/art/fence_h.png"),
										new ig.Image("media/art/fence_v.png"),
									],

	testLevel: 		[
									".............................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"._._._._._._._._._..._._._._.",
									".*|*|*.*.*.*.*.*.*.*.*.*.*.*.",
									"..........................._.",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"..............._..........._.",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"..........._....._........._.",
									"|*.*.*.*.*|*.*.*.*|*.*.*.*.*|",
									".............................",
									"|*.*.*.*.*|*.*.*.*|*.*.*.*.*.",
									".............................",
									".*.*.*.*.*|*.*.*.*|*.*.*.*.*.",
									"..........._._._._...........",
									"|*.*.*.*.*.*.*.*.*.*.*.*.*.*.",
									"._...........................",
									".*.*.*.*.*.*.*.*.*.*.*.*.*.*|",
									"._...........................",
									"|*.*.*.*.*.*.*.*.*.*.*.*|*|*|",
									".............................",
								],

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
	
	scene: 				[
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									],
	
	goals: 				[
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									],
	

	animals: 			[],
	waitList: 		[],

	stage: 			Constants.STAGE_IDLE,
	turnTimer: 	0,
	duke: 			null,
	bStarted: 	false,

	workPair: 	{x:0, y:0},

	updateInput: function() {
		if (!this.bStarted) {
			this.start();
		}
		else if (this.duke) {
			// Update Duke's input.
			this.processCommand();
		}
	},

	processCommand: function() {
		if (this.duke && ig.Game.CommandReady()) {
			var cmd = ig.Game.UnqueueCommand();
			if (this.isOppositeDirection(cmd, this.duke.getWantDir())) {
				this.duke.setDirection(Constants.DIRECTION.NONE);
				this.duke.setState(Constants.HORSE_STATE.WAITING);
			}
			else {
				this.duke.setDirection(cmd);
				if (this.duke.isMoving()) {
					this.duke.setState(Constants.HORSE_STATE.RUNNING);
				}
				else if (this.duke.getState() === Constants.HORSE_STATE.RUNNING) {
					this.duke.setState(Constants.HORSE_STATE.WAITING);
				}
				else {
					this.duke.setState(Constants.HORSE_STATE.RESTING);
				}
			}
		}
	},

	start: function() {
		// Move and activate the target.
		// Reset every animal's state.
		if (!this.bStarted) {
			this.bStarted = true;

			for (var i=0; i<this.animals.length; ++i) {
				this.animals[i].reset();
			}

			this.processCommand();

			this.stage = Constants.STAGE.SETUP;
		}
	},

	insertDukeIntoScene: function() {
		if (this.duke) {
			this.scene[this.duke.getRow()][this.duke.getCol()] = this.animals.indexOf(this.duke) + 1;
		}
	},

	chooseMovementGoals: function() {
		// Always start with Duke.
		var newMoveDir = Constants.DIRECTION.NONE;

		if (this.duke) {
			newMoveDir = this.resolvePlayerMovement(this.duke, 0);
			this.insertDukeIntoScene();
		}

		// Allow remaining animals to choose.
		for (var iRow=0; iRow<this.scene.length; ++iRow) {
			for (var iCol=0; iCol<this.scene[iRow].length; ++iCol) {
				if (this.scene[iRow][iCol] > 0) {
					var animalIndex = this.scene[iRow][iCol] - 1;
					var animal = this.animals[animalIndex];
					if (!(animal instanceof Duke) && !animal.moveGoalSelected()) {
						// Choose where we want to move.
						newMoveDir = this.chooseMovementGoal(animal, 0);
					}
				}
			}
		}
	},

	dirToPowerOfTwo: function(dir) {
		var result = 1;

		for (var i=0; i<dir; ++i) {
			result *= 2;
		}

		return result;
	},

	isOppositeDirection: function(dir1, dir2) {
		var bOpposite = false;

		if (dir1 < Constants.DIRECTION.NONE && dir1 > Constants.DIRECTION.BLOCKED &&
				dir2 < Constants.DIRECTION.NONE && dir2 > Constants.DIRECTION.BLOCKED) {
			var val1 = this.dirToPowerOfTwo(dir1);
			var val2 = this.dirToPowerOfTwo(dir2);

			bOpposite = val2 > val1 ? val2 / val1 === 4 : val1 / val2 === 4;
		}

		return bOpposite;
	},

	setup: function() {
		this.turnTimer = 0;

		this.stage = Constants.STAGE.RESOLVE;

		this.chooseMovementGoals();

		for (var i=0; i<this.animals.length; ++i) {
			if (this.animals[i].isMoving()) {
				this.animals[i].setState(Constants.HORSE_STATE.RUNNING);
			}
			else {
				if (this.animals[i].stateIs(Constants.HORSE_STATE.RUNNING)) {
					this.animals[i].setState(Constants.HORSE_STATE.WAITING);
				}
				else {
					this.animals[i].setState(Constants.HORSE_STATE.RESTING);
				}
			}
		}
	},

	resolve: function() {
		var oldTurnParam = this.turnTimer / Constants.TURN_LENGTH;
		this.turnTimer += ig.Game._dt;

		var turnParam = this.turnTimer / Constants.TURN_LENGTH;
		turnParam = Math.min(1, turnParam);

		if (oldTurnParam < 0.5 && turnParam >= 0.5) {
			// TODO: resolve mid-turn movement states.
		}

		if (oldTurnParam < 1 && turnParam >= 1) {
			// Signal the end of the 'resolve' round.
			this.stage = Constants.STAGE.FINISH;
		}

		this.resolvePlayerMovement(this.duke, 0);
		this.duke.resolveMove(0);
		this.insertDukeIntoScene();

		// Resolve animal movement.
		for (var i=0; i<this.animals.length; ++i) {
			if (!(this.animals[i] instanceof Duke)) {
				this.animals[i].resolveMove(turnParam);
			}
		}
	},

	finish: function() {
		// Update true positions.
		for (var i=0; i<this.animals.length; ++i) {
			if (!(this.animals[i] instanceof Duke)) {
				var row = this.animals[i].getRow();
				var col = this.animals[i].getCol();
				this.scene[row][col] = 0;

				if (!(this.animals[i] instanceof Duke)) {
					this.animals[i].updateTruePosition();
				}
			}
		}

		for (var i=0; i<this.animals.length; ++i) {
			if (!(this.animals[i] instanceof Duke)) {
				var row = this.animals[i].getRow();
				var col = this.animals[i].getCol();
				this.scene[row][col] = this.animals.indexOf(this.animals[i]) + 1;
			}
		}

		// Clear flags with one turn duration.
		for (var i=0; i<this.animals.length; ++i) {
			this.animals[i].endOfTurn();
		}

		this.clearGoals();

		// TODO: Check for end-of-turn conditions.
		if (this.roundOver()) {
			ig.Game.ShowRoundOverMessage();
			this.stage = Constants.STAGE.IDLE;
			this.endRound();
		}
		else {
			this.stage = Constants.STAGE.SETUP;
		}
	},

	endRound: function() {
		for (var i=0; i<this.animals.length; ++i) {
			this.animals[i].setState(Constants.HORSE_STATE.RESTING);
		}
	},

	roundOver: function() {
		var bEscaped = false;

		for (var i=0; !bEscaped && i<this.animals.length; ++i) {
			if (this.animals[i].getRow() < 0 ||
					this.animals[i].getRow() >= this.scene.length ||
					this.animals[i].getCol() < 2 ||
					this.animals[i].getCol() >= this.scene[0].length) {
				bEscaped = true;
				ig.Game.ShowEscapedText();
			}
		}

		return bEscaped;
	},

	clearGoals: function() {
		for (var iRow=0; iRow<this.goals.length; ++iRow) {
			for (var iCol=0; iCol<this.goals[iRow].length; ++iCol) {
				this.goals[iRow][iCol] = 0;
			}
		}
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
		if (this.stage === Constants.STAGE.SETUP) {
			this.setup();
		}

		if (this.stage === Constants.STAGE.RESOLVE) {
			this.resolve();
		}

		if (this.stage === Constants.STAGE.FINISH) {
			this.finish();
		}
	},

	spookNeighbor: function(mover, wantDir, moverRow, moverCol) {
		// First, spook any animal directly in our path.
		if (mover && wantDir > Constants.DIRECTION.BLOCKED && wantDir < Constants.DIRECTION.NONE) {
			this.getRowColDeltasForDirection(wantDir)

			var checkRow = moverRow + this.workPair.y;
			var checkCol = moverCol + this.workPair.x;

			if (checkRow >= 0 && checkRow < Constants.ROWS &&
				  checkCol >= 0 && checkCol < Constants.COLS) {

				var spookIndex = this.scene[checkRow][checkCol] - 1;
				if (spookIndex >= 0 && spookIndex < this.animals.length) {

					var spookedAnimal = this.animals[spookIndex];
					if (spookedAnimal && !(spookedAnimal instanceof Duke)) {	// !!! better way to check state to see if it's updated?

						if ((mover instanceof Duke) || !this.isHeadOnCollisionBetween(mover, spookedAnimal, wantDir)) {
							if (!spookedAnimal.isMoving()) {
								spookedAnimal.setSpooked(true);
							}

							if (!spookedAnimal.isMoving()) {
								spookedAnimal.setDirection(wantDir);
							}

							this.chooseMovementGoal(spookedAnimal, 0);
							spookedAnimal.setSpooked(false);
						}
					}
				}
			}
		}
	},

	isHeadOnCollisionBetween: function(mover, blocker, testDir) {
		var bHeadOn = false;

		if (this.getRowColDeltasForDirection(testDir)) {
			var moverRow = mover ? mover.getRow(false) : -1;
			var moverCol = mover ? mover.getCol(false) : -1;
			var checkRow = moverRow + this.workPair.y;
			var checkCol = moverCol + this.workPair.x;

			var moverTest = null;
			var blockerTest = null;

			var testIndex = this.scene[checkRow][checkCol];
			if (testIndex > 0) {
				moverTest = this.animals[testIndex - 1];
			}

			if (this.getRowColDeltasForDirection(blocker.getWantDir())) {
				var blockerRow = blocker ? blocker.getRow(false) : -1;
				var blockerCol = blocker ? blocker.getCol(false) : -1;
				checkRow = blockerRow + this.workPair.y;
				checkCol = blockerCol + this.workPair.x;

				testIndex = this.scene[checkRow][checkCol];
				if (testIndex > 0) {
					blockerTest = this.animals[testIndex - 1];
				}
			}

			bHeadOn = moverTest &&
								blockerTest &&
								moverTest === blocker &&
								blockerTest === mover;
		}

		return bHeadOn;
	},

	chooseMovementGoal: function(mover, testIndex) {
		var wantDir = mover ? mover.getWantDir() : Constants.DIRECTION.NONE;
		var moverRow = mover ? mover.getRow(false) : -1;
		var moverCol = mover ? mover.getCol(false) : -1;
		var pattern = mover && mover.isMoving() ? mover.getPattern(wantDir) : null;
		var maxDepth = pattern ? pattern.length : 1;
		var newDir = wantDir;

		if (testIndex >= maxDepth) {
			newDir = Constants.DIRECTION.BLOCKED;

			mover.setMoveGoalSelected();
			mover.setDirection(newDir);
		}
		else if (mover && pattern && (!mover.moveGoalSelected() || mover.isSpooked())) {
			// First, spook any animal directly in our path.
			if (pattern && mover && mover.isMoving()) {
				this.spookNeighbor(mover, pattern[testIndex], moverRow, moverCol);
			}

			// Next, use the "pattern" to search for a clear
			// place to move. In each direction, check for a
			// fence first, then an animal. If obstructed,
			// check to see if it's a "hard" or "soft" blockage
			// (hard blocks stop progress, soft blocks, like
			// other animals, can sometimes move, allowing
			// progress to continue).

			if (wantDir !== Constants.DIRECTION.NONE) {
				var testDir = pattern[testIndex];
				if (this.getRowColDeltasForDirection(testDir)) {
					var levelRow = 2 * moverRow + 1;
					var levelCol = 2 * moverCol + 1;
					var testRow = levelRow + this.workPair.y;
					var testCol = levelCol + this.workPair.x;
					var sceneRow = moverRow + this.workPair.y;
					var sceneCol = moverCol + this.workPair.x;

					if (testRow >= 0 && testRow < this.testLevel.length &&
							testCol >= 0 && testCol < this.testLevel[0].length &&
							sceneRow >= 0 && sceneRow < this.scene.length &&
							sceneCol >= 0 && sceneCol < this.scene[0].length) {

						var levelElement = this.testLevel[testRow].charAt(testCol);
						var blockType = mover.getBlockTypeForLevelElement(levelElement);

						if (blockType === Constants.BLOCK_TYPE.NONE) {
							// Check for a blocking animal.
							var blockerIndex = this.scene[sceneRow][sceneCol];
							var blocker = blockerIndex > 0 ? this.animals[blockerIndex - 1] : null;

							if (blocker) {
								var blockerDir = blocker.getWantDir();

								if (this.isHeadOnCollisionBetween(mover, blocker, testDir)) {
									blockType = Constants.BLOCK_TYPE.HARD;
								}
								else if (!blocker.isMoving() && blocker.blocks()) {
									blockType = Constants.BLOCK_TYPE.HARD;
								}
								else if (blockerDir === Constants.DIRECTION.BLOCKED) {
									blockType = Constants.BLOCK_TYPE.HARD;
								}
								else {
									// Make sure there isn't already someone trying to
									// move into this space.
									if (this.goals[sceneRow][sceneCol] < 0) {
										blockType = Constants.BLOCK_TYPE.HARD;
									}
								}
							}
							else {
								// If no blocking animal, check to see if another animal wants
								// the space into which we're trying to move.
								if (this.goals[sceneRow][sceneCol] < 0) {
									blockType = Constants.BLOCK_TYPE.HARD;
								}
							}
						}
					}
					else {
						blockType = Constants.BLOCK_TYPE.NONE;
					}

					if (blockType === Constants.BLOCK_TYPE.NONE) {
						newDir = testDir;
						this.goals[sceneRow][sceneCol] -= 1;
					}
					else if (testIndex < pattern.length) {
						newDir = this.chooseMovementGoal(mover, testIndex + 1);
					}
					else {
						// BLOCK_TYPE.HARD
						newDir = Constants.DIRECTION.BLOCKED;
					}
				}
			}

			mover.setMoveGoalSelected();
			mover.setDirection(newDir);
		}

		return newDir;
	},

	resolvePlayerMovement: function(mover, testIndex) {
		var wantDir = mover ? mover.getWantDir() : Constants.DIRECTION.NONE;
		var moverRow = mover ? mover.getRow(false) : -1;
		var moverCol = mover ? mover.getCol(false) : -1;
		var pattern = mover && mover.isMoving() ? mover.getPattern(wantDir) : null;
		var maxDepth = pattern ? pattern.length : 1;
		var newDir = wantDir;

		if (mover) {
			// First, spook any animal directly in our path.
			this.spookNeighbor(mover, wantDir, moverRow, moverCol);

			this.scene[mover.getRow()][mover.getCol()] = 0;

			// Next, use the "pattern" to search for a clear
			// place to move. In each direction, check for a
			// fence first, then an animal. If obstructed,
			// check to see if it's a "hard" or "soft" blockage
			// (hard blocks stop progress, soft blocks, like
			// other animals, can sometimes move, allowing
			// progress to continue).

			if (wantDir !== Constants.DIRECTION.NONE) {
				var testDir = wantDir;
				if (this.getRowColDeltasForDirection(testDir)) {
					var levelRow = 2 * moverRow + 1;
					var levelCol = 2 * moverCol + 1;
					var testRow = levelRow + this.workPair.y;
					var testCol = levelCol + this.workPair.x;
					var sceneRow = moverRow + this.workPair.y;
					var sceneCol = moverCol + this.workPair.x;

					if (testRow >= 0 && testRow < this.testLevel.length &&
							testCol >= 0 && testCol < this.testLevel[0].length &&
							sceneRow >= 0 && sceneRow < this.scene.length &&
							sceneCol >= 0 && sceneCol < this.scene[0].length) {

						var levelElement = this.testLevel[testRow].charAt(testCol);
						var blockType = mover.getBlockTypeForLevelElement(levelElement);

						if (blockType === Constants.BLOCK_TYPE.NONE) {
							// Check for a blocking animal.
							var blockerIndex = this.scene[sceneRow][sceneCol];
							var blocker = blockerIndex > 0 ? this.animals[blockerIndex - 1] : null;

							if (blocker) {
								if (this.isHeadOnCollisionBetween(mover, blocker, testDir)) {
									blockType = Constants.BLOCK_TYPE.HARD;
								}
								else if (this.scene[sceneRow][sceneCol] < 0) {
									blockType = Constants.BLOCK_TYPE.HARD;
								}
							}
							else {
								// If no blocking animal, check to see if another animal wants
								// the space into which we're trying to move.
								if (this.goals[sceneRow][sceneCol] < 0) {
									blockType = Constants.BLOCK_TYPE.HARD;
								}
							}
						}
					}
					else {
						blockType = Constants.BLOCK_TYPE.HARD;
					}

					if (blockType === Constants.BLOCK_TYPE.NONE) {
						newDir = testDir;
					}
					else {
						// BLOCK_TYPE.HARD
						newDir = Constants.DIRECTION.BLOCKED;
					}
				}
			}

			mover.setMoveGoalSelected();
			mover.setDirection(newDir);
		}

		return newDir;
	},

	getRowColDeltasForDirection: function(dir) {
		var bNonZeroDelta = true;

		switch (dir) {
			case Constants.DIRECTION.UP: {
				this.workPair.x = 0;
				this.workPair.y = -1;
				break;
			}

			case Constants.DIRECTION.RIGHT: {
				this.workPair.x = 1;
				this.workPair.y = 0;
				break;
			}

			case Constants.DIRECTION.DOWN: {
				this.workPair.x = 0 ;
				this.workPair.y = 1;
				break;
			}

			case Constants.DIRECTION.LEFT: {
				this.workPair.x = -1;
				this.workPair.y = 0;
				break;
			}

			default: {
				this.workPair.x = 0;
				this.workPair.y = 0;
				bNonZeroDelta = false;
				break;
			}
		}

		return bNonZeroDelta;
	},

	addAnimals: function() {
		for (var iRow=0; iRow<this.scene.length; ++iRow) {
			for (var iCol=0; iCol<this.scene[iRow].length; ++iCol) {
				switch(this.scene[iRow][iCol]) {
					case 1: {
						// Spawn Duke.
						this.duke = new Duke(iRow, iCol, {frames: null});
						this.animals.push(this.duke);
						this.scene[iRow][iCol] = this.animals.length;

						break;
					}

					case 2: {
						// Spawn a solid stallion.
						this.animals.push(new HorseSprite(iRow, iCol, {frames: null}));
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
				var y = iRow * Constants.TILE_DY;
				y += Constants.OFFSET_X;

				for (var iCol=0; iCol<this.field[iRow].length; ++iCol) {
					var x = iCol * Constants.TILE_DX;

					var spriteIndex = this.field[iRow][iCol];

					var spriteRow = Math.floor(spriteIndex / sheetCols);
					var spriteCol = spriteIndex - sheetCols * spriteRow;

					x += Constants.OFFSET_X;
					pastureSheet.draw(x, y, spriteCol * Constants.TILE_DX, spriteRow * Constants.TILE_DY, Constants.TILE_DX, Constants.TILE_DY);
				}
			}
		}

		if (this.goal) {
			this.goal.drawSimple();
		}
	},

	drawForeground: function() {
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
					// DEBUG: show movement goals.
					if (true) {
						var sceneRow = Math.floor(iRow / 2);
						var sceneCol = Math.floor(iCol / 2);
						var goalValue = this.goals[sceneRow][sceneCol];

						if (goalValue < 0) {
							var ctx = ig.system.context;
							ctx.save();

							ctx.globalAlpha = 0.33;

							if (goalValue === -1) {
								ctx.fillStyle = "#FFFF00";
							}
							else {
								ctx.fillStyle = "#FF0000";
							}

							ctx.beginPath();
							var arcY = sceneRow * Constants.TILE_DY + Constants.OFFSET_Y + Constants.TILE_DY / 2;
							var arcX = sceneCol * Constants.TILE_DX + Constants.OFFSET_X + Constants.TILE_DX / 2;
							ctx.arc(arcX, arcY, Constants.TILE_DX / 2, 0, 2 * Math.PI, true);
							ctx.closePath();
							ctx.fill();

							ctx.globalAlpha = 1;

							ctx.restore();
						}
					}

					// Draw any animals in this cell.
					var animalIndex = this.scene[Math.floor(iRow / 2)][Math.floor(iCol / 2)] - 1;

					if (animalIndex >= 0) {
						var sceneElement = this.animals[animalIndex];
						if (sceneElement) {
							sceneElement.draw();
						}
					}
				}
			}
		}
	},

	draw: function() {
		this.drawBackground();
		this.drawForeground();
	}

});

});
