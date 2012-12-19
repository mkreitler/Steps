ig.module( 
	'game.free-pinto' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.free-stallion'
)
.defines(function(){

FreePinto = FreeStallion.extend({
  coat:   Constants.COAT.PINTO,

  getPattern: function(level) {
    return level.isMovingDir(this.wantDir) ? Constants.PATTERN_LEFT_THEN_RIGHT[this.wantDir] : null
  },

  getSpookPattern: function(spookDir) {
    return Constants.PATTERN_LEFT_THEN_RIGHT[spookDir];
  }

});

});
