ig.module( 
	'game.demo-level' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.base-level',
  'game.ui-tilt-button',
  'game.ui-hotbox'
)
.defines(function(){

DemoLevel = BaseLevel.extend({
  titleStripe:  new ig.Image('media/art/demo-stripe.png'),
  titleImage:   new ig.Image('media/art/title.png'),
  geometry:     [
                  "...........................",
                  ".*.*.*.*.*.*.*.*.*.*.*.*.*.",
                  "._._._._._._._._._._._._._.",
                  "|*.*.*.*.*.*.*.*.*.5.*.*.*|",
                  "...........................",
                  "|*.*.*.*.*.2.*.*.*.*.*.*.*|",
                  "...........................",
                  "|*.*.*.*.*.*.*.*.*.*.*.*.*|",
                  "...........................",
                  "|*.*.*.1.*.*.*.*.*.2.*.*.*|",
                  "...........................",
                  "|*.*.*.*.*.*.*.*.*.*.*.*.*|",
                  "...........................",
                  "|*.6.*.*.*.*.*.*.*.*.*.*.*|",
                  "...........................",
                  "|*.*.*.*.*.*.3.*.*.*.*.*.*|",
                  "...........................",
                  "|*.*.*.*.*.*.*.*.*.*.*.*.*|",
                  "._._._._._._._._._._._._._.",
                ],

  hints:        [],
  state:        Constants.DEMO_STATE.NONE,
  levelInfo:    null,
  levelHotBox:  [
                ],

  init: function(levelInfo) {
    DemoLevel._demoLevel = this;

    this.levelInfo = levelInfo;

    // Create UI buttons for accessing levels and the tutorial.
    if (DemoLevel._buttonLearn === null) {
      DemoLevel.CreateDemoLevelButtons();
    }

    var maxLevels = 0;
    for (var i=0; this.levelInfo && i < this.levelInfo.length; ++i) {
      if (this.levelInfo[i].length > maxLevels) {
        maxLevels = this.levelInfo[i].length;
      }
    }

    var boxWidth = ig.Game._font.widthForString(Constants.DEFAULT_TEXT_WIDTH);
    var boxHeight = ig.Game._font.height * (1 + Constants.TILT_BUTTON_SPACER);
    var x = DemoLevel._plaquePos.x - DemoLevel._plaqueMode.width / 2 + boxWidth / 2;
    var y = DemoLevel._plaquePos.y + DemoLevel._plaqueMode.height / 2 - boxHeight / 2;

    for (var i=0; i<maxLevels; ++i) {
      var xOffset = (i % 5) * DemoLevel.HOTBOX_OFFSET_X;
      x += xOffset;

      this.levelHotBox.push(new HotBox(x, y, boxWidth, boxHeight, {
        onPressSound: ig.Game.sndButton,
        pressCallback:this.onHotBoxPressed.bind(this),
        pressData:("" + i)}));

      x -= xOffset;
      y += boxHeight * (1 + Constants.TILT_BUTTON_SPACER);
    }

    this.addWidgets();
  },

  updateGallopLoop: function() {
    // No galloping on the demo level.
  },

  startGallopLoop: function() {
    // No galloping on the demo level.
  },

  onHotBoxPressed: function(hotBoxData) {
    var boxId = parseInt(hotBoxData);

    if (boxId >= 0 && boxId < this.levelInfo[this.state].length) {
      ig.Game._game.startLevelInTier(boxId, this.state);
    }
  },

  addWidgets: function() {
    this.widgetList.push(DemoLevel._buttonLearn);
    this.widgetList.push(DemoLevel._buttonDuke);
    this.widgetList.push(DemoLevel._buttonAva);
    this.widgetList.push(DemoLevel._buttonBoth);
  },

  addHotBoxes: function() {
    for (var i=0; i<this.levelHotBox.length; ++i) {
      this.widgetList.push(this.levelHotBox[i]);
      this.levelHotBox[i].activate();
    }
  },

  removeWidgets: function() {
    this.widgetList.erase(DemoLevel._buttonLearn);
    this.widgetList.erase(DemoLevel._buttonDuke);
    this.widgetList.erase(DemoLevel._buttonAva);
    this.widgetList.erase(DemoLevel._buttonBoth);
  },

  removeHotBoxes: function() {
    for (var i=0; i<this.levelHotBox.length; ++i) {
      this.widgetList.erase(this.levelHotBox[i]);
      this.levelHotBox[i].deactivate();
    }
  },

  showComingSoonMessage: function() {
    ig.Game.FlushMessages();
    ig.Game.AddMessage(Constants.TEXT_LEVELS_DONT_EXIST, null, Constants.VICTORY_MSG_DURATION, null);
  },

  chooseTutorialLevel: function() {
    if (this.levelInfo && this.levelInfo[Constants.DEMO_STATE.CHOOSE_TUTORIAL_LEVEL].length) {
      this.state = Constants.DEMO_STATE.CHOOSE_TUTORIAL_LEVEL;
      this.removeWidgets();
      this.addHotBoxes();
    }
    else {
      this.showComingSoonMessage();
    }
  },

  chooseDukeLevel: function() {
    if (this.levelInfo && this.levelInfo[Constants.DEMO_STATE.CHOOSE_DUKE_LEVEL].length) {
      this.state = Constants.DEMO_STATE.CHOOSE_DUKE_LEVEL;
      this.removeWidgets();
      this.addHotBoxes();
    }
    else {
      this.showComingSoonMessage();
    }
  },

  chooseAvaLevel: function() {
    if (this.levelInfo && this.levelInfo[Constants.DEMO_STATE.CHOOSE_AVA_LEVEL].length) {
      this.state = Constants.DEMO_STATE.CHOOSE_AVA_LEVEL;
      this.removeWidgets();
      this.addHotBoxes();
    }
    else {
      this.showComingSoonMessage();
    }
  },

  chooseBothLevel: function() {
    if (this.levelInfo && this.levelInfo[Constants.DEMO_STATE.CHOOSE_BOTH_LEVEL].length) {
      this.state = Constants.DEMO_STATE.CHOOSE_BOTH_LEVEL;
      this.removeWidgets();
      this.addHotBoxes();
    }
    else {
      this.showComingSoonMessage();
    }
  },

  enterIntroState: function() {
    if (this.state !== Constants.DEMO_STATE.INTRO) {
      this.state = Constants.DEMO_STATE.INTRO;
      this.removeHotBoxes();
      this.addWidgets();
    }
  },

  resetLevel: function() {
    this.parent();
    
    this.initLevel(this.geometry, this.hints, Constants.TEXT_TUTORIAL_VICTORY, Constants.VICTORY_MSG_DURATION, ig.Game._game.nextLevel.bind(ig.Game._game));
    this.addRandomFences();

    this.removeWidgets();
    this.enterIntroState();
  },

  onPress: function(x, y) {
    var bConsumed = this.parent(x, y);

    if (!bConsumed) {
      this.enterIntroState();
    }

    return true;
  },

  updateInput: function() {
    while (ig.Game.CommandReady()) {
      var cmd = ig.Game.UnqueueCommand();
    }
  },

  update: function() {
    // CHECK: should we move a random animal?
    if (Math.random() < DemoLevel.RANDOM_MOVE_CHANCE * ig.Game._dt) {
      var randomAnimal = this.duke;
      if (Math.random() > DemoLevel.DUKE_MOVE_CHANCE) {
        var animalIndex = Math.floor(Math.random() * this.animals.length);
        randomAnimal = this.animals[animalIndex];
      }

      if (randomAnimal.isMoving()) {
        randomAnimal.setDirection(Constants.DIRECTION.BLOCKED);
      }
      else {
        var moveDir = Math.floor(Math.random() * (Constants.DIRECTION.LEFT + 1));
        randomAnimal.setDirection(moveDir);
      }
    }

    this.parent();
  },

  drawWidgets: function() {
    // Disabled.
  },

  postDrawWidgets: function() {
    // Need to draw the widgets last so they appear over the background stripe.
    this.drawAllWidgets();
  },

  draw: function() {
    this.parent();

    if (this.titleStripe) {
      this.titleStripe.draw(0, Constants.HEIGHT / 2 - this.titleStripe.height / 2);
    }
    
    if (this.titleImage) {
      var leftEdge = Constants.OFFSET_X + Constants.COLS * Constants.TILE_DX;
      this.titleImage.draw(leftEdge / 2 - this.titleImage.width / 2, Constants.HEIGHT / 2 - this.titleImage.height / 2);
    }

    switch(this.state) {
      case Constants.DEMO_STATE.INTRO: {
        if (DemoLevel._plaqueMode) {
          DemoLevel._plaqueMode.draw(DemoLevel._plaquePos.x - DemoLevel._plaqueMode.width / 2, DemoLevel._plaquePos.y - DemoLevel._plaqueMode.height / 2);
        }
        break;
      }

      default: {
        if (DemoLevel._plaqueMode) {
          DemoLevel._plaqueLevel.draw(DemoLevel._plaquePos.x - DemoLevel._plaqueMode.width / 2, DemoLevel._plaquePos.y - DemoLevel._plaqueMode.height / 2);
        }

        var ctx = ig.system.context;
        ctx.save();
        ctx.lineWidth = 2;

        var nLevels = this.levelInfo && (typeof(this.levelInfo[this.state]) !== 'undefined') ? this.levelInfo[this.state].length : 0;
        for (var i=0; i<nLevels; ++i) {
          var bounds = this.levelHotBox[i].getBoundsRef();
          var x = bounds.x;
          var y = bounds.y;
          var boxWidth = bounds.width;
          var boxHeight = bounds.height;

          x += Constants.DROPSHADOW_OFFSET_X;
          y += Constants.DROPSHADOW_OFFSET_Y;

          ctx.strokeStyle = Constants.DROPSHADOW_STROKE;
          ctx.fillStyle = Constants.DROPSHADOW_FILL;
          ctx.globalAlpha = Constants.DROPSHADOW_ALPHA;
        
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + boxWidth, y);
          ctx.lineTo(x + boxWidth, y + boxHeight);
          ctx.lineTo(x, y + boxHeight);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          x -= Constants.DROPSHADOW_OFFSET_X;
          y -= Constants.DROPSHADOW_OFFSET_Y;

          ctx.strokeStyle = Constants.STROKE_PURPLE;
          ctx.fillStyle = Constants.FILL_PURPLE;
          ctx.globalAlpha = 1;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + boxWidth, y);
          ctx.lineTo(x + boxWidth, y + boxHeight);
          ctx.lineTo(x, y + boxHeight);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ig.Game._font.draw("Level " + (i + 1), x + boxWidth / 2, y + boxHeight / 8, ig.Font.ALIGN.CENTER);
        }

        ctx.restore();

        break;
      }
    }

    this.postDrawWidgets();
  }

});

