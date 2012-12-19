ig.module( 
	'game.ui-hotbox' 
)
.requires(
	'impact.game',
	'impact.font',

  'game.ui-widget'
)
.defines(function(){

HotBox = Widget.extend({
  pressCallback:      null,
  pressData:          null,

  init: function(x, y, width, height, settings) {
    this.parent(x, y, width, height);
    
    this.pressCallback = settings.pressCallback || null;
    this.pressData = settings.pressData || null;
  },

  onPress: function(x, y) {
    var bConsumed = this.parent(x, y);

    if (bConsumed && this.pressCallback) {
      this.pressCallback(this.pressData);
    }

    return bConsumed;
  }

});

});
