ig.module( 
	'game.sprite' 
)
.requires(
	'impact.game',
	'impact.font',

  'game.constants'
)
.defines(function(){

ig.CURRENT_SPRITE_ID = 0;
ig.resetSpriteIDs = function() { ig.CURRENT_SPRITE_ID = 0; };

Sprite = ig.Class.extend({
  frames:           null,
  framePos:         {x:0, y:0},
  visualGridPos:    {row:-1, col:-1, x:-1, y:-1},
  trueGridPos:      {row:-1, col:-1, x:-1, y:-1},
  wantDir:          -1,
  id:               0,
  bReverseX:        false,
  collisionResults: null,
  localCollision:   {x:0, y:0, bDidCollide:false},

  setDirection: function(direction) {
    this.wantDir = direction;
  },

  flipX: function() {
    this.bReverseX = !this.bReverseX;
  },

  getWantDir: function() {
    return this.wantDir;
  },

  isMoving: function() {
    return this.wantDir !== Constants.DIRECTION.NONE &&
           this.wantDir !== Constants.DIRECTION.BLOCKED;
  },

  getID: function() {
    return this.id;
  },

  drawDebugLocations: function() {
    return false;
  },

  updateTruePosition: function() {
    this.resolveMove(1);

    this.syncTruePositionToVisualPosition();
  },

  resolveMove: function(param) {
    switch (this.wantDir) {
      case Constants.DIRECTION.BLOCKED: case Constants.DIRECTION.NONE: {
        // Don't move when blocked.
        break;
      }

      case Constants.DIRECTION.UP: {
        this.visualGridPos.y = this.trueGridPos.y - param * Constants.TILE_DY;
        this.visualGridPos.row = Math.round(this.trueGridPos.row - param);
        break;
      }

      case Constants.DIRECTION.RIGHT: {
        this.visualGridPos.x = this.trueGridPos.x + param * Constants.TILE_DX;
        this.visualGridPos.col = Math.round(this.trueGridPos.col + param);
        break;
      }

      case Constants.DIRECTION.DOWN: {
        this.visualGridPos.y = this.trueGridPos.y + param * Constants.TILE_DY;
        this.visualGridPos.row = Math.round(this.trueGridPos.row + param);
        break;
      }

      case Constants.DIRECTION.LEFT: {
        this.visualGridPos.x = this.trueGridPos.x - param * Constants.TILE_DX;
        this.visualGridPos.col = Math.round(this.trueGridPos.col - param);
        break;
      }
    }
  },

  init: function(x, y, settings) {
    this.frames = settings.frames || null;

    this.visualGridPos.row = this.resolveRow(y);
    this.visualGridPos.col = this.resolveRow(x);

    this.trueGridPos.row = this.visualGridPos.row;
    this.trueGridPos.col = this.visualGridPos.col;

    this.trueGridPos.x = this.resolveX(this.trueGridPos.col);
    this.trueGridPos.y = this.resolveY(this.trueGridPos.row);

    this.visualGridPos.x = this.trueGridPos.x;
    this.visualGridPos.y = this.trueGridPos.y;

    ig.CURRENT_SPRITE_ID += 1;
    this.id = ig.CURRENT_SPRITE_ID;
  },

  getDebugColor: function() {
    return "#FF8800";
  },

  resolveFreeMove: function(level) {
    var dMove = ig.Game._dt / Constants.TURN_LENGTH;

    var bReduceLateralSlop = false;
    var bReduceVerticalSlop = false;

    var oldX = this.visualGridPos.x;
    var oldY = this.visualGridPos.y;

    var newX = oldX;
    var newY = oldY;

    var collisionLeadX = 0;
    var collisionLeadY = 0;
    var dynamicLeadX = 0;
    var dynamicLeadY = 0;

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
        dynamicLead = -Constants.TILE_DY / 2;
        break;
      }

      case Constants.DIRECTION.RIGHT: {
        newX += dMove * Constants.TILE_DX;
        this.correctSign.x = 1;
        bReduceVerticalSlop = true;
        collisionLeadX = Constants.TILE_DX / 4;
        dynamicLeadX = Constants.TILE_DX / 2;
        break;
      }

      case Constants.DIRECTION.DOWN: {
        newY += dMove * Constants.TILE_DY;
        this.correctSign.y = 1;
        bReduceLateralSlop = true;
        collisionLeadY = Constants.TILE_DY / 4;
        dynamicLeadY = Constants.TILE_DY / 2;
        break;
      }

      case Constants.DIRECTION.LEFT: {
        newX -= dMove * Constants.TILE_DX;
        this.correctSign.x = -1;
        bReduceVerticalSlop = true;
        collisionLeadX = -Constants.TILE_DX / 4;
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

    this.checkStaticCollision(level, oldX, newX, Constants.TILE_DX / 2, collisionLeadX, oldY, newY, Constants.TILE_DY / 2, collisionLeadY);
    newX = this.collisionResults.x;
    newY = this.collisionResults.y;

    if (this.collisionResults.bDidCollide) {
      this.setDirection(Constants.DIRECTION.BLOCKED);
    }
    else if (this.isMoving()) {
      // Check for animal collision.
      if (level.collideWithSceneElements(this, this.resolveRow(newY + Constants.TILE_DY / 2), this.resolveCol(newX + Constants.TILE_DX / 2)) ||
          level.collideWithSceneElements(this, this.resolveRow(newY + Constants.TILE_DY / 2 + dynamicLeadY), this.resolveCol(newX + Constants.TILE_DX / 2 + dynamicLeadX))) {

        blockType = Constants.BLOCK_TYPE.HARD;

        this.collisionResults = this.localCollision;
        this.localCollision.x = oldX;
        this.localCollision.y = oldY;
        newX = oldX;
        newY = oldY;
        this.localCollision.bDidCollide = true;

        this.setDirection(Constants.DIRECTION.BLOCKED);
      }
    }

    this.visualGridPos.x = newX;
    this.visualGridPos.y = newY;
    this.visualGridPos.row = this.resolveRow(newY + Constants.TILE_DY / 2);
    this.visualGridPos.col = this.resolveCol(newX + Constants.TILE_DX / 2);

    if (this.validateBounds(true)) {
      this.visualGridPos.x = oldX;
      this.visualGridPos.y = oldY;
      this.visualGridPos.row = this.resolveRow(oldY + Constants.TILE_DY / 2);
      this.visualGridPos.col = this.resolveCol(oldX + Constants.TILE_DX / 2);
      
      this.setDirection(Constants.DIRECTION.BLOCKED);
    }

    this.collisionResults.row = this.visualGridPos.row;
    this.collisionResults.col = this.visualGridPos.col;

    this.syncTruePositionToVisualPosition();
  },

  checkStaticCollision: function(level, oldX, newX, toCenterX, collisionLeadX, oldY, newY, toCenterY, collisionLeadY) {
    this.collisionResults = level.checkStaticCollision(oldX, newX, toCenterX, collisionLeadX, oldY, newY, toCenterY, collisionLeadY);
  },

  checkBounds: function(level) {
    var bOutOfBounds = this.validateBounds(true);
    this.validateBounds(false);

    if (bOutOfBounds) {
      this.syncPixelsToRowsAndColumns(false);
      this.syncTruePositionToVisualPosition();
      level.removeFromScene(this.getRow(true), this.getCol(true));
    }

    return bOutOfBounds;
  },

  syncPixelsToRowsAndColumns: function(bVisual) {
    this.setRowCol(this.getRow(bVisual), this.getCol(bVisual));
  },

  validateBounds: function(bVisual) {
    var bOutOfBounds = false;

    var minX = Constants.OFFSET_X;
    var maxX = Constants.OFFSET_X + Constants.COLS * Constants.TILE_DX;
    var minY = Constants.OFFSET_Y;
    var maxY = Constants.OFFSET_Y + Constants.ROWS * Constants.TILE_DY;

    var centerX = this.trueGridPos.x + Constants.TILE_DX / 2;
    var centerY = this.trueGridPos.y + Constants.TILE_DY / 2;

    if (bVisual) {
      centerX = this.visualGridPos.x + Constants.TILE_DX / 2;
      centerY = this.visualGridPos.y + Constants.TILE_DY / 2;
    }

    bOutOfBounds = centerX < minX || centerX > maxX ||
                   centerY < minY || centerY > maxY;

    return bOutOfBounds;
  },

  drawDebug: function() {
    if (true && this.drawDebugLocations()) { // DEBUG
      var ctx = ig.system.context;
      ctx.save();

      ctx.lineWidth = 4;
      // ctx.strokeStyle = "#FFFF00";
      // ctx.beginPath();
      // ctx.arc(0, 0, Constants.TILE_DX / 2, 0, Math.PI * 2, false);
      // ctx.closePath();
      // ctx.stroke();

      ctx.strokeStyle = this.getDebugColor();
      ctx.beginPath();
      ctx.arc(this.resolveX(this.getCol(false)) + Constants.TILE_DX / 2, this.resolveY(this.getRow(false)) + Constants.TILE_DY / 2, Constants.TILE_DX / 2, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();

      ig.Game._font.draw("Row: " + this.getRow() + ", Col: " + this.getCol(), this.visualGridPos.x, this.visualGridPos.y, ig.Font.ALIGN.CENTER);
    }
  },

  drawSimple: function() {
    if (this.frames) {
      this.frames.draw(this.visualGridPos.x, this.visualGridPos.y);
    }
  },

  draw: function() {
    if (this.frames) {
      var tileIndex = Math.round(this.frames.width / Constants.TILE_DX) * Math.round(this.framePos.y / Constants.TILE_DY) +
                      Math.round(this.framePos.x / Constants.TILE_DX);

//      this.frames.draw(-Constants.TILE_DX * 0.5, -Constants.TILE_DY * 0.5, this.framePos.x, this.framePos.y, Constants.TILE_DY, Constants.TILE_DY);
      if (this.wantDir === Constants.DIRECTION.RIGHT) {
        this.bReverseX = true;
      }
      else if (this.wantDir === Constants.DIRECTION.LEFT) {
        this.bReverseX = false;
      }
      
      this.frames.drawTile(-Constants.TILE_DX * 0.5, -Constants.TILE_DY * 0.5, tileIndex, Constants.TILE_DY, Constants.TILE_DY, this.bReverseX);

      if (false && this.isMoving()) { // DEBUG
        var ctx = ig.system.context;
        ctx.save();

        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FFFFFF";
        ctx.globalAlpha = 0.5;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        switch (this.wantDir) {
          case Constants.DIRECTION.UP: {
            ctx.lineTo(0, -Constants.TILE_DY * 0.75);
            break;
          }

          case Constants.DIRECTION.RIGHT: {
            ctx.lineTo(Constants.TILE_DX * 0.75, 0);
            break;
          }

          case Constants.DIRECTION.DOWN: {
            ctx.lineTo(0, Constants.TILE_DY * 0.75);
            break;
          }

          case Constants.DIRECTION.LEFT: {
            ctx.lineTo(-Constants.TILE_DX * 0.75, 0);
            break;
          }

          case Constants.DIRECTION.BLOCKED: {
            ctx.strokeStyle = "#FF0000";
            ctx.arc(0, 0, Constants.TILE_DX / 4, 0, 2 * Math.PI, false);
          }

          default:
            // Draw nothing.
          break;
        }

        ctx.closePath();
        ctx.stroke();

        ctx.globalAlpha = 1;

        ctx.restore();
      }
    }
  },

  setRowCol: function(newRow, newCol, bVisual) {
    if (bVisual) {
      this.visualGridPos.row = newRow;
      this.visualGridPos.col = newCol;

      this.visualGridPos.x = this.resolveX(newCol);
      this.visualGridPos.y = this.resolveY(newRow);
    }
    else {
      this.trueGridPos.row = newRow;
      this.trueGridPos.col = newCol;

      this.trueGridPos.x = this.resolveX(newCol);
      this.trueGridPos.y = this.resolveY(newCol);
    }
  },

  setXY: function(newX, newY, bVisual) {
    if (bVisual) {
      this.visualGridPos.x = newX;
      this.visualGridPos.y = newY;

      this.visualGridPos.row = this.resolveRow(y);
      this.visualGridPos.col = this.resolveCol(x);
    }
    else {
      this.trueGridPos.x = newX;
      this.trueGridPos.y = newY;

      this.trueGridPos.row = this.resolveRow(y);
      this.trueGridPos.col = this.resolveCol(x);
    }
  },

  getRowDelta: function(dir) {
    var rowDelta = 0;

    if (dir === Constants.DIRECTION.UP) {
      rowDelta = -1;
    }
    else if (dir === Constants.DIRECTION.DOWN) {
      rowDelta = 1;
    }

    return rowDelta;
  },

  getColDelta: function(dir) {
    var colDelta = 0;

    if (dir === Constants.DIRECTION.RIGHT) {
      colDelta = 1;
    }
    else if (dir === Constants.DIRECTION.LEFT) {
      colDelta = -1;
    }

    return colDelta;
  },

  getX: function(bVisual) {
    var x = this.trueGridPos.x;

    if (bVisual) {
      x = this.visualGridPos.x;
    }

    return x;
  },

  getY: function(bVisual) {
    var y = this.trueGridPos.y;

    if (bVisual) {
      y = this.visualGridPos.y;
    }

    return y;
  },

  getRow: function(bVisual) {
    var row = this.trueGridPos.row;

    if (bVisual) {
      row = this.visualGridPos.row;
    }

    return row;
  },

  getCol: function(bVisual) {
    var col = this.trueGridPos.col;

    if (bVisual) {
      col = this.visualGridPos.col;
    }

    return col;
  },

  syncTruePositionToVisualPosition: function() {
    this.trueGridPos.x = this.visualGridPos.x;
    this.trueGridPos.y = this.visualGridPos.y;

    this.trueGridPos.row = this.visualGridPos.row;
    this.trueGridPos.col = this.visualGridPos.col;
  },

  resolveRow: function(fromY) {
    var row = Math.floor((fromY - Constants.OFFSET_Y) / Constants.TILE_DY);
    row = Math.max(0, row);
    row = Math.min(row, Constants.ROWS - 1);

    return row;
  },

  resolveCol: function(fromX) {
    var col = Math.floor((fromX - Constants.OFFSET_X) / Constants.TILE_DX);
    col = Math.max(0, col);
    col = Math.min(col, Constants.COLS - 1);

    return col;
  },

  resolveX: function(fromCol) {
    var x = fromCol * Constants.TILE_DX + Constants.OFFSET_X;
    x = Math.max(0, x);
    x = Math.min(Constants.WIDTH - 1, x);

    return x;
  },

  resolveY: function(fromRow) {
    var y = fromRow * Constants.TILE_DY + Constants.OFFSET_Y;
    y = Math.max(0, y);
    y = Math.min(Constants.HEIGHT - 1, y);

    return y;
  }

});

Sprite.computeAnimAngle = function() {
  Sprite._sinValue = Math.sin(20 * ig.Game._animTimer);

  Sprite._animAngle = 0 + Math.PI / 10 * Sprite._sinValue;
};

Sprite._sinValue = 0;
Sprite._animAngle = 0;

});
