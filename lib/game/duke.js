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

  blocks: function() {
    return true;
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
