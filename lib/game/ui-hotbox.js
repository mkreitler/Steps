ig.module( 
	'game.ui-hotbox' 
)
.requires(
	'impact.game',
	'impact.font',

  'game.ui-widget'
)
.defines(function(){

// settings = {
//   pressCallback: null,
//   pressData: null
// };

HotBox = Widget.extend({
  pressCallback:      null,
  pressData:          null,

  init: function(x, y, width, height, settings) {
    this.parent(x, y, width, height, settings);
    
    this.pressCallback = settings.pressCallback || null;
    this.pressData = settings.pressData || null;
  },

  pressed: function(x, y) {
    this.parent(x, y);

    if (this.pressCallback) {
      this.pressCallback(this.pressData);
    }
  },

  draw: function() {
    this.parent();

    if (false) { // DEBUG
      var ctx = ig.system.context;
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00FFFF";

      ctx.beginPath();
      ctx.moveTo(this.bounds.x, this.bounds.y);
      ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y);
      ctx.lineTo(this.bounds.x + this.bounds.width, this.bounds.y + this.bounds.height);
      ctx.lineTo(this.bounds.x, this.bounds.y + this.bounds.height);
      ctx.closePath();

      ctx.stroke();

      ctx.restore();
    }
  }

});

});
