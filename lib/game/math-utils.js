ig.module( 
	'game.math-utils' 
)
.requires(
	'impact.game',
	'impact.font'
)
.defines(function(){

MathUtils = ig.Class.extend({
});

MathUtils.EPSILON = 0.001;
MathUtils.ANGLE_EPSILON = 0.0001;

MathUtils.blend = function(start, dStart, end, dEnd, cur) {
  // Ultimately, this will be an Hermitian blend. For now, do a straight
  // lineari interpolation.
  return start * (1 - cur) + end * cur;
};

MathUtils.cosBlend = function(time, period) {
  return 1 - 0.5 * (1 + Math.cos(Math.PI * time / period));
};

});
