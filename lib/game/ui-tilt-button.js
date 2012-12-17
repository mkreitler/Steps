ig.module( 
	'game.ui-tilt-button' 
)
.requires(
	'impact.game',
	'impact.font',

  'game.ui-widget'
)
.defines(function(){

// settings = {
//   image:
//   tiltAngle:
//   tiltTime:
//   fnTrigger:
//   triggerData:
// }; 

TiltButton = Widget.extend({
  image:        null,
  tiltAngle:    0,
  tiltTime:     0,
  animTimer:    0,
  animDir:      0,
  fnTrigger:    0,
  triggerData:  null,

  init: function(x, y, settings) {
    this.image = settings.image || null;
    this.tiltAngle = settings.tiltAngle || 0;
    this.tiltTime = settings.tiltTime || 0.001;
    this.fnTrigger = settings.fnTrigger || null;
    this.triggerData = settings.triggerData || null;

    this.parent(x, y, this.image ? this.image.width : 0, this.image ? this.image.height : 0);
  },

  pressed: function(x, y) {
    if (this.animDir === 0) {
      this.animDir = 1;
      this.animTimer = this.tiltTime;
    }
  },

  update: function() {
    if (this.animDir !== 0) {
      var bTriggered = false;

      if (this.animTimer > 0) {
        this.animTimer -= ig.Game._dt;
        if (this.animTimer <= 0) {
          bTriggered = true;
        }
      }

      if (bTriggered) {
        if (this.animDir > 0 && this.fnTrigger) {
          this.fnTrigger(this.triggerData);
        }

        if (this.animDir > 0) {
          this.animDir = -1;
          this.animTimer = this.tiltTime;
        }
        else {
          this.animDir = 0;
          this.animTimer = 0;
        }
      }
    }
  },

  draw: function() {
    var animParam = 0;

    if (this.image) {
      if (this.animDir > 0) {
        animParam = 1 - MathUtils.cosBlend(this.animTimer, this.tiltTime);
      }
      else if (this.animDir < 0) {
        animParam = MathUtils.cosBlend(this.animTimer, this.tiltTime);
      }

      var rotAngle = this.tiltAngle * animParam;
      if (Math.abs(rotAngle) > MathUtils.ANGLE_EPSILON) {
        var ctx = ig.system.context;

        ctx.save();
        ctx.translate(this.bounds.x + this.bounds.width / 2, this.bounds.y + this.bounds.height / 2);
        ctx.rotate(rotAngle);

        this.image.draw(-this.bounds.width / 2, -this.bounds.height / 2);

        ctx.restore();
      }
      else {
        this.image.draw(this.bounds.x, this.bounds.y);
      }
    }
  }

});

});
