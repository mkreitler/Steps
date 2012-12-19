ig.module( 
	'game.game-level' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.base-level',
  'game.ui-tilt-button',
  'game.ui-hotbox',
  'game.ui-two-state-button'

)
.defines(function(){

GameLevel = BaseLevel.extend({
  dukeImages: [
                new ig.Image('media/art/duke-unavailable.png'),
                new ig.Image('media/art/duke-ready.png'),
                new ig.Image('media/art/duke-selected.png'),
              ],

  avaImages:  [
                new ig.Image('media/art/ava-unavailable.png'),
                new ig.Image('media/art/ava-ready.png'),
                new ig.Image('media/art/ava-selected.png'),
              ],

  dukeSelector: null,
  avaSelector:  null,

  init: function() {
    if (GameLevel._buttonBack === null) {
      GameLevel.CreateGameLevelButtons();
    }

    if (GameLevel._dpadBtns.length === 0) {
      GameLevel.CreateDPadButtons();
    }

    this.dukeSelector = new HotBox(this.getDukeSelImageX(GameLevel.ACTOR_SELECT_STATES.SELECTED),
                                   this.getDukeSelImageY(GameLevel.ACTOR_SELECT_STATES.SELECTED),
                                   this.dukeImages[GameLevel.ACTOR_SELECT_STATES.SELECTED].width,
                                   this.dukeImages[GameLevel.ACTOR_SELECT_STATES.SELECTED].height, {
      onPressSound: ig.Game.sndButton,
      pressCallback:ig.Game.ActivateDuke
    });
    this.addWidget(this.dukeSelector);

    this.avaSelector = new HotBox(this.getAvaSelImageX(GameLevel.ACTOR_SELECT_STATES.SELECTED),
                                  this.getAvaSelImageY(GameLevel.ACTOR_SELECT_STATES.SELECTED),
                                  this.avaImages[GameLevel.ACTOR_SELECT_STATES.SELECTED].width,
                                  this.avaImages[GameLevel.ACTOR_SELECT_STATES.SELECTED].height, {
      onPressSound: ig.Game.sndButton,
      pressCallback:ig.Game.ActivateAva
    });
    this.addWidget(this.avaSelector);

    this.widgetList.push(GameLevel._buttonBack);
    this.widgetList.push(GameLevel._buttonSkip);
    this.widgetList.push(GameLevel._buttonQuit);
    this.widgetList.push(GameLevel._buttonRetry);

    for (var i=1; i<GameLevel._dpadImages.length; ++i) {
      this.addWidget(GameLevel._dpadBtns[i - 1]);
    }
  },

  drawWidgets: function() {
    // Disabled.
  },

  postDrawWidgets: function() {
    // Need to draw the widgets last so they appear over the background stripe.
    this.drawAllWidgets();
  },

  getDukeSelImageX: function(imageIndex) {
    return GameLevel.xCenter - this.dukeImages[imageIndex].width / 2;
  },

  getDukeSelImageY: function(imageIndex) {
    return 3 * Constants.TILE_DY / 2 - this.dukeImages[imageIndex].height / 2;
  },

  getAvaSelImageX: function(imageIndex) {
    return GameLevel.xCenter - this.avaImages[imageIndex].width / 2;
  },

  getAvaSelImageY: function(imageIndex) {
    return 5 * Constants.TILE_DY - this.avaImages[imageIndex].height / 2;
  },

  draw: function() {
    this.parent();

    if (GameLevel._dpadImages[0] && GameLevel._buttonSkip) {
      var x = GameLevel.xCenter - GameLevel._dpadImages[0].width / 2;
      var y = GameLevel.yBottom - GameLevel._dpadImages[0].height;
      GameLevel._dpadImages[0].draw(x, y);

      // Draw the actor selection images.
      var imageIndex = GameLevel.ACTOR_SELECT_STATES.READY;
      var actorImage = this.dukeImages[GameLevel.ACTOR_SELECT_STATES.READY];
      if (this.duke) {
        if (this.activeActor === this.duke) {
          imageIndex = GameLevel.ACTOR_SELECT_STATES.SELECTED;
          actorImage = this.dukeImages[GameLevel.ACTOR_SELECT_STATES.SELECTED];
        }
      }
      else {
        imageIndex = GameLevel.ACTOR_SELECT_STATES.UNAVAILABLE;
        actorImage = this.dukeImages[GameLevel.ACTOR_SELECT_STATES.UNAVAILABLE];
      }

      actorImage.draw(this.getDukeSelImageX(imageIndex), this.getDukeSelImageY(imageIndex));

      imageIndex = GameLevel.ACTOR_SELECT_STATES.READY;
      actorImage = this.avaImages[GameLevel.ACTOR_SELECT_STATES.READY];
      if (this.ava) {
        if (this.activeActor === this.ava) {
          imageIndex = GameLevel.ACTOR_SELECT_STATES.SELECTED;
          actorImage = this.avaImages[GameLevel.ACTOR_SELECT_STATES.SELECTED];
        }
      }
      else {
        imageIndex = GameLevel.ACTOR_SELECT_STATES.UNAVAILABLE;
        actorImage = this.avaImages[GameLevel.ACTOR_SELECT_STATES.UNAVAILABLE];
      }

      actorImage.draw(this.getAvaSelImageX(imageIndex), this.getAvaSelImageY(imageIndex));

      if (false) { // DEBUG
        for (var i=0; i<GameLevel._dpadBtns.length; ++i) {
          var ctx = ig.system.context;
          ctx.save();

          ctx.lineWidth = 2;
          ctx.strokeStyle = "#00FF00";
          ctx.fillStyle = "#00FFFF";

          var bounds = GameLevel._dpadBtns[i].getBoundsRef();
          ctx.beginPath();
          ctx.moveTo(bounds.x, bounds.y);
          ctx.lineTo(bounds.x + bounds.width, bounds.y);
          ctx.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
          ctx.lineTo(bounds.x, bounds.y + bounds.height);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();
        }
      }
    }

    this.postDrawWidgets();
  },

  resetLevel: function() {
    this.initLevel(this.geometry, this.hints, Constants.TEXT_TUTORIAL_VICTORY, Constants.VICTORY_MSG_DURATION, ig.Game._game.nextLevel.bind(ig.Game._game));
    GameLevel._currentLevel = this;
  }
});

GameLevel._currentLevel = null;

GameLevel._buttonImages =    [
                              new ig.Image('media/art/ui_unskip.png'),
                              new ig.Image('media/art/ui_skip.png'),
                              new ig.Image('media/art/ui_quit.png'),
                              new ig.Image('media/art/ui_retry.png'),
                            ];

GameLevel._dpadImages   = [
                            new ig.Image('media/art/d-pad.png'),
                            new ig.Image('media/art/dpad-up.png'),
                            new ig.Image('media/art/dpad-right.png'),
                            new ig.Image('media/art/dpad-down.png'),
                            new ig.Image('media/art/dpad-left.png'),
                          ];

GameLevel._buttonBack =   null;
GameLevel._buttonSkip =   null;
GameLevel._buttonQuit =   null;
GameLevel._buttonRetry =  null;

GameLevel._dpadBtns   = [];

GameLevel._dpadBtnOffsets   = [
                                {x:81, y:161 - 127},
                                {x:130, y:161 - 81},
                                {x:81, y:147 - 21},
                                {x:33, y:161 - 81},
                              ];

GameLevel.CreateDPadButtons = function() {
  if (GameLevel._dpadImages[0]) {
    var x = GameLevel.xCenter - GameLevel._dpadImages[0].width / 2;
    var y = GameLevel.yBottom - GameLevel._dpadImages[0].height

    for (var i=1; i<GameLevel._dpadImages.length; ++i) {
      var btnX = x + GameLevel._dpadBtnOffsets[i - 1].x - GameLevel._dpadImages[i].width / 2;
      var btnY = y + GameLevel._dpadBtnOffsets[i - 1].y - GameLevel._dpadImages[i].height / 2;

      GameLevel._dpadBtns.push(new TwoStateButton(btnX, btnY, GameLevel._dpadImages[i].width, GameLevel._dpadImages[i].height, {
        pressCallback: GameLevel.OnDPadButtonPressed,
        pressData: "" + (i - 1),
        imageUp: null,
        imageDown: GameLevel._dpadImages[i],
        releaseCallback: null,
        releaseData: null
      }));
    }
  }
};

GameLevel.OnDPadButtonPressed = function(pressData) {
  if (GameLevel._currentLevel) {
    var direction = parseInt(pressData);
    ig.Game.QueueCommand(direction);
    GameLevel._currentLevel.updateInput();
  }
};

GameLevel.OnTiltButtonActivate = function(cmd) {
  if (cmd === "back") {
    ig.Game._game.prevLevel();
  }
  else if (cmd === "skip") {
    ig.Game._game.nextLevel();
  }
  else if (cmd === "quit") {
    ig.Game._game.quitLevel();
  }
  else if (cmd === "retry") {
    ig.Game._game.startLevel();
  }
},

GameLevel.CreateGameLevelButtons = function() {
  var buttonSettings = {
    onPressSound: ig.Game.sndButton,
    image:        GameLevel._buttonImages[0],
    tiltAngle:    Constants.TILT_ANGLE,
    tiltTime:     Constants.TILT_TIME,
    fnTrigger:    GameLevel.OnTiltButtonActivate,
    triggerData:  "back"
  }; 

  var leftEdge = Constants.OFFSET_X + Constants.COLS * Constants.TILE_DX;
  var rightWidth = Constants.WIDTH - leftEdge;

  // Compute button locations.
  var leftCol = leftEdge + buttonSettings.image.width * 2 * Constants.TILT_BUTTON_SPACER;
  var rightCol = Constants.WIDTH - buttonSettings.image.width * (1 + Constants.TILT_BUTTON_SPACER);
  var bottomRow = Constants.HEIGHT - buttonSettings.image.height * (1 + 2 * Constants.TILT_BUTTON_SPACER);
  var topRow = bottomRow - (1 + Constants.TILT_BUTTON_SPACER) * buttonSettings.image.height;

  // Create 'back' button.
  GameLevel._buttonBack = new TiltButton(leftCol, topRow, buttonSettings);

  // Create 'skip' button.
  buttonSettings.image = GameLevel._buttonImages[1];
  buttonSettings.triggerData = "skip";
  GameLevel._buttonSkip = new TiltButton(rightCol, topRow, buttonSettings);

  // Create 'quit' button.
  buttonSettings.image = GameLevel._buttonImages[2];
  buttonSettings.triggerData = "quit";
  GameLevel._buttonQuit = new TiltButton(leftCol, bottomRow, buttonSettings);

  // Create 'retry' button.
  buttonSettings.image = GameLevel._buttonImages[3];
  buttonSettings.triggerData = "retry";
  GameLevel._buttonRetry = new TiltButton(rightCol, bottomRow, buttonSettings);

  var leftEdge = 2 * Constants.OFFSET_X + Constants.COLS * Constants.TILE_DX;
  var rightWidth = Constants.WIDTH - leftEdge;
  GameLevel.xCenter = leftEdge + rightWidth / 2;
  GameLevel.yBottom = GameLevel._buttonSkip.getBoundsRef().y - Constants.TILE_DY / 2;
};

GameLevel.xCenter = 0;
GameLevel.xBottom = 0;

GameLevel.ACTOR_SELECT_STATES = {UNAVAILABLE: 0,
                                 READY: 1,
                                 SELECTED:2 };

});