DemoLevel._plaquePos    = {x:910, y:97};
DemoLevel._plaqueMode   = new ig.Image('media/art/plaque-pick-mode.png');
DemoLevel._plaqueLevel  = new ig.Image('media/art/plaque-pick-level.png');

DemoLevel._buttonImages =    [
                              new ig.Image('media/art/tilt-btn-learn.png'),
                              new ig.Image('media/art/tilt-btn-duke.png'),
                              new ig.Image('media/art/tilt-btn-ava.png'),
                              new ig.Image('media/art/tilt-btn-both.png'),
                            ];


DemoLevel._buttonLearn  = null;
DemoLevel._buttonDuke   = null;
DemoLevel._buttonAva    = null;
DemoLevel._buttonBoth   = null;

DemoLevel._demoLevel    = null;

DemoLevel.OnTiltButtonActivate = function(cmd) {
  if (DemoLevel._demoLevel) {
    if (cmd === "learn") {
      DemoLevel._demoLevel.chooseTutorialLevel();
    }
    else if (cmd === "duke") {
      DemoLevel._demoLevel.chooseDukeLevel();
    }
    else if (cmd === "ava") {
      DemoLevel._demoLevel.chooseAvaLevel();
    }
    else if (cmd === "both") {
      DemoLevel._demoLevel.chooseBothLevel();
    }
  }
},

