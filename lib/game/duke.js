ig.module( 
	'game.duke' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.horse-sprite'
)
.defines(function(){

Duke = HorseSprite.extend({
	gender: 			Constants.GENDER.MALE,
	coat: 				Constants.COAT.SOLID,
	state: 				Constants.HORSE_STATE.RESTING,
  correctSign:  {x:0, y:0},

  blocks: function() {
    return true;
  },

  drawDebugLocations: function() {
    return true;
  },

  draw: function() {
    this.parent();
    this.drawDebug();
  },

  update: function(level) {
    this.parent(level);

    this.resolveMove(level);
  },

  setDirection: function(newDir) {
    this.parent(newDir);

    if (newDir === Constants.DIRECTION.BLOCKED) {
      this.setState(Constants.HORSE_STATE.WAITING);
    }
    else if (this.state === Constants.HORSE_STATE.RUNNING && (newDir === Constants.DIRECTION.NONE || newDir === Constants.DIRECTION.BLOCKED)) {
      this.setState(Constants.HORSE_STATE.WAITING);
    }
    else if (newDir === Constants.DIRECTION.NONE) {
      this.setState(Constants.HORSE_STATE.RESTING);
    }
    else {
      this.setState(Constants.HORSE_STATE.RUNNING);
    }
  },

  resolveMove: function(level) {
    var dMove = ig.Game._dt / Constants.TURN_LENGTH;

    var bReduceLateralSlop = false;
    var bReduceVerticalSlop = false;

    var oldX = this.visualGridPos.x;
    var oldY = this.visualGridPos.y;

    var newX = oldX;
    var newY = oldY;

    var collisionLeadX = 0;
    var collisionLeadY = 0;

    switch (this.wantDir) {
      case Constants.DIRECTION.BLOCKED: case Constants.DIRECTION.NONE: {
        // Don't move when blocked.
        bReduceLateralSlop = true;
        bReduceVerticalSlop = true;
        this.correctSign.x = 0;
        this.correctSign.y = 0;
        break;
      }

      case Constants.DIRECTION.UP: {
        newY -= dMove * Constants.TILE_DY;
        this.correctSign.y = -1;
        bReduceLateralSlop = true;
        collisionLeadY = -Constants.TILE_DY / 4;
        break;
      }

      case Constants.DIRECTION.RIGHT: {
        newX += dMove * Constants.TILE_DX;
        this.correctSign.x = 1;
        bReduceVerticalSlop = true;
        collisionLeadX = Constants.TILE_DX / 4;
        break;
      }

      case Constants.DIRECTION.DOWN: {
        newY += dMove * Constants.TILE_DY;
        this.correctSign.y = 1;
        bReduceLateralSlop = true;
        collisionLeadY = Constants.TILE_DY / 4;
        break;
      }

      case Constants.DIRECTION.LEFT: {
        newX -= dMove * Constants.TILE_DX;
        this.correctSign.x = -1;
        bReduceVerticalSlop = true;
        collisionLeadX = -Constants.TILE_DX / 4;
        break;
      }
    }

    newX = Math.round(newX);
    newY = Math.round(newY);

    var collisionResults = level.checkStaticCollision(oldX, newX, Constants.TILE_DX / 2 + collisionLeadX, oldY, newY, Constants.TILE_DY / 2 + collisionLeadY);
    newX = collisionResults.x;
    newY = collisionResults.y;

    if (collisionResults.bDidCollide) {
      this.setDirection(Constants.DIRECTION.BLOCKED);
    }

    var newRow = this.resolveRow(newY + Constants.TILE_DY / 2);
    var newCol = this.resolveCol(newX + Constants.TILE_DX / 2);

    if (bReduceVerticalSlop) {
      var idealY = this.resolveY(newRow);
      var dy = idealY - newY;

      if (dy * this.correctSign.y >= 0) {
        var dCorrection = Math.round(ig.Game._dt * Constants.CORRECTION_DY);
        if (dCorrection > Math.abs(dy)) {
          dCorrection = Math.abs(dy);
        }

        newY += dCorrection * (dy > 0 ? 1 : -1);
      }
    }

    if (bReduceLateralSlop) {
      var idealX = this.resolveX(newCol);
      var dx = idealX - newX;
      var dCorrection = Math.round(ig.Game._dt * Constants.CORRECTION_DX);

      if (dx * this.correctSign.x >= 0) {
        var dCorrection = Math.round(ig.Game._dt * Constants.CORRECTION_DY);
        if (dCorrection > Math.abs(dx)) {
          dCorrection = Math.abs(dx);
        }

        newX += dCorrection * (dx > 0 ? 1 : -1);
      }
    }

    this.visualGridPos.x = newX;
    this.visualGridPos.y = newY;
    this.visualGridPos.row = this.resolveRow(newY + Constants.TILE_DY / 2);
    this.visualGridPos.col = this.resolveCol(newX + Constants.TILE_DX / 2);

    this.syncTruePositionToVisualPosition();
  },

  getFramePos: function() {
  	switch (this.state) {
  		case Constants.HORSE_STATE.WAITING: {
  			this.framePos.y = 0 * Constants.TILE_DY;
  			break;
  		}

  		case Constants.HORSE_STATE.RUNNING: {
  			this.framePos.y = 1 * Constants.TILE_DY;
  			break;
  		}

  		case Constants.HORSE_STATE.RESTING: {
  			this.framePos.y = 2 * Constants.TILE_DY;
  			break;
  		}
  	}

    this.framePos.x = 4 * Constants.TILE_DX;
  }

});

});
