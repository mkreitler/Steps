ig.module( 
	'game.base-level' 
)
.requires(
	'game.horse-sprite',
	'game.free-stallion',
	'game.free-pinto',
	'game.ava-mare',
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
										new ig.Image("media/art/fence-tall-h.png"),
										new ig.Image("media/art/fence-tall-v.png"),
										new ig.Image("media/art/efence-tall-h.png"),
										new ig.Image("media/art/efence-tall-v.png"),
									],

	xFenceInfo: 	{bGate: false},

	widgetList: 	[],

	testLevel: 		[],
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
	
	victoryMessage: null,
	vicMsgDuration: 0,
	vicMsgCallback: null,

	scene: 				[
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
									[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
								],

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

	duke: 			null,
	ava: 				null,
	activeActor:null,
	bStarted: 	false,
	horsesSaved:0,
	totalHorses:0,

	workPair: 					{x:0, y:0},
	collisionResult:  	{x:0, y:0, bDidCollide: false, flags:0, oldRow:0, newRow:0, oldCol:0, newCol:0, oldChar:0, colCharNew:0, bVertical:false},

	activateDuke: function() {
		if (this.duke) {
			this.activeActor = this.duke;
		}
	},

	activateAva: function() {
		if (this.ava) {
			this.activeActor = this.ava;
		}
	},

	onPress: function(x, y) {
		var bConsumed = false;

		for (var i=0; i<this.widgetList.length; ++i) {
			if (this.widgetList[i].onPress(x, y)) {
				bConsumed = true;
				break;
			}
		}

		return bConsumed;
	},

	initLevel: function(geometry, actors, hints, victoryMessage, victoryMsgDuration, victoryMsgCallback) {
		this.messages 	= hints;
		this.victoryMessage = victoryMessage;
		this.vicMsgDuration = victoryMsgDuration;
		this.vicMsgCallback = victoryMsgCallback;
		this.horsesSaved = 0;
		this.totalHorses = 0;
		this.bStarted = false;
		this.activeActor = null;

		// Initialize the geometry.
		while (this.testLevel.length) {
			this.testLevel.pop();
		}

		// Build a copy of the level geometry.
		for (var iRow=0; iRow<geometry.length; ++iRow) {
			this.testLevel.push(geometry[iRow].concat(""));
		}

		// Free the previous field.
		for (var iRow=0; iRow<this.field.length; ++iRow) {
			while (this.field[iRow].length) {
				this.field[iRow].pop();
			}
		}

		// Initialize the scene.
		for (var iRow=0; iRow<this.actors.length; ++iRow) {
			for (var iCol=0; iCol<this.actors[iRow].length; ++iCol) {
				this.scene[iRow][iCol] = actors[iRow][iCol];
			}
		}

		// Remove animals.
		while (this.animals.length) {
			this.animals.pop();
		}
	},

	resetLevel: function() {
		// Stub.
	},

	start: function() {
		for (var i=0; this.messages && i<this.messages.length; ++i) {
			ig.Game.AddMessage(this.messages[i], null, -1);
		}

		this.horsesSaved = 0;
	},

	end: function() {
		// Wrap up the level on exit.
	},

	tallySafeHorse: function(horse) {
		this.removeFromScene(horse.getRow(), horse.getCol());
		this.horsesSaved += 1;

		if (this.horsesSaved === this.totalHorses) {
			ig.Game.FlushMessages();
			ig.Game.AddMessage(this.victoryMessage, null, this.vicMsgDuration, this.vicMsgCallback);
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
		var curDir = this.activeActor ? this.activeActor.getWantDir() : Constants.DIRECTION.NONE;

		while (this.activeActor && ig.Game.CommandReady()) {
			var cmd = ig.Game.UnqueueCommand();

			if (cmd === this.activeActor.getWantDir()) {
				continue;
			}
			else if (this.areOpposedDirections(curDir, cmd)) {
				// Order Duke to stop.
				this.activeActor.setDirection(Constants.DIRECTION.NONE);
				break;
			}
			else {
				this.activeActor.setDirection(cmd);
				this.activeActor.forceSpook();
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

	isFence: function(testChar) {
		return testChar !== '.';
	},

	isHighFence: function(testChar, bVertical) {
		var bIsHighFence = false;

		this.xFenceInfo.bGate = this.isGateChar(testChar);

		if (bVertical) {
			bIsHighFence = testChar === ']' || this.xFenceInfo.bGate;
		}
		else {
			bIsHighFence = testChar === '-' || this.xFenceInfo.bGate;
		}

		return bIsHighFence;
	},

	isGateChar: function(testChar) {
		return testChar === 'r' || testChar === 'l' ||
					 testChar === 't' || testChar === 'b';
	},

	isVerticalGate: function(testChar) {
		return testChar === 't' || testChar === 'b';
	},

	openGate: function(collisionInfo, direction) {
		var bGatesOpened = true;

		if (this.isGateChar(collisionInfo.oldChar)) {
			bGatesOpened &= this.moveGate(collisionInfo.oldChar, collisionInfo, direction, true);
		}

		if (this.isGateChar(collisionInfo.newChar)) {
			bGatesOpened &= this.moveGate(collisionInfo.newChar, collisionInfo, direction, false);
		}

		return bGatesOpened;
	},

	replaceChar: function(srcString, replaceIndex, newChar) {
		var foreString = srcString.substr(0, replaceIndex);
		var aftString = srcString.substr(replaceIndex + 1);
		return foreString + newChar + aftString;
	},

	isVerticalDirection: function(dir) {
		return dir === Constants.DIRECTION.UP || dir === Constants.DIRECTION.DOWN;
	},

	gateIsClear: function(collisionInfo) {
		// Make sure no animals block the gate's path.
	},

	moveGate: function(gateChar, collisionInfo, direction, bOld) {
		var bMoved = false;

		if (this.isVerticalGate(gateChar) && !this.isVerticalDirection(direction)) {
			var checkCol = bOld ? collisionInfo.oldCol : collisionInfo.newCol;
			var checkRow = bOld ? collisionInfo.oldRow : collisionInfo.newRow;
			var newCol = checkCol;
			var newRow = checkRow;
			var testCol = checkCol;
			var testRow = checkRow;
			var newChar = null;

			// Insert the new character.
			if (gateChar === 't') {
				// This gate is anchored on the top.
				if (direction === Constants.DIRECTION.LEFT) {
					newRow -= 1;
					newCol -= 1;
					testRow = Math.floor(checkRow / 2);
					testCol = Math.floor(newCol / 2);
					newChar = 'r';
				}
				else {
					newRow -= 1;
					newCol += 1;
					testRow = Math.floor(checkRow / 2);
					testCol = Math.floor(newCol / 2);
					newChar = 'l';
				}
			}
			else {
				// This gate is anchored on the bottom.
				if (direction === Constants.DIRECTION.LEFT) {
					newRow += 1;
					newCol -= 1;
					testRow = Math.floor(checkRow / 2);
					testCol = Math.floor(newCol / 2);
					newChar = 'r';
				}
				else {
					newRow += 1;
					newCol += 1;
					testRow = Math.floor(checkRow / 2);
					testCol = Math.floor(newCol / 2);
					newChar = 'l';
				}
			}

			// CHECK: is the new space unblocked?
			if (this.testLevel[newRow][newCol] === '.' &&
					this.scene[testRow][testCol] === 0 &&
					this.noActorsAt(testRow, testCol)) {

				// Replace the old character.
				var geoString = this.testLevel[checkRow];
				this.testLevel[checkRow] = this.replaceChar(geoString, checkCol, '.');

				// Move the game to its new location.
				geoString = this.testLevel[newRow];
				this.testLevel[newRow] = this.replaceChar(geoString, newCol, newChar);

				bMoved = true;
			}
		}
		else if (!this.isVerticalGate(gateChar) && this.isVerticalDirection(direction)) {
			var checkCol = bOld ? collisionInfo.oldCol : collisionInfo.newCol;
			var checkRow = bOld ? collisionInfo.oldRow : collisionInfo.newRow;
			var newCol = checkCol;
			var newRow = checkRow;
			var newChar = null;

			// Insert the new character.
			if (gateChar === 'l') {
				// This gate is anchored on the left.
				if (direction === Constants.DIRECTION.UP) {
					newRow -= 1;
					newCol -= 1;
					testRow = Math.floor(newRow / 2);
					testCol = Math.floor(checkCol / 2);
					newChar = 'b';
				}
				else {
					newRow += 1;
					newCol -= 1;
					testRow = Math.floor(newRow / 2);
					testCol = Math.floor(checkCol / 2);
					newChar = 't';
				}
			}
			else {
				// This gate is anchored on the right.
				if (direction === Constants.DIRECTION.UP) {
					newRow -= 1;
					newCol += 1;
					testRow = Math.floor(newRow / 2);
					testCol = Math.floor(checkCol / 2);
					newChar = 'b';
				}
				else {
					newRow += 1;
					newCol += 1;
					testRow = Math.floor(newRow / 2);
					testCol = Math.floor(checkCol / 2);
					newChar = 't';
				}
			}

			// CHECK: is the new space unblocked?
			if (this.testLevel[newRow][newCol] === '.' &&
					this.scene[testRow][testCol] === 0 &&
					this.noActorsAt(testRow, testCol)) {

				// Replace the old character.
				var geoString = this.testLevel[checkRow];
				this.testLevel[checkRow] = this.replaceChar(geoString, checkCol, '.');

				// Move the gate to its new location.
				geoString = this.testLevel[newRow];
				this.testLevel[newRow] = this.replaceChar(geoString, newCol, newChar);

				bMoved = true;
			}
		}

		return bMoved;
	},

	noActorsAt: function(row, col) {
		var bDukeClear = this.duke ? this.duke.getRow(true) !== row || this.duke.getCol(true) !== col : true;
		var bAvaClear  = this.ava ? this.ava.getRow(true) !== row || this.ava.getCol(true) !== col : true;

		return bDukeClear && bAvaClear;
	},

	findCharInGeometry: function(testChar) {
		var bFound = false;

		for (var iRow=0; iRow<this.testLevel.length; ++iRow) {
			var index = this.testLevel[iRow].indexOf(testChar);
			if (index >= 0) {
				this.workPair.y = iRow;
				this.workPair.x = index;
				bFound = true;
				break;
			}
		}

		return bFound;
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
		this.collisionResult.flags = 0;

		if (oldCol !== newCol) {
			// Check for collision along the x-direction.
			var testLevelCol = 2 * Math.max(oldCol, newCol);
			var oldLevelRow = 2 * oldRow + 1;
			var newLevelRow = 2 * newRow + 1;
			var colCharOld = this.testLevel[oldLevelRow].charAt(testLevelCol);
			var colCharNew = this.testLevel[newLevelRow].charAt(testLevelCol);

			if (this.isFence(colCharOld) || this.isFence(colCharNew)) {
				// Collision!
				this.collisionResult.x = oldX;
				this.collisionResult.bDidCollide = true;

				if (this.isHighFence(colCharOld, true) || this.isHighFence(colCharNew, true)) {
					if (this.xFenceInfo.bGate) {
						this.collisionResult.flags |= Constants.COLLISION_FLAGS.GATE;

						this.collisionResult.oldRow = oldLevelRow;
						this.collisionResult.newRow = newLevelRow;
						this.collisionResult.oldCol = testLevelCol;
						this.collisionResult.newCol = testLevelCol;
						this.collisionResult.oldChar = colCharOld;
						this.collisionResult.newChar = colCharNew;
						this.collisionResult.bVertical = true;
					}

					this.collisionResult.flags |= Constants.COLLISION_FLAGS.HIGH;
				}
			}
		}

		if (oldRow !== newRow) {
			// Check for collision along the y-direction.
			var testLevelRow = 2 * Math.max(oldRow, newRow);
			var oldLevelCol = 2 * oldCol + 1;
			var newLevelCol = 2 * newCol + 1;
			var colCharOld = this.testLevel[testLevelRow].charAt(oldLevelCol);
			var colCharNew = this.testLevel[testLevelRow].charAt(newLevelCol);

			if (this.isFence(colCharOld) || this.isFence(colCharNew)) {
				// Collision!
				this.collisionResult.y = oldY;
				this.collisionResult.bDidCollide = true;

				if (this.isHighFence(colCharOld, false) || this.isHighFence(colCharNew, false)) {
					if (this.xFenceInfo.bGate) {
						this.collisionResult.flags |= Constants.COLLISION_FLAGS.GATE;

						this.collisionResult.oldRow = testLevelRow;
						this.collisionResult.newRow = testLevelRow;
						this.collisionResult.oldCol = oldLevelCol;
						this.collisionResult.newCol = newLevelCol;
						this.collisionResult.oldChar = colCharOld;
						this.collisionResult.newChar = colCharNew;
						this.collisionResult.bVertical = false;
					}

					this.collisionResult.flags |= Constants.COLLISION_FLAGS.HIGH;
				}
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

	updateWidgets: function() {
		for (var i=0; i<this.widgetList.length; ++i) {
			this.widgetList[i].update();
		}
	},

	update: function() {
		if (this.duke) {
			this.duke.update(this);
			this.duke.checkBounds(this);
		}

		if (this.ava) {
			this.ava.update(this);
			this.ava.checkBounds(this);
		}

		for (var iRow=0; iRow<this.scene.length; ++iRow) {
			for (var iCol=0; iCol<this.scene[iRow].length; ++iCol) {
				var animalIndex = this.scene[iRow][iCol];
				if (animalIndex > 0) {
					var animal = this.animals[animalIndex - 1];
					if (animal) {
						animal.update(this);
						if (animal.checkBounds(this)) {
							if (animal.getRow() <= Constants.GOAL_ROW) {
					      this.tallySafeHorse(animal);

					      // TODO: End the level.
							}
							else {
								ig.Game.AddMessage("Escaped!");

								// TODO: End the level.
							}
						}
					}
				}
			}
		}

		this.updateWidgets();
	},

	collideWithSceneElements: function(mover, row, col, bNear) {
		var bDidCollide = false;
		var collider = null;

		if (this.duke && mover !== this.duke) {
			bDidCollide = row === this.duke.getRow(true) && col === this.duke.getCol(true);
			collider = this.duke;
		}
		else if (this.ava && mover !== this.ava) {
			bDidCollide = row === this.ava.getRow(true) && col === this.ava.getCol(true);
			collider = this.ava;
		}
		else {
			collider = this.getAnimalFromScene(row, col);
			bDidCollide = mover !== collider && collider !== null;
		}

		if (collider && mover.getWantDir() === collider.getWantDir()) {
			bDidCollide = false;
		}
		else if (collider && !bNear) {
			// Allow dynamic collision unless directions are opposed.
			bDidCollide = this.areOpposedDirections(mover.getWantDir(), collider.getWantDir());
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
						this.activateDuke();

						// Clear Duke's footprint from the scene.
						this.scene[iRow][iCol] = 0;
						break;
					}

					case 2: {
						// Spawn a solid stallion.
						this.animals.push(new FreeStallion(iRow, iCol, {frames: null}));
						this.scene[iRow][iCol] = this.animals.length;
						this.totalHorses += 1;
						break;
					}

					case 3: {
						// Spawn a pinto stallion.
						this.animals.push(new FreePinto(iRow, iCol, {frames: null}));
						this.scene[iRow][iCol] = this.animals.length;
						this.totalHorses += 1;
						break;
					}

					case 4: {
						// Spawn Ava and her mare.
						this.ava = new AvaMare(iRow, iCol, {frames: null});
						if (this.activeActor === null) {
							this.activateAva();
						}

						// Clear Ava's footprint from the scene.
						this.scene[iRow][iCol] = 0;
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
		var sheetRows = this.pastureImages[0].height / Constants.TILE_DY;
		var sheetCols = this.pastureImages[0].width / Constants.TILE_DX;

		for (var iRow=0; iRow<this.field.length; ++iRow) {
			var pastureSheet = iRow > 0 ? this.pastureImages[Constants.PASTURE_INDEX] : this.pastureImages[Constants.GOAL_PASTURE_INDEX];

			if (pastureSheet) {
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
		var avaRow = this.ava ? this.ava.getRow(true) : -1;
		var avaCol = this.ava ? this.ava.getCol(true) : -1;

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
				else if (fenceChar === "]") {
					this.fenceImages[Constants.INDEX_TALLVERT].draw(x, y);
				}
				else if (fenceChar === "-") {
					this.fenceImages[Constants.INDEX_TALLHORZ].draw(x, y);
				}
				else if (fenceChar === 't' || fenceChar === 'b') {
					this.fenceImages[Constants.INDEX_GATEVERT].draw(x, y);
				}
				else if (fenceChar === 'r' || fenceChar === 'l') {
					this.fenceImages[Constants.INDEX_GATEHORZ].draw(x, y);
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

					if (this.ava && sceneRow === avaRow && sceneCol === avaCol && !this.ava.isJumping()) {
						this.ava.draw();
					}

					if (this.duke && sceneRow === dukeRow && sceneCol === dukeCol && !this.duke.isJumping()) {
						this.duke.draw();
					}
				}
			}
		}
	},

	drawWidgets: function() {
		for (var i=0; i<this.widgetList.length; ++i) {
			this.widgetList[i].draw();
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
		this.drawWidgets();
	}

});

});
