ig.module( 
	'game.free-mare' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.free-stallion'
)
.defines(function(){

FreeMare = FreeStallion.extend({
  gender:           Constants.GENDER.FEMALE
});

});
