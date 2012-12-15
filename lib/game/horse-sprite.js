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

  setState: function(newState) {
    this.state = newState;
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
