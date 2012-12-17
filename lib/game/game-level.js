ig.module( 
	'game.game-level' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.base-level',
  'game.ui-tilt-button' 
)
.defines(function(){

GameLevel = BaseLevel.extend({

  init: function() {
    if (GameLevel._buttonBack === null) {
      GameLevel.CreateGameLevelButtons();
    }

    this.widgetList.push(GameLevel._buttonBack);
    this.widgetList.push(GameLevel._buttonSkip);
    this.widgetList.push(GameLevel._buttonQuit);
    this.widgetList.push(GameLevel._buttonRetry);
  },

  resetLevel: function() {
    this.initLevel(this.geometry, this.actors, this.hints, Constants.TEXT_TUTORIAL_VICTORY, Constants.VICTORY_MSG_DURATION, ig.Game._game.nextLevel.bind(ig.Game._game));
  }
});


GameLevel._buttonImages =    [
                              new ig.Image('media/art/ui_unskip.png'),
                              new ig.Image('media/art/ui_skip.png'),
                              new ig.Image('media/art/ui_quit.png'),
                              new ig.Image('media/art/ui_retry.png'),
                            ];


GameLevel._buttonBack =   null;
GameLevel._buttonSkip =   null;
GameLevel._buttonQuit =   null;
GameLevel._buttonRetry =  null;

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
    image:      GameLevel._buttonImages[0],
    tiltAngle:  Constants.TILT_ANGLE,
    tiltTime:   Constants.TILT_TIME,
    fnTrigger:  GameLevel.OnTiltButtonActivate,
    triggerData:"back"
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
};

});
