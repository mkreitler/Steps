ig.module( 
	'game.target' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.sprite'
)
.defines(function(){

Target = Sprite.extend({

  bHidden:    true,

  hide: function() {
    this.bHidden = true;
  },

 show: function() {
    this.bHidden = false;
  },

  resolveX: function(fromCol) {
    var x = fromCol * Constants.TILE_DX + Constants.OFFSET_X + Constants.TILE_DX / 2;
    x = Math.max(0, x);
    x = Math.min(Constants.WIDTH - 1, x);

    return x;
  },

  resolveY: function(fromRow) {
    var y = fromRow * Constants.TILE_DY + Constants.OFFSET_Y + Constants.TILE_DY / 2;
    y = Math.max(0, y);
    y = Math.min(Constants.HEIGHT - 1, y);

    return y;
  },

  onPress: function(x, y) {
    var row = this.resolveRow(y);
    var col = this.resolveCol(x);

    this.setRowCol(row, col, true);
    this.setRowCol(row, col, false);

    this.show();
  },

  draw: function() {
    if (!this.bHidden) {
      ig.system.context.save();
      ig.system.context.globalAlpha = 0.5 + 0.5 * Sprite._sinValue;

      this.frames.draw(this.visualGridPos.x - this.frames.width / 2,
                       this.visualGridPos.y - this.frames.height / 2);

      ig.system.context.globalAlpha = 1;
      ig.system.context.restore();
    }
  },

  init: function(x, y, imageFile) {

    var settings = {frames:new ig.Image(imageFile)};
    this.parent(x, y, settings);
  }

});

});
