ig.module( 
	'game.constants' 
)

.defines(function(){

Constants = ig.Class.extend({
});

Constants.WIDTH		= 				1024;
Constants.HEIGHT	= 				768;
Constants.TILE_DX	= 				64;
Constants.TILE_DY	= 				64;
Constants.ROWS    =         Math.floor(Constants.HEIGHT / Constants.TILE_DY) - 2;
Constants.COLS    =         Math.floor(Constants.WIDTH / Constants.TILE_DX) - 1;


Constants.TURN_LENGTH       = 1;
Constants.CORRECTION_DX     = Constants.TILE_DX;
Constants.CORRECTION_DY     = Constants.TILE_DY;

Constants.OFFSET_Y          = Constants.TILE_DY / 2;
Constants.OFFSET_X          = Constants.TILE_DX / 2;

Constants.INDEX_HORZ 				= 0;
Constants.INDEX_VERT 				= 1;

Constants.REAR_DURATION     = 1.0;

Constants.GOAL_ROW          = 0;
Constants.GOAL_COL          = 10;
Constants.GOAL_X            = Constants.OFFSET_X + Constants.GOAL_COL * Constants.TILE_DY;
Constants.GOAL_Y            = Constants.OFFSET_Y + Constants.GOAL_ROW * Constants.TILE_DX;

Constants.GENDER            = {MALE:    0,
                               FEMALE:  1};

Constants.COAT              = {SOLID:   0,
                               PINTO:   1};

Constants.HORSE_STATE       = {RESTING:   0,
                               RUNNING:   1,
                               WAITING:   2},

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

Constants.PATTERN_RIGHT_THEN_LEFT   = [
                                        [Constants.DIRECTION.UP, Constants.DIRECTION.RIGHT, Constants.DIRECTION.LEFT],
                                        [Constants.DIRECTION.RIGHT, Constants.DIRECTION.DOWN, Constants.DIRECTION.UP],
                                        [Constants.DIRECTION.DOWN, Constants.DIRECTION.LEFT, Constants.DIRECTION.RIGHT],
                                        [Constants.DIRECTION.LEFT, Constants.DIRECTION.UP, Constants.DIRECTION.DOWN],
                                      ];

Constants.PASTURE_INDEX	    = 0;

});
