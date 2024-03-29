ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.math-utils',

	'game.constants',	
	'game.level-tutorial-01',
	'game.level-tutorial-02',
	'game.level-tutorial-03', 
	'game.level-tutorial-04', 
	'game.level-tutorial-05',
	'game.level-tutorial-06',
	'game.level-tutorial-07',

	'game.level-basic-01',
	'game.level-basic-02',
	'game.level-basic-03',
	'game.level-basic-04',
	'game.level-basic-05',
	'game.level-basic-06',
	'game.level-basic-07',
	'game.level-basic-08',
	'game.level-basic-09',
	'game.level-basic-10',

	'game.level-ava-01',
	'game.level-ava-02',

	'game.level-both-01',

	'game.smart-sound',
	'game.demo-level' 
)
.defines(function(){

Steps = ig.Game.extend({
  clearColor: 	'#008800',
  curTime: 			0,
  msgTimer: 		0,
  fadeDir: 			-1,
  curMsg: 			null,
  levelIndex: 	0,
  tierIndex: 		Constants.TIER.DEMO,
  physicsTime: 	0,
  demoLevel: 		null,
  bWasMouseDown:false,

  soundButton: 	new ig.Sound('media/sound/button-press.mp3'),
  soundTheme: 	new ig.Sound('media/sound/title-theme.mp3'),
  soundBlow: 		new ig.Sound('media/sound/horse-blow-lips.mp3'),
  soundHuff: 		new ig.Sound('media/sound/horse-huff.mp3'),
  soundNeigh: 	new ig.Sound('media/sound/horse-neigh.mp3'),
  soundGate: 		new ig.Sound('media/sound/metal-gate.mp3'),

  bAdvancedDuringCallback: 	false,

  levels: [
  	[],	// tutorial
  	[], // duke
  	[], // ava
  	[], // both
  ],

  currentLevel: null,

  // Load the background.
  background: new ig.Image( 'media/art/background.png' ),

	// Load a font.
	font: new ig.Font( 'media/art/font-yonder.png' ),

	initSounds: function() {
		ig.Game.sndButton = new SmartSound(this.soundButton, 0);
		ig.Game.sndTheme = new SmartSound(this.soundTheme, 0);
		ig.Game.sndBlow = new SmartSound(this.soundBlow, Constants.DEFAULT_REPLAY_DELAY);
		ig.Game.sndHuff = new SmartSound(this.soundHuff, Constants.DEFAULT_REPLAY_DELAY);
		ig.Game.sndNeigh = new SmartSound(this.soundNeigh, Constants.NEIGH_REPLAY_DELAY);
		ig.Game.sndGate = new SmartSound(this.soundGate, Constants.DEFAULT_REPLAY_DELAY);
	},

	fillLevelArray: function() {
  		this.levels[0].unshift(new LevelTutorial07());
  		this.levels[0].unshift(new LevelTutorial06());
  		this.levels[0].unshift(new LevelTutorial05());
  		this.levels[0].unshift(new LevelTutorial04());
  		this.levels[0].unshift(new LevelTutorial03());
  		this.levels[0].unshift(new LevelTutorial02());
  		this.levels[0].unshift(new LevelTutorial01());

  		this.levels[1].unshift(new LevelBasic10());
  		this.levels[1].unshift(new LevelBasic09());
  		this.levels[1].unshift(new LevelBasic08());
  		this.levels[1].unshift(new LevelBasic07());
  		this.levels[1].unshift(new LevelBasic06());
  		this.levels[1].unshift(new LevelBasic05());
  		this.levels[1].unshift(new LevelBasic04());
  		this.levels[1].unshift(new LevelBasic03());
  		this.levels[1].unshift(new LevelBasic02());
  		this.levels[1].unshift(new LevelBasic01());

  		this.levels[2].unshift(new LevelAva02());
  		this.levels[2].unshift(new LevelAva01());

  		this.levels[3].unshift(new LevelBoth01());

  		this.demoLevel = new DemoLevel(this.levels);
	},
	
	initInput: function() {
		ig.input.initMouse();
		ig.input.bind( ig.KEY.MOUSE1, 'onPress' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
	},

	pressedInMessageBox: function(x, y) {
		return x >= 0 && x < Constants.MSG_WINDOW_WIDTH &&
					 y >= Constants.HEIGHT - 3 * Constants.TILE_DY / 2 && y < Constants.HEIGHT;
	},

	onPress: function(mouseX, mouseY) {
		if (this.pressedInMessageBox(mouseX, mouseY)) {
			this.cancelMessage();
		}
		else if (this.currentLevel) {
			this.currentLevel.onPress(mouseX, mouseY);
		}
	},

	onRelease: function(mouseX, mouseY) {
		if (this.currentLevel) {
			this.currentLevel.onRelease(mouseX, mouseY);
		}
	},

	activateDuke: function() {
		if (this.currentLevel) {
			this.currentLevel.activateDuke();
		}
	},

	activateAva: function() {
		if (this.currentLevel) {
			this.currentLevel.activateAva();
		}
	},

	updateInput: function() {
		if (ig.input.pressed('onPress')) {
			this.onPress(ig.input.mouse.x, ig.input.mouse.y);
		}

		var bMouseDown = ig.input.state('onPress');
		if (!bMouseDown && this.bWasMouseDown) {
			this.onRelease(ig.input.mouse.x, ig.input.mouse.y);
		}
		this.bWasMouseDown = bMouseDown;

		if (ig.input.pressed('left')) {
			ig.Game.QueueCommand(Constants.DIRECTION.LEFT);
			if (this.currentLevel) this.currentLevel.updateInput();
		}

		if (ig.input.pressed('right')) {
			ig.Game.QueueCommand(Constants.DIRECTION.RIGHT);
			if (this.currentLevel) this.currentLevel.updateInput();
		}

		if (ig.input.pressed('up')) {
			ig.Game.QueueCommand(Constants.DIRECTION.UP);
			if (this.currentLevel) this.currentLevel.updateInput();
		}

		if (ig.input.pressed('down')) {
			ig.Game.QueueCommand(Constants.DIRECTION.DOWN);
			if (this.currentLevel) this.currentLevel.updateInput();
		}
	},
	
	init: function() {
	  ig.Game._game = this;

	  ig.Game._font = this.font;
	  this.initSounds();
	  ig.music.add('media/sound/gallop.mp3');

	  this.fillLevelArray();

	  this.curTime =	(new Date).getTime() * 0.001;
	  ig.Game._animTimer = 0;

	  this.initInput();

	  this.currentLevel = this.demoLevel;
	  this.startLevel();

	  this.levelIndex = -1;
	},

	startDemoLevel: function() {
		this.tierIndex = Constants.TIER.DEMO;
		this.startLevel();
	},

	startLevelInTier: function(levelIndex, tierIndex) {
		if (tierIndex >= Constants.TIER.TUTORIAL && tierIndex <= Constants.TIER.BOTH &&
				levelIndex >= 0 && levelIndex < this.levels[tierIndex].length) {
			this.tierIndex = tierIndex;
			this.levelIndex = levelIndex;
			this.startLevel();
		}
	},

	nextLevel: function() {
		if (this.tierIndex > Constants.TIER.DEMO) {
			var oldIndex = this.levelIndex;

			this.levelIndex += 1;
			this.levelIndex = Math.min(this.levelIndex, this.levels[this.tierIndex].length - 1);

			if (oldIndex !== this.levelIndex) {
				this.startLevel();
			}
			else {
				ig.Game.FlushMessages();
				this.flushMessage();
				ig.Game.AddMessage(Constants.TEXT_LAST_LEVEL);
			}
		}
	},

	prevLevel: function() {
		if (this.tierIndex > Constants.TIER.DEMO) {
			var oldIndex = this.levelIndex;

			this.levelIndex -= 1;
			this.levelIndex = Math.max(0, this.levelIndex);

			if (oldIndex !== this.levelIndex) {
				this.startLevel();
			}
			else {
				ig.Game.FlushMessages();
				this.flushMessage();
				ig.Game.AddMessage(Constants.TEXT_STARTING_LEVEL);
			}
		}
	},

	quitLevel: function() {
		ig.Game.FlushMessages();
		this.flushMessage();

		this.startDemoLevel();
	},

	startLevel: function() {
		if (this.tierIndex === Constants.TIER.DEMO || this.levelIndex < this.levels[this.tierIndex].length) {
			ig.Game.FlushMessages();
			this.flushMessage();

			if (this.currentLevel) {
				this.currentLevel.end();
			}

			if (this.tierIndex === Constants.TIER.DEMO) {
		  	this.currentLevel = this.demoLevel;
		  	ig.Game.sndTheme.play();
			}
			else {
		  	this.currentLevel = this.levels[this.tierIndex][this.levelIndex];
		  	ig.Game.sndTheme.stop();
		  }

	  	this.currentLevel.stopGallopLoop();

			// Initialize your game here; bind keys etc.
			this.currentLevel.resetLevel();
			this.currentLevel.createField();
			this.currentLevel.start();
		}
		else {
			ig.Game.AddMessage(Constants.TEXT_TUTORIAL_OVER, null, -1, null);
		}
	},
	
	update: function() {
		this.updateInput();

		// Update all entities and backgroundMaps
		this.parent();

		// Update game time.
		var newTime = (new Date).getTime() * 0.001;

		// Compute new dt.
		ig.Game._dt = newTime - this.curTime

		// Cap dt when we're in the debugger (or have very slow frame rate).
		if (ig.Game._dt > ig.Game.MAX_FRAME_DT) {
			ig.Game._dt = ig.Game.DEBUG_DT;
		}

		this.curTime = newTime;

		// Update the global anim timer.
		ig.Game._animTimer += ig.Game._dt;

		Sprite.computeAnimAngle();

		var oldDt = ig.Game._dt;
		this.physicsTime += ig.Game._dt;
		ig.Game._dt = ig.Game.PHYSICS_DT;

		while (this.physicsTime >= ig.Game.PHYSICS_DT) {
			// Force 20 Hz physics update.
			this.currentLevel.update();
			this.physicsTime -= ig.Game.PHYSICS_DT;
		}

		ig.Game._dt = oldDt;

		this.updateMessage();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		if (this.background) {
			this.background.draw(0, 0);
		}
		else {
			this.parent();
		}
		
		// Add your own drawing code here
		this.currentLevel.draw();

		this.drawMessage();
	},

	drawMessage: function() {
		if (this.curMsg) {
			var ctx = ig.system.context;
			ctx.save();

			var alphaParam = 1;
			if (this.fadeDir < 0) {
				alphaParam = Math.max(0, this.msgTimer / Constants.MESSAGE_FADE_TIME);
			}
			else if (this.fadeDir > 0) {
				alphaParam = Math.min(1 - this.msgTimer / Constants.MESSAGE_FADE_TIME, 1);
			}

			ctx.globalAlpha = alphaParam;
			this.font.draw(this.curMsg.text, Constants.MSG_WINDOW_WIDTH / 2, Constants.HEIGHT - 3 * Constants.TILE_DX / 4 - this.font.height / 4, ig.Font.ALIGN.CENTER);
			ctx.globalAlpha = 1;

			ctx.restore();
		}
	},

	cancelMessage: function() {
		if (this.fadeDir === 0) {
			// If the message is displaying, force it to fade out.
			this.fadeDir = -1;
			this.msgTimer = Constants.MESSAGE_FADE_TIME;
		}
		else if (this.fadeDir > 0) {
			// If it's fading in, reverse the process.
			this.fadeDir = -1;
			this.msgTimer = Constants.MESSAGE_FADE_TIME - this.msgTimer;
		}
	},

	flushMessage: function() {
		this.curMsg = null;
		this.fadeDir = -1;
		this.msgTimer = 0;
	},

	advanceMessage: function() {
		if (this.fadeDir < 0 && this.msgTimer <= 0 && ig.Game._curMsgIndex !== ig.Game._lastMsgIndex) {
			// Advance to the next message.
			ig.Game._curMsgIndex = (ig.Game._curMsgIndex + 1) % ig.Game._msgQueue.length;

			// Start the fade up.
			this.fadeDir = 1;
			this.msgTimer = Constants.MESSAGE_FADE_TIME;
			this.bAdvancedDuringCallback = true;

			this.curMsg = ig.Game._msgQueue[ig.Game._curMsgIndex];
		}
	},

	updateMessage: function() {
		// Update the current message, if any.
		if (this.msgTimer > 0 && this.fadeDir === 0) {
			this.msgTimer -= ig.Game._dt;

			if (this.msgTimer <= 0) {
				// Start fade out.
				this.msgTimer = Constants.MESSAGE_FADE_TIME;
				this.fadeDir = -1;
			}
		}
		else if (this.fadeDir < 0 && this.msgTimer > 0) {
			this.msgTimer -= ig.Game._dt;

			if (this.msgTimer <= 0) {
				var oldCurMsg = this.curMsg;

				// Fully faded out. If there's a callback, invoke it.
				this.bAdvancedDuringCallback = false;
				if (this.curMsg && this.curMsg.callback) {
					this.curMsg.callback();
				}

				// Start fade in to next message, if any. Check to make sure
				// the message wasn't advanced during the callback.
				if (!this.bAdvancedDuringCallback) {
					this.curMsg = null;
					this.advanceMessage();
				}
			}
		}
		else if (this.fadeDir > 0 && this.msgTimer > 0) {
			this.msgTimer -= ig.Game._dt;

			if (this.msgTimer <= 0) {
				// Fully faded in. Watch the message for it's duration.
				this.fadeDir = 0;
				this.msgTimer = ig.Game._msgQueue[ig.Game._curMsgIndex].duration;
				if (this.msgTimer < 0) {
					this.msgTimer = Constants.DEFAULT_MSG_TIME;
				}
			}
		}
	}
});

// Disable sound on mobile devices.
if (ig.ua.mobile) {
	ig.Sound.enabled = false;
};

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', Steps, 60, Constants.WIDTH, Constants.HEIGHT, 1 );

ig.Game.resetAnimTimer = function() {
	ig.Game._animTimer = 0;
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

ig.Game.FlushMessages = function() {
	ig.Game._lastMsgIndex = -1;
	ig.Game._curMsgIndex = -1;
	ig.Game._game.flushMessage();

	for (var i=0; i<ig.Game._msgQueue.length; ++i) {
		var msg = ig.Game._msgQueue[i];
		if (msg) {
			msg.text = "";
			msg.speaker = null;
			msg.duration = -1;
			msg.callback = null;
		}
	}
};

ig.Game.ActivateDuke = function() {
	ig.Game._game.activateDuke();
};

ig.Game.ActivateAva = function() {
	ig.Game._game.activateAva();
};

ig.Game.AddMessage = function(text, speaker, duration, callback) {
	ig.Game._lastMsgIndex = (ig.Game._lastMsgIndex + 1) % ig.Game._msgQueue.length;

	ig.Game._msgQueue[ig.Game._lastMsgIndex].text = text;
	ig.Game._msgQueue[ig.Game._lastMsgIndex].speaker = speaker;
	ig.Game._msgQueue[ig.Game._lastMsgIndex].duration = duration;
	ig.Game._msgQueue[ig.Game._lastMsgIndex].callback = callback;

	ig.Game._game.advanceMessage();
}

ig.Game.MAX_FRAME_DT	= 1.0;
ig.Game.DEBUG_DT 			= 1.0 / 30.0;
ig.Game.PHYSICS_DT 		= 1 / 20;

ig.Game.sndButton 		= null;
ig.Game.sndTheme 			=	null;
ig.Game.sndBlow				=	null;
ig.Game.sndHuff 			=	null;
ig.Game.sndNeigh 			= null;
ig.Game.sndGate 			= null;

ig.Game._dt						= 0;
ig.Game._animTimer 		= 0;
ig.Game._cmdQueue 		= [];
ig.Game._font  				= null;
ig.Game._game 				= null;
ig.Game._lastMsgIndex = -1;
ig.Game._curMsgIndex 	= -1;
ig.Game._msgQueue 		= [
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
													{text:"", speaker:null, duration:-1, callback: null},
												];

});
