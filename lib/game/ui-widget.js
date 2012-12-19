ig.module( 
	'game.ui-widget' 
)
.requires(
	'impact.game',
	'impact.font'
)
.defines(function(){

Widget = ig.Class.extend({
  bounds:       {x:0, y:0, width:0, height:0},
  bActive:      false,

  activate: function() {
    this.bActive = true;
  },

  deactivate: function() {
    this.bActive = false;
  },

  getBoundsRef: function() {
    return this.bounds;
  },

  init: function(x, y, width, height) {
    this.bounds.x = x;
    this.bounds.y = y;
    this.bounds.width = width;
    this.bounds.height = height;

    this.bActive = true;
  },

  containsPoint: function(x, y) {
    return this.bActive &&
           x >= this.bounds.x && x <= this.bounds.x + this.bounds.width &&
           y >= this.bounds.y && y <= this.bounds.y + this.bounds.height;
  },

  onPress: function(x, y) {
    var bConsumed = this.containsPoint(x, y);

    if (bConsumed) {
      this.pressed(x, y);
    }

    return bConsumed;
  },

  update: function() {
    // Stub.
  },

  draw: function() {
    // Stub.
  },

  onRelease: function(x,y) {
    this.released(x, y);
  },

  pressed: function(x, y) {
    // Stub.
  },

  released: function(x, y) {
    // Stub.
  },

});

});
