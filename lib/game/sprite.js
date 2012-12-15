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

  setDirection: function(direction) {
    this.wantDir = direction;
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