DemoLevel.CreateDemoLevelButtons = function() {
  var buttonSettings = {
    onPressSound: ig.Game.sndButton,
    image:        DemoLevel._buttonImages[0],
    tiltAngle:    Constants.TILT_ANGLE,
    tiltTime:     Constants.TILT_TIME,
    fnTrigger:    DemoLevel.OnTiltButtonActivate,
    triggerData:  "learn"
  }; 

  // Compute button locations.
  var x = DemoLevel._plaquePos.x - DemoLevel._plaqueMode.width / 4;
  var plaqueBottom = DemoLevel._plaquePos.y + 2 * DemoLevel._plaqueMode.height / 5;
  var spaceY = Constants.HEIGHT - plaqueBottom;
  var btnSpacerY = DemoLevel._buttonImages[0].height * (1 + Constants.TILT_BUTTON_SPACER);
  var btnSlackY = spaceY - 4 * btnSpacerY;
  var btnOffsetY = Math.max(0, btnSlackY / 2);
  var y = plaqueBottom + btnOffsetY;

  // Create 'learn' button.
  DemoLevel._buttonLearn = new TiltButton(x, y, buttonSettings);
  y += btnSpacerY;

  // Create 'duke' button.
  buttonSettings.image = DemoLevel._buttonImages[1];
  buttonSettings.triggerData = "duke";
  DemoLevel._buttonDuke = new TiltButton(x, y, buttonSettings);
  y += btnSpacerY;

  // Create 'ava' button.
  buttonSettings.image = DemoLevel._buttonImages[2];
  buttonSettings.triggerData = "ava";
  DemoLevel._buttonAva = new TiltButton(x, y, buttonSettings);
  y += btnSpacerY;

  // Create 'retry' button.
  buttonSettings.image = DemoLevel._buttonImages[3];
  buttonSettings.triggerData = "both";
  DemoLevel._buttonBoth = new TiltButton(x, y, buttonSettings);
};

DemoLevel.RANDOM_MOVE_CHANCE    = 1;
DemoLevel.DUKE_MOVE_CHANCE      = 1 / 20;
DemoLevel.HOTBOX_OFFSET_X       = 10;

});
