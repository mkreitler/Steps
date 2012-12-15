ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.constants',	
	'game.move-test' 
)
.defines(function(){

Steps = ig.Game.extend({
  clearColor: 	'#008800',
  moveTest: 		new MoveTest(),
  curTime: 			0,
	
	// Load a font
	font: new ig.Font( 'media/art/font-yonder.png' ),
	
	initInput: function() {
		ig.input.initMouse();
//		ig.input.bind( ig.KEY.MOUSE1, 'start' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
	},

	updateInput: function() {
		if (ig.input.pressed('start') && this.moveTest) {
			this.moveTest.start(ig.input.mouse.x, ig.input.mouse.y);
		}

		if (ig.input.pressed('left')) {
			ig.Game.QueueCommand(Constants.DIRECTION.LEFT);
			if (this.moveTest) this.moveTest.start();
		}

		if (ig.input.pressed('right')) {
			ig.Game.QueueCommand(Constants.DIRECTION.RIGHT);
			if (this.moveTest) this.moveTest.start();
		}

		if (ig.input.pressed('up')) {
			ig.Game.QueueCommand(Constants.DIRECTION.UP);
			if (this.moveTest) this.moveTest.start();
		}

		if (ig.input.pressed('down')) {
			ig.Game.QueueCommand(Constants.DIRECTION.DOWN);
			if (this.moveTest) this.moveTest.start();
		}
	},
	
	init: function() {
		// Initialize your game here; bind keys etc.
		this.moveTest.createField();

	  this.curTime =	(new Date).getTime() * 0.001;
	  ig.Game._animTimer = 0;

	  this.initInput();
	},
	
	update: function() {
		this.updateInput();

		// Update all entities and backgroundMaps
		this.parent();

		// Update game time.
		var newTime = (new Date).getTime() * 0.001;
		ig.Game._dt = (newTime - this.curTime);
		this.curTime = newTime;

		// Update the global anim timer.
		ig.Game._animTimer += ig.Game._dt;

		Sprite.computeAnimAngle();

		this.moveTest.update();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		// Add your own drawing code here
		this.moveTest.draw();

		this.showDefaultMessage();
	},

	showDefaultMessage: function() {
		if (ig.Game._bShowMsg) {
			var x = (ig.system.width - 2 * Constants.TILE_DX) / 2 ;
			var y = (ig.system.height - Constants.TILE_DY) / 2;
			
			if (ig.Game._bEscaped) {
				this.font.draw( 'Escaped!', x, y, ig.Font.ALIGN.CENTER );
			}
			else {
				this.font.draw( 'Round Over', x, y, ig.Font.ALIGN.CENTER );
			}
	//		this.font.draw( "Anim Angle:" + Sprite._animAngle, x, y, ig.Font.ALIGN.CENTER );
	//		this.font.draw( "ig.Game._animTimer: " + Math.floor(ig.Game._animTimer), x, y, ig.Font.ALIGN.CENTER );
		}
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', Steps, 60, Constants.WIDTH, Constants.HEIGHT, 1 );

ig.Game.resetAnimTimer = function() {
	ig.Game._animTimer = 0;
};

ig.Game.ShowRoundOverMessage = function() {
	ig.Game._bShowMsg = true;
};

ig.Game.ClearCommandQueue = function() {
	while (ig.Game._cmdQueue.length) {
		ig.Game._cmdQueue.pop();
	}
};

ig.Game.QueueCommand = function(cmdDir) {
	ig.Game._cmdQueue.push(cmdDir);
};

ig.Game.UnqueueCommand = function() {
	return ig.Game._cmdQueue.shift();
};

ig.Game.CommandReady = function() {
	return ig.Game._cmdQueue.length > 0;
};

ig.Game.ShowEscapedText = function() {
	ig.Game._bEscaped = true;
};

ig.Game._dt					= 0;
ig.Game._animTimer 	= 0;
ig.Game._bShowMsg 	= false;
ig.Game._cmdQueue 	= [];
ig.Game._bEscaped 	= false;

});
