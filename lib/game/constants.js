ig.module( 
	'game.constants' 
)

.defines(function(){

Constants = ig.Class.extend({
});

Constants.VICTORY_MSG_DURATION    = 2;
Constants.ESCAPED_MSG_DURATION    = 2;

Constants.TEXT_TUTORIAL_VICTORY   = "Well Done!";
Constants.TEXT_TUTORIAL_OVER      = "Congratulations! You have completed the tutorial.";
Constants.TEXT_LAST_LEVEL         = "This is the last level.";
Constants.TEXT_STARTING_LEVEL     = "This is the first level.";
Constants.TEXT_CONTROL_NOT_READY  = "This control isn't hooked up, yet.";
Constants.TEXT_ESCAPED            = "Escaped!";
Constants.TEXT_TRY_AGAIN          = "Better try again.";
Constants.TEXT_LEVELS_DONT_EXIST  = "Coming Soon...";

Constants.DEFAULT_TEXT_WIDTH      = "Level 777";
Constants.STROKE_PURPLE           = "#7407b7";
Constants.FILL_PURPLE             = "#9c71ff";
Constants.DROPSHADOW_STROKE       = "#000000";
Constants.DROPSHADOW_FILL         = "#000000";

Constants.DRAW_OFFSET_DX          = 2;
Constants.DRAW_OFFSET_DY          = 2;
Constants.DROPSHADOW_OFFSET_X     = 4;
Constants.DROPSHADOW_OFFSET_Y     = 4;
Constants.DROPSHADOW_ALPHA        = 0.25;

Constants.WIDTH		= 				1024;
Constants.HEIGHT	= 				768;
Constants.TILE_DX	= 				64;
Constants.TILE_DY	= 				64;
Constants.ROWS    =         9;
Constants.COLS    =         13;

Constants.DEMO_STATE        = {INTRO:-1,
                               CHOOSE_TUTORIAL_LEVEL:0,
                               CHOOSE_DUKE_LEVEL:1,
                               CHOOSE_AVA_LEVEL:2,
                               CHOOSE_BOTH_LEVEL:3};

Constants.TURN_LENGTH       = 1;
Constants.CORRECTION_DX     = Constants.TILE_DX;
Constants.CORRECTION_DY     = Constants.TILE_DY;

Constants.OFFSET_Y          = 3 * Constants.TILE_DY / 2;
Constants.OFFSET_X          = Constants.TILE_DX / 4;
Constants.MOVE_SPOOK_RADIUS = 3 * Constants.TILE_DX / 5;
Constants.FORCE_SPOOK_RADIUS= Constants.TILE_DX;

Constants.TILT_TIME         = 0.25;
Constants.TILT_ANGLE        = 15 * Math.PI / 180;
Constants.TILT_BUTTON_SPACER= 0.167;

Constants.INDEX_HORZ        = 0;
Constants.INDEX_VERT        = 1;
Constants.INDEX_TALLHORZ    = 2;
Constants.INDEX_TALLVERT    = 3;
Constants.INDEX_GATEHORZ    = 4;
Constants.INDEX_GATEVERT    = 5;

Constants.MESSAGE_FADE_TIME = 0.33;
Constants.DEFAULT_MSG_TIME  = 7.0;
Constants.MSG_WINDOW_WIDTH  = 865;

Constants.REAR_DURATION     = 1.0;
Constants.JUMP_DURATION     = 0.5;
Constants.PHASE_FACTOR      = 10;

Constants.GOAL_ROW          = 0;
Constants.GOAL_COL          = 9;
Constants.GOAL_X            = Constants.OFFSET_X + Constants.GOAL_COL * Constants.TILE_DY;
Constants.GOAL_Y            = Constants.OFFSET_Y + Constants.GOAL_ROW * Constants.TILE_DX;

Constants.GENDER            = {MALE:    0,
                               FEMALE:  1};

Constants.COAT              = {SOLID:   0,
                               PINTO:   1};

Constants.TIER              = {DEMO:    -1,
                               TUTORIAL: 0,
                               DUKE:     1,
                               AVA:      2,
                               BOTH:     3},

Constants.HORSE_STATE       = {RESTING:   0,
                               RUNNING:   1,
                               WAITING:   2,
                               JUMPING:   3},

Constants.DIRECTION         = {UP:      0,
                               RIGHT:   1,
                               DOWN:    2,
                               LEFT:    3,
                               BLOCKED: -1,
                               NONE:    99};

Constants.STAGE             = {IDLE:    -1,
                               SETUP:   0,
                               RESOLVE: 1,
                               FINISH:  2};

Constants.BLOCK_TYPE        = {NONE:    0,
                               HARD:    1};

Constants.COLLISION_FLAGS   = {HIGH:    0x01,
                               GATE:    0x02};

Constants.PATTERN_RIGHT_THEN_LEFT   = [
                                        [Constants.DIRECTION.UP, Constants.DIRECTION.RIGHT, Constants.DIRECTION.LEFT],
                                        [Constants.DIRECTION.RIGHT, Constants.DIRECTION.DOWN, Constants.DIRECTION.UP],
                                        [Constants.DIRECTION.DOWN, Constants.DIRECTION.LEFT, Constants.DIRECTION.RIGHT],
                                        [Constants.DIRECTION.LEFT, Constants.DIRECTION.UP, Constants.DIRECTION.DOWN],
                                      ];

Constants.PATTERN_LEFT_THEN_RIGHT   = [
                                        [Constants.DIRECTION.UP, Constants.DIRECTION.LEFT, Constants.DIRECTION.RIGHT],
                                        [Constants.DIRECTION.RIGHT, Constants.DIRECTION.UP, Constants.DIRECTION.DOWN],
                                        [Constants.DIRECTION.DOWN, Constants.DIRECTION.RIGHT, Constants.DIRECTION.LEFT],
                                        [Constants.DIRECTION.LEFT, Constants.DIRECTION.DOWN, Constants.DIRECTION.UP],
                                      ];

Constants.PASTURE_INDEX	    = 2;
Constants.GOAL_PASTURE_INDEX= 0;

});
