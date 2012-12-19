ig.module( 
	'game.ui-two-state-button' 
)
.requires(
	'impact.game',
	'impact.font',

  'game.ui-hotbox'
)
.defines(function(){

// settings = {
//   imageUp: null,
//   imageDown: null,
//   releaseCallback: null,
//   releaseData: null
// };

TwoStateButton = HotBox.extend({
  imageUp:          null,
  imageDown:        null,
  releaseCallback:  null,
  releaseData:      null,
  bUp:              true,

  init: function(x, y, width, height, settings) {
    this.parent(x, y, width, height, settings);

    this.imageUp = settings.imageUp || null;
    this.imageDown = settings.imageDown || null;
    this.releaseCallback = settings.releaseCallback || null;
    this.releaseData = settings.releaseData || null;
  },

  pressed: function(x, y) {
    this.parent(x, y);

    this.bUp = false;
  },

  released: function(x, y) {
    this.bUp = true;

    if (this.releaseCallback) {
      this.releaseCallback(this.releaseData);
    }
  },

  draw: function() {
    var xCenter = this.bounds.x + this.bounds.width / 2;
    var yCenter = this.bounds.y + this.bounds.height / 2;

    if (this.bUp && this.imageUp) {
      this.imageUp.draw(xCenter - this.imageUp.width / 2, yCenter - this.imageUp.height / 2);
    }
    else if (!this.bUp && this.imageDown) {
      this.imageDown.draw(xCenter - this.imageDown.width / 2, yCenter - this.imageDown.height / 2);
    }
  }

});

});
