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
  bForceSpook:  false,

  blocks: function() {
    return true;
  },

  drawDebugLocations: function() {
    return false;
  },

  draw: function() {
    this.parent();
    this.drawDebug();
  },

  forceSpook: function() {
    this.bForceSpook = true;
  },

  setDirection: function(dir) {
    var oldDir = this.wantDir;

    this.parent(dir);
  },

  update: function(level) {
    var bSpooked = false;

    if (this.bForceSpook) {
      this.spookAnimals(level, Constants.FORCE_SPOOK_RADIUS);
      bSpooked = true;
      this.bForceSpook = false;
    }

    this.parent(level);

    this.resolveMove(level);

    if (!bSpooked && this.isMoving()) {
      this.spookAnimals(level, Constants.MOVE_SPOOK_RADIUS);
    }
  },

  resolveMove: function(level) {
    this.resolveFreeMove(level);
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
