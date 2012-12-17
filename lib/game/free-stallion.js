ig.module( 
	'game.free-stallion' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.horse-sprite'
)
.defines(function(){

FreeStallion = HorseSprite.extend({
	gender: 			    Constants.GENDER.MALE,
	coat: 				    Constants.COAT.SOLID,
	state: 				    Constants.HORSE_STATE.RESTING,
  correctSign:      {x:0, y:0},
  collidePoint:     {x:-100, y:-100},

  drawDebugLocations: function() {
    return false;
  },

  draw: function() {
    this.parent();
    this.drawDebug();
  },

  getDrawAlpha: function() {
    var alpha = 1;

    if (this.trueGridPos.row === Constants.GOAL_ROW) {
      var dx = Math.abs(this.trueGridPos.x - this.resolveX(Constants.GOAL_COL));
      var dy = Math.abs(this.trueGridPos.y - this.resolveY(Constants.GOAL_ROW));

      alpha = Math.min((dx + dy) / (Constants.TILE_DX / 2 + Constants.TILE_DY / 2), 1);
    }

    return alpha;
  },

  drawDebug: function() {
    if (true && this.drawDebugLocations()) { // DEBUG
      this.parent();

      var ctx = ig.system.context;
      ctx.save();
      ctx.lineWidth = 2;
      ctx.fillStyle = "#FF00FF";
      ctx.globalAlpha = 0.5;

      ctx.beginPath();
      ctx.arc(this.collidePoint.x + Constants.TILE_DX / 2, this.collidePoint.y + Constants.TILE_DY / 2, Constants.TILE_DX / 4, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();
    }
  },

  getPattern: function(level) {
    return level.isMovingDir(this.wantDir) ? Constants.PATTERN_RIGHT_THEN_LEFT[this.wantDir] : null
  },

  resolveFreeMove: function(level) {
    var pattern = this.getPattern(level);
    var dMove = ig.Game._dt / Constants.TURN_LENGTH;

    var oldX = this.visualGridPos.x;
    var oldY = this.visualGridPos.y;

    var newX;
    var newY;

    var blockType = Constants.BLOCK_TYPE.NONE;

    var nTests = pattern ? pattern.length : 1;
    var testDir = this.wantDir;

    var bWantsFlip = false;

    level.removeFromScene(this.getRow(true), this.getCol(true));

    for (var i=0; i<nTests; ++i) {
      testDir = pattern ? pattern[i] : this.wantDir;

      var bReduceLateralSlop = false;
      var bReduceVerticalSlop = false;

      var collisionLeadX = 0;
      var collisionLeadY = 0;
      var dynamicLeadX = 0;
      var dynamicLeadY = 0;

      var blockType = Constants.BLOCK_TYPE.NONE;

      newX = oldX;
      newY = oldY;

      switch (testDir) {
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
          this.correctSign.y = 0;
          bReduceLateralSlop = true;
          collisionLeadY = -Constants.TILE_DY / 2;
          dynamicLeadY = -Constants.TILE_DY / 2;
          break;
        }

        case Constants.DIRECTION.RIGHT: {
          newX += dMove * Constants.TILE_DX;
          this.correctSign.x = 0;
          bReduceVerticalSlop = true;
          collisionLeadX = Constants.TILE_DX / 2;
          dynamicLeadX = Constants.TILE_DX / 2;
          break;
        }

        case Constants.DIRECTION.DOWN: {
          newY += dMove * Constants.TILE_DY;
          this.correctSign.y = 0;
          bReduceLateralSlop = true;
          collisionLeadY = Constants.TILE_DY / 2;
          dynamicLeadY = Constants.TILE_DY / 2;
          break;
        }

        case Constants.DIRECTION.LEFT: {
          newX -= dMove * Constants.TILE_DX;
          this.correctSign.x = 0;
          bReduceVerticalSlop = true;
          collisionLeadX = -Constants.TILE_DX / 2;
          dynamicLeadX = -Constants.TILE_DX / 2;
          break;
        }
      }

      newX = Math.round(newX);
      newY = Math.round(newY);

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

      // No collision along the top row.
      if (level.isMovingDir(testDir) && this.trueGridPos.row > 0) {
        this.checkStaticCollision(level, oldX, newX, Constants.TILE_DX / 2, collisionLeadX, oldY, newY, Constants.TILE_DY / 2, collisionLeadY);
        newX = this.collisionResults.x;
        newY = this.collisionResults.y;

        if (this.collisionResults.bDidCollide) {
          bWantsFlip = true;
          this.correctSign.x *= -1;
        }
      }
      else {
        this.collisionResults = this.localCollision;
        this.localCollision.x = newX;
        this.localCollision.y = newY;
        this.localCollision.bDidCollide = false;
      }

      if (this.collisionResults.bDidCollide) {
        blockType = Constants.BLOCK_TYPE.HARD;
      }
      else if (this.isMoving() && this.trueGridPos.row > 0) {
        // Check for animal collision.
        this.collidePoint.x = this.resolveX(this.resolveCol(newX + Constants.TILE_DX / 2 + dynamicLeadX)); // this.resolveX(this.resolveCol(newX + dynamicLeadX));
        this.collidePoint.y = this.resolveY(this.resolveRow(newY + Constants.TILE_DY / 2 + dynamicLeadY)); // this.resolveY(this.resolveRow(newY + dynamicLeadY));

        var bNearCollide = level.collideWithSceneElements(this, this.resolveRow(newY + Constants.TILE_DY / 2), this.resolveCol(newX + Constants.TILE_DX / 2), true);
        var bFarCollide = level.collideWithSceneElements(this, this.resolveRow(newY + Constants.TILE_DY / 2 + dynamicLeadY), this.resolveCol(newX + Constants.TILE_DX / 2 + dynamicLeadX), false);

        if (bNearCollide || bFarCollide) {
          blockType = Constants.BLOCK_TYPE.HARD;
          bWantsFlip = true;
          this.collisionResults = this.localCollision;
          this.localCollision.x = oldX;
          this.localCollision.y = oldY;
          newX = oldX;
          newY = oldY;
          this.localCollision.bDidCollide = true;
        }
        else {
          // Exit the loop on no collision.
          blockType = Constants.BLOCK_TYPE.NONE;
          break;
        }
      }
      else {
        // Exit the loop on no collision.
        blockType = Constants.BLOCK_TYPE.NONE;
        break;
      }
    }

    if (blockType === Constants.BLOCK_TYPE.HARD) {
      this.setDirection(Constants.DIRECTION.BLOCKED);
      this.setState(Constants.HORSE_STATE.WAITING);
    }
    else {
      if (level.isMovingDir(testDir)) {
        this.setDirection(testDir);
      }

      if (bWantsFlip && (testDir == Constants.DIRECTION.UP || Constants.DIRECTION.DOWN)) {
        this.flipX();
      }
    }
    
    this.visualGridPos.x = newX;
    this.visualGridPos.y = newY;
    this.visualGridPos.row = this.resolveRow(newY + Constants.TILE_DY / 2);
    this.visualGridPos.col = this.resolveCol(newX + Constants.TILE_DX / 2);

    level.addToScene(this.getRow(true), this.getCol(true), this);

    this.collisionResults.row = this.visualGridPos.row;
    this.collisionResults.col = this.visualGridPos.col;

    this.syncTruePositionToVisualPosition();
  },

  getDebugColor: function() {
    var color;

    if (this.collisionResults.bDidCollide) {
      color = "#FF8800";
    }
    else {
      switch (this.state) {
        case Constants.HORSE_STATE.WAITING: {
          color = "#FF0000";
          break;
        }

        case Constants.HORSE_STATE.RUNNING: {
          color = "#FFFF00";
          break;
        }

        case Constants.HORSE_STATE.RESTING: {
          color = "#00FF00";
          break;
        }

        default:
          color = "#0000FF";
        break;
      }
    }

    return color;
  },

  checkStaticCollision: function(level, oldX, newX, toCenterX, collisionLeadX, oldY, newY, toCenterY, collisionLeadY) {
    this.collisionResults = level.checkStaticCollision(oldX, newX, toCenterX, collisionLeadX, oldY, newY, toCenterY, collisionLeadY);
  },

  update: function(level) {
    this.parent(level);

    if (this.trueGridPos.row === Constants.GOAL_ROW) {
      if (this.trueGridPos.col < Constants.GOAL_COL) {
        this.setDirection(Constants.DIRECTION.RIGHT);
      }
      else if (this.trueGridPos.col > Constants.GOAL_COL) {
        this.setDirection(Constants.DIRECTION.LEFT);
      }
      else {
        this.setDirection(Constants.DIRECTION.UP);
      }
    }

    this.resolveMove(level);
  },

  resolveMove: function(level) {
    this.resolveFreeMove(level);
  }

});

});
