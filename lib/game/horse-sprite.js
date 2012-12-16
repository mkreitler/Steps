ig.module( 
	'game.horse-sprite' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.animal-sprite'
)
.defines(function(){

ig.HORSE_FRAMES = new ig.Image("media/art/horses.png");

HorseSprite = AnimalSprite.extend({
	gender: 			Constants.GENDER.MALE,
	coat: 				Constants.COAT.SOLID,
	state: 				Constants.HORSE_STATE.RESTING,
  rearTimer:    0,
 
	init: function(row, col, settings) {
    x = this.resolveX(col);
    y = this.resolveY(row);

    settings.frames = ig.HORSE_FRAMES;
    this.pattern = Constants.PATTERN_RIGHT_THEN_LEFT;

		this.parent(x, y, settings);
	},

  stateIs: function(testState) {
    return this.state === testState;
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

  setState: function(newState) {
    if (this.state !== newState) {
      this.state = newState;

      if (newState === Constants.HORSE_STATE.WAITING) {
        this.rearTimer = Constants.REAR_DURATION;
      }
      else {
        this.rearTimer = 0;
      }
    }
  },

  update: function(level) {
    // Update rear "animation".
    if (this.rearTimer > 0) {
      this.rearTimer = this.rearTimer - ig.Game._dt;
      if (this.rearTimer <= 0) {
        this.rearTimer = 0;
        this.setState(Constants.HORSE_STATE.RESTING);
      }
    }
  },

  getDebugColor: function() {
    var color;

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

    return color;
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

    if (this.gender === Constants.GENDER.FEMALE) {
      this.framePos.x = 2 * Constants.TILE_DX;
    }
    else {
      this.framePos.x = 0;
    }

    if (this.coat === Constants.COAT.SOLID) {
      this.framePos.x += Constants.TILE_DX;
    }
  },

  drawDebug: function() {
    if (true && this.drawDebugLocations()) { // DEBUG
      this.parent();

      var ctx = ig.system.context;
      ctx.save();
      ctx.lineWidth = 2;
      ctx.fillStyle = "#00FFFF";
      ctx.globalAlpha = 0.5;

      ctx.beginPath();
      ctx.arc(this.spookPos.x + Constants.TILE_DX / 2, this.spookPos.y + Constants.TILE_DY / 2, Constants.TILE_DX / 4, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();
    }
  },

  draw: function() {
    this.getFramePos();

  	ig.system.context.save();
  	ig.system.context.translate(this.visualGridPos.x + Constants.TILE_DX / 2, this.visualGridPos.y + Constants.TILE_DY / 2);
  
  	if (this.state === Constants.HORSE_STATE.RUNNING) {
  		// TODO: give each horse a unique frequency of rotation to stagger animations.
	  	ig.system.context.rotate(Sprite._animAngle);
	  }

  	this.parent();
  	ig.system.context.restore();
  }

});

});
