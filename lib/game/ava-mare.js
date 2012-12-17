ig.module( 
	'game.ava-mare' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.duke'
)
.defines(function(){

AvaMare = Duke.extend({
	gender: 			    Constants.GENDER.FEMALE,

  canJump: function() {
    // Ava's mare doesn't jump.
    return false;
  },

  getFramePos: function() {
    switch (this.state) {
      case Constants.HORSE_STATE.WAITING: case Constants.HORSE_STATE.JUMPING: {
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

    this.framePos.x = 3 * Constants.TILE_DX;
  }

});

});
