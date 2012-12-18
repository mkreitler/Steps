ig.module( 
	'game.free-pinto-mare' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.free-pinto'
)
.defines(function(){

FreePintoMare = FreePinto.extend({
  gender:           Constants.GENDER.FEMALE
});

});
